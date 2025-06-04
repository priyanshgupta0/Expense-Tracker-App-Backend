const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    // Initialize members array with creator
    const members = [req.user._id];

    const group = await Group.create({
      name,
      members,
      createdBy: req.user._id
    });

    // Add group to all members' groups array
    await User.updateMany(
      { _id: { $in: members } },
      { $push: { groups: group._id } }
    );

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('expenses');

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
// @access  Private
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('expenses');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member of group
    if (!group.members.some(member => member._id.equals(req.user._id))) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member of group
    if (!group.members.some(member => member._id.equals(req.user._id))) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already in group
    if (group.members.some(member => member._id.equals(user._id))) {
      return res.status(400).json({ message: 'User already in group' });
    }

    // Add user to group
    group.members.push(user._id);
    await group.save();

    // Add group to user's groups
    user.groups.push(group._id);
    await user.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};