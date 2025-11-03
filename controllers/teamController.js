const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res, next) => {
  try {
    const {
      name,
      description,
      hackathon,
      maxMembers,
      skillsNeeded,
      requirements,
      tags,
      projectIdea
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide team name'
      });
    }

    let hackathonDoc = null;
    if (hackathon) {
      // Check if hackathon exists
      hackathonDoc = await Hackathon.findById(hackathon);
      if (!hackathonDoc) {
        return res.status(404).json({
          success: false,
          message: 'Hackathon not found'
        });
      }

      // Check if user is already in a team for this hackathon
      const existingTeam = await Team.findOne({
        hackathon,
        $or: [
          { leader: req.user.id },
          { members: req.user.id }
        ]
      });

      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: 'You are already part of a team for this hackathon'
        });
      }
    }

    // Create team
    const team = await Team.create({
      name,
      description: description || '',
      hackathon: hackathon || undefined,
      leader: req.user.id,
      members: [req.user.id],
      maxMembers: maxMembers || (hackathonDoc ? hackathonDoc.maxTeamSize : 5),
      skillsNeeded: skillsNeeded || [],
      requirements: requirements || '',
      tags: tags || [],
      projectIdea: projectIdea || ''
    });

    // Add team to hackathon if provided
    if (hackathonDoc) {
      hackathonDoc.teams.push(team._id);
      await hackathonDoc.save();
    }

    await team.populate('leader', 'name email avatar');
    await team.populate('members', 'name email avatar role skills');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
  try {
    const { hackathon, status, skills, search } = req.query;
    const query = {};

    if (hackathon) {
      query.hackathon = hackathon;
    }

    if (status) {
      query.status = status;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skillsNeeded = { $in: skillsArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const teams = await Team.find(query)
      .populate('hackathon', 'name startDate endDate')
      .populate('leader', 'name email avatar role')
      .populate('members', 'name email avatar role skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('hackathon', 'name startDate endDate location')
      .populate('leader', 'name email avatar role experience github linkedin portfolio')
      .populate('members', 'name email avatar role skills experience github linkedin portfolio');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a team
// @route   POST /api/teams/:id/join
// @access  Private
exports.joinTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('hackathon');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if team is open
    if (team.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Team is not accepting new members'
      });
    }

    // Check if user is already a member
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team'
      });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Team is full'
      });
    }

    // Check if user is already in another team for this hackathon
    const existingTeam = await Team.findOne({
      hackathon: team.hackathon._id,
      $or: [
        { leader: req.user.id },
        { members: req.user.id }
      ]
    });

    if (existingTeam && existingTeam._id.toString() !== team._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of another team for this hackathon'
      });
    }

    // Add user to team
    team.members.push(req.user.id);
    await team.save();

    await team.populate('leader', 'name email avatar');
    await team.populate('members', 'name email avatar role skills');

    res.status(200).json({
      success: true,
      message: 'Successfully joined the team',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a team
// @route   POST /api/teams/:id/leave
// @access  Private
exports.leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is a member
    if (!team.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this team'
      });
    }

    // Check if user is the leader
    if (team.leader.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Team leader cannot leave. Transfer leadership or delete the team.'
      });
    }

    // Remove user from team
    team.members = team.members.filter(
      member => member.toString() !== req.user.id.toString()
    );
    await team.save();

    await team.populate('leader', 'name email avatar');
    await team.populate('members', 'name email avatar role skills');

    res.status(200).json({
      success: true,
      message: 'Successfully left the team',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
exports.updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is the leader
    if (team.leader.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can update the team'
      });
    }

    const {
      name,
      description,
      maxMembers,
      skillsNeeded,
      requirements,
      tags,
      projectIdea,
      status
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (maxMembers) updateData.maxMembers = maxMembers;
    if (skillsNeeded) updateData.skillsNeeded = skillsNeeded;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (tags) updateData.tags = tags;
    if (projectIdea !== undefined) updateData.projectIdea = projectIdea;
    if (status) updateData.status = status;

    team = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('hackathon', 'name startDate endDate')
      .populate('leader', 'name email avatar role')
      .populate('members', 'name email avatar role skills');

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is the leader
    if (team.leader.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can delete the team'
      });
    }

    // Remove team from hackathon
    const hackathon = await Hackathon.findById(team.hackathon);
    if (hackathon) {
      hackathon.teams = hackathon.teams.filter(
        teamId => teamId.toString() !== team._id.toString()
      );
      await hackathon.save();
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is the leader
    if (team.leader.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can remove members'
      });
    }

    // Check if member exists in team
    if (!team.members.includes(req.params.memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Member not found in team'
      });
    }

    // Remove member
    team.members = team.members.filter(
      member => member.toString() !== req.params.memberId
    );
    await team.save();

    await team.populate('leader', 'name email avatar');
    await team.populate('members', 'name email avatar role skills');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

