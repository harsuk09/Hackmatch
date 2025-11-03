const Hackathon = require('../models/Hackathon');
const Team = require('../models/Team');

// @desc    Create a new hackathon
// @route   POST /api/hackathons
// @access  Private
exports.createHackathon = async (req, res, next) => {
  try {
    const {
      name,
      description,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      location,
      isOnline,
      website,
      maxTeamSize,
      minTeamSize,
      categories,
      tags,
      prize,
      image
    } = req.body;

    // Validate required fields
    if (!name || !description || !organizer || !startDate || !endDate || !registrationDeadline || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check date validity
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (new Date(registrationDeadline) > new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before start date'
      });
    }

    // Determine status based on dates
    const now = new Date();
    let status = 'upcoming';
    if (now >= new Date(startDate) && now <= new Date(endDate)) {
      status = 'active';
    } else if (now > new Date(endDate)) {
      status = 'completed';
    }

    const hackathon = await Hackathon.create({
      name,
      description,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      location,
      isOnline: isOnline || false,
      website: website || '',
      maxTeamSize: maxTeamSize || 5,
      minTeamSize: minTeamSize || 2,
      categories: categories || [],
      tags: tags || [],
      prize: prize || '',
      status,
      image: image || ''
    });

    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Private
exports.getHackathons = async (req, res, next) => {
  try {
    const { status, search, category, tag } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const hackathons = await Hackathon.find(query)
      .populate('participants', 'name email avatar')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      hackathons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Private
exports.getHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('participants', 'name email avatar role skills')
      .populate({
        path: 'teams',
        populate: {
          path: 'leader members',
          select: 'name email avatar role skills'
        }
      });

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.status(200).json({
      success: true,
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private
exports.updateHackathon = async (req, res, next) => {
  try {
    const {
      name,
      description,
      organizer,
      startDate,
      endDate,
      registrationDeadline,
      location,
      isOnline,
      website,
      maxTeamSize,
      minTeamSize,
      categories,
      tags,
      prize,
      status,
      image
    } = req.body;

    let hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (organizer) updateData.organizer = organizer;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (registrationDeadline) updateData.registrationDeadline = registrationDeadline;
    if (location) updateData.location = location;
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (website !== undefined) updateData.website = website;
    if (maxTeamSize) updateData.maxTeamSize = maxTeamSize;
    if (minTeamSize) updateData.minTeamSize = minTeamSize;
    if (categories) updateData.categories = categories;
    if (tags) updateData.tags = tags;
    if (prize !== undefined) updateData.prize = prize;
    if (status) updateData.status = status;
    if (image !== undefined) updateData.image = image;

    // Recalculate status if dates changed
    if (startDate || endDate) {
      const now = new Date();
      const start = updateData.startDate || hackathon.startDate;
      const end = updateData.endDate || hackathon.endDate;
      
      if (now >= start && now <= end) {
        updateData.status = 'active';
      } else if (now > end) {
        updateData.status = 'completed';
      } else {
        updateData.status = 'upcoming';
      }
    }

    hackathon = await Hackathon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Hackathon updated successfully',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private
exports.deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Delete all teams associated with this hackathon
    await Team.deleteMany({ hackathon: hackathon._id });

    await Hackathon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join hackathon
// @route   POST /api/hackathons/:id/join
// @access  Private
exports.joinHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if user is already a participant
    if (hackathon.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this hackathon'
      });
    }

    // Add user to participants
    hackathon.participants.push(req.user.id);
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the hackathon',
      hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave hackathon
// @route   POST /api/hackathons/:id/leave
// @access  Private
exports.leaveHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check if user is a participant
    if (!hackathon.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this hackathon'
      });
    }

    // Remove user from participants
    hackathon.participants = hackathon.participants.filter(
      participant => participant.toString() !== req.user.id.toString()
    );
    await hackathon.save();

    // Remove user from all teams in this hackathon
    const teams = await Team.find({ hackathon: hackathon._id });
    for (let team of teams) {
      if (team.members.includes(req.user.id)) {
        // If user is leader, delete the team, otherwise just remove them
        if (team.leader.toString() === req.user.id.toString()) {
          await Team.findByIdAndDelete(team._id);
          hackathon.teams = hackathon.teams.filter(
            teamId => teamId.toString() !== team._id.toString()
          );
        } else {
          team.members = team.members.filter(
            member => member.toString() !== req.user.id.toString()
          );
          await team.save();
        }
      }
    }
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the hackathon'
    });
  } catch (error) {
    next(error);
  }
};

