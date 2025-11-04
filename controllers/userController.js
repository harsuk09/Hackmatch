const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      bio,
      skills,
      interests,
      availability,
      role,
      experience,
      github,
      linkedin,
      portfolio,
      avatar
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (interests) updateData.interests = interests;
    if (availability) updateData.availability = availability;
    if (role) updateData.role = role;
    if (experience) updateData.experience = experience;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { skills, interests, role, experience, availability, search } = req.query;
    const query = { isActive: true };

    // Search by text
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skills
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skills = { $in: skillsArray };
    }

    // Filter by interests
    if (interests) {
      const interestsArray = Array.isArray(interests) ? interests : interests.split(',');
      query.interests = { $in: interestsArray };
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by experience
    if (experience) {
      query.experience = experience;
    }

    // Filter by availability
    if (availability) {
      query.availability = availability;
    }

    const users = await User.find(query).select('-password').limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for current user
// @route   GET /api/users/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('notifications').populate('notifications.from', 'name email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, notifications: user.notifications || [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   POST /api/users/notifications/:notificationId/read
// @access  Private
exports.markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const notif = user.notifications.id(req.params.notificationId);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

    notif.read = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Notification marked read' });
  } catch (error) {
    next(error);
  }
};

