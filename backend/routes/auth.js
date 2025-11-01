const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');

const router = express.Router();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for email verification
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find user by email and update OTP
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // Update user with OTP
    user.emailVerificationToken = otp;
    user.emailVerificationExpires = otpExpiry;
    await user.save();

    // In a real application, you would send this OTP via email
    // For now, we'll return it in the response (remove this in production)
    console.log(`OTP for ${email}: ${otp}`);
    
    return res.json({
      message: 'OTP sent successfully',
      // Remove this in production - only for testing
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = '';
    user.emailVerificationExpires = null;
    await user.save();

    return res.json({
      message: 'Email verified successfully',
      emailVerified: true
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, interests, gender, emailVerified } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }
    if (!interests || interests.length < 3) {
      return res.status(400).json({ message: 'Please select at least 3 jobs' });
    }

    // Check if email is verified
    if (!emailVerified) {
      return res.status(400).json({
        message: 'Please verify your email first',
        emailVerificationRequired: true
      });
    }

    // Check for email uniqueness
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check for name/username uniqueness
    const nameExists = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (nameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Generate gender-appropriate avatar colors
    const getAvatarColor = (userGender) => {
      switch (userGender) {
        case 'male':
          // Male-appropriate colors (blues, teals, purples)
          return ['#4DB8FF', '#00BCD4', '#7C4DFF', '#3F51B5', '#2196F3', '#03A9F4'][Math.floor(Math.random() * 6)];
        case 'female':
          // Female-appropriate colors (pinks, purples, warm tones)
          return ['#FF6B6B', '#FFB84D', '#B968FF', '#E91E63', '#FFC107', '#FF9800'][Math.floor(Math.random() * 6)];
        case 'other':
          // Gender-neutral colors (greens, oranges, mixed palette)
          return ['#4CAF50', '#8BC34A', '#FF5722', '#FFB84D', '#9C27B0', '#607D8B'][Math.floor(Math.random() * 6)];
        case 'prefer-not-to-say':
        default:
          // All colors available for users who prefer not to specify
          return ['#FF6B6B', '#4DB8FF', '#B968FF', '#FFB84D', '#7C4DFF', '#00BCD4', '#4CAF50', '#FF5722'][Math.floor(Math.random() * 8)];
      }
    };

    const avatarColor = getAvatarColor(gender || 'prefer-not-to-say');

    const user = new User({
      email,
      password,
      name,
      gender: gender || 'prefer-not-to-say',
      interests,
      avatarColor,
      isEmailVerified: true // Since we're verifying before registration
    });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern.name) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login (only registered users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        interests: user.interests,
        avatarColor: user.avatarColor,
        title: user.title,
        location: user.location,
        bio: user.bio,
        experience: user.experience,
        education: user.education,
        industry: user.industry,
        twitter: user.twitter,
        linkedin: user.linkedin,
        dribbble: user.dribbble,
        leetcode: user.leetcode,
        codeforces: user.codeforces,
        currentCompany: user.currentCompany,
        currentPosition: user.currentPosition,
        workHistory: user.workHistory,
        skills: user.skills,
        certificates: user.certificates,
        profileImage: user.profileImage,
        appliedJobs: user.appliedJobs || [],
        bookmarkedJobs: user.bookmarkedJobs || [],
        viewedJobs: user.viewedJobs || [],
        aiInsights: user.aiInsights || {},
        behaviorData: user.behaviorData || {}
      },
    });

    console.log('Login response - User data:', {
      id: user._id,
      name: user.name,
      email: user.email,
      appliedJobs: user.appliedJobs?.length || 0,
      bookmarkedJobs: user.bookmarkedJobs?.length || 0,
      viewedJobs: user.viewedJobs?.length || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile
router.put('/profile', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.role;
    delete updateData.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update localStorage on frontend by returning updated user data
    const updatedUserData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      title: user.title,
      location: user.location,
      bio: user.bio,
      experience: user.experience,
      education: user.education,
      industry: user.industry,
      twitter: user.twitter,
      linkedin: user.linkedin,
      dribbble: user.dribbble,
      leetcode: user.leetcode,
      codeforces: user.codeforces,
      currentCompany: user.currentCompany,
      currentPosition: user.currentPosition,
      workHistory: user.workHistory,
      skills: user.skills,
      certificates: user.certificates,
      profileImage: user.profileImage,
      appliedJobs: user.appliedJobs || [],
      bookmarkedJobs: user.bookmarkedJobs || [],
      viewedJobs: user.viewedJobs || [],
      discussionPosts: user.discussionPosts || [],
      comments: user.comments || [],
      aiInsights: user.aiInsights || {},
      behaviorData: user.behaviorData || {}
    };

    res.json({
      message: 'Profile updated successfully',
      user: updatedUserData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile
router.get('/profile', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        title: user.title,
        location: user.location,
        bio: user.bio,
        experience: user.experience,
        education: user.education,
        industry: user.industry,
        twitter: user.twitter,
        linkedin: user.linkedin,
        dribbble: user.dribbble,
        leetcode: user.leetcode,
        codeforces: user.codeforces,
        currentCompany: user.currentCompany,
        currentPosition: user.currentPosition,
        workHistory: user.workHistory,
        skills: user.skills,
        certificates: user.certificates,
        profileImage: user.profileImage,
        appliedJobs: user.appliedJobs || [],
        bookmarkedJobs: user.bookmarkedJobs || [],
        viewedJobs: user.viewedJobs || [],
        discussionPosts: user.discussionPosts || [],
        aiInsights: user.aiInsights || {},
        behaviorData: user.behaviorData || {}
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for a job
router.post('/apply/:jobId', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { jobId } = req.params;

    if (!userId || !jobId) {
      return res.status(400).json({ message: 'User ID and Job ID are required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already applied for this job
    const alreadyApplied = user.appliedJobs.some(application => application.job_id === jobId);
    if (alreadyApplied) {
      return res.json({ message: 'You have already applied for this job' });
    }

    // Add job application to user's profile
    user.appliedJobs.push({
      job_id: jobId,
      appliedAt: new Date(),
      status: 'applied'
    });

    // Increment applicants count for the job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    await user.save();

    res.json({
      message: 'Successfully applied for the job',
      application: {
        job_id: jobId,
        appliedAt: new Date(),
        status: 'applied'
      },
      updatedApplicantsCount: job.applicantsCount
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applied jobs
router.get('/applications/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'appliedJobs.job_id',
        populate: {
          path: 'company_id',
          select: 'name logo'
        }
      })
      .select('appliedJobs');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      applications: user.appliedJobs
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user account
router.delete('/account/:userId', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestingUserId = decoded.id;
    const userId = req.params.userId;

    // Ensure user can only delete their own account
    if (userId !== requestingUserId) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Account deleted successfully',
      deletedUser: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/discussion-posts', async (req, res) => {
  try {
    // Get all users and their discussion posts
    const users = await User.find({}, 'name email discussionPosts comments avatarColor profileImage').lean();

    // First, collect all posts
    const allPosts = [];
    users.forEach(user => {
      if (user.discussionPosts && user.discussionPosts.length > 0) {
        user.discussionPosts.forEach(post => {
          console.log('Post from DB:', post); // Debug log
          allPosts.push({
            ...post,
            likesCount: post.likes ? post.likes.length : 0,
            author: {
              id: user._id,
              name: user.name || user.email.split('@')[0],
              email: user.email,
              avatarColor: user.avatarColor,
              profileImage: user.profileImage
            }
          });
        });
      }
    });

    // Then, calculate comments count for each post by checking all users' comments
    allPosts.forEach(post => {
      let commentsCount = 0;
      let recentComments = [];
      users.forEach(user => {
        if (user.comments && user.comments.length > 0) {
          const postComments = user.comments.filter(comment => comment.post_id === post.post_id);
          commentsCount += postComments.length;
          // Add recent comments for display (up to 4 most recent)
          recentComments.push(...postComments.map(comment => ({
            ...comment,
            author: {
              id: user._id,
              name: user.name || user.email.split('@')[0],
              email: user.email,
              avatarColor: user.avatarColor,
              profileImage: user.profileImage
            }
          })));
        }
      });
      post.commentsCount = commentsCount;
      // Sort comments by creation date and take the most recent 4
      recentComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      post.comments = recentComments.slice(0, 4);
    });

    // Sort by creation date (newest first)
    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      posts: allPosts
    });
  } catch (error) {
    console.error('Error fetching discussion posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new discussion post
router.post('/discussion-posts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postId = Date.now().toString();
    const newPost = {
      post_id: postId,
      title,
      content,
      tags: tags || [],
      imageUrl: req.body.imageUrl || null,
      imagePublicId: req.body.imagePublicId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Saving post with image data:', newPost); // Debug log

    user.discussionPosts.push(newPost);
    await user.save();

    console.log('Post saved successfully'); // Debug log

    res.json({
      success: true,
      message: 'Post created successfully',
      post: {
        ...newPost,
        author: {
          id: user._id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          avatarColor: user.avatarColor,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Error creating discussion post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/post-comments/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Get all users and their comments for this post
    const users = await User.find({}, 'name email comments avatarColor profileImage').lean();

    // Filter comments for this specific post
    const postComments = [];
    users.forEach(user => {
      if (user.comments && user.comments.length > 0) {
        user.comments.forEach(comment => {
          if (comment.post_id === postId) {
            postComments.push({
              ...comment,
              author: {
                id: user._id,
                name: user.name || user.email.split('@')[0],
                email: user.email,
                avatarColor: user.avatarColor,
                profileImage: user.profileImage
              }
            });
          }
        });
      }
    });

    // Sort by creation date (newest first)
    postComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      comments: postComments
    });
  } catch (error) {
    console.error('Error fetching post comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a post
router.post('/post-comments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const commentId = Date.now().toString();
    const newComment = {
      comment_id: commentId,
      post_id: postId,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.comments.push(newComment);
    await user.save();

    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: {
        ...newComment,
        author: {
          id: user._id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          avatarColor: user.avatarColor,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/discussion-posts/:postId/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { postId } = req.params;

    // Find the user who owns the post
    const user = await User.findOne({ 'discussionPosts.post_id': postId });
    if (!user) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the post
    const post = user.discussionPosts.find(p => p.post_id === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const existingLike = post.likes.find(like => like.user_id === userId);

    if (existingLike) {
      // Unlike the post
      post.likes = post.likes.filter(like => like.user_id !== userId);
    } else {
      // Like the post
      post.likes.push({
        user_id: userId,
        createdAt: new Date()
      });
    }

    await user.save();

    res.json({
      success: true,
      liked: !existingLike,
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/discussion-posts/:postId/view', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let viewerId = null;

    // Get viewer ID if authenticated
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        viewerId = decoded.id;
      } catch (error) {
        // Token invalid, treat as anonymous viewer
      }
    }

    const { postId } = req.params;

    // Find the user who owns the post
    const user = await User.findOne({ 'discussionPosts.post_id': postId });
    if (!user) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find and update the post
    const post = user.discussionPosts.find(p => p.post_id === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if this user has already viewed the post
    let shouldIncrementView = true;

    if (viewerId) {
      // For authenticated users, check if they've viewed before
      const existingView = post.viewedBy.find(view => view.user_id === viewerId);
      if (existingView) {
        shouldIncrementView = false;
        // Update the viewed timestamp
        existingView.viewedAt = new Date();
      } else {
        // First time viewing
        post.viewedBy.push({
          user_id: viewerId,
          viewedAt: new Date()
        });
      }
    } else {
      // For anonymous users, we'll still increment views but won't track individually
      // This is a simplified approach - in production, you might want to use session tracking
    }

    if (shouldIncrementView) {
      post.views = (post.views || 0) + 1;
    }

    await user.save();

    res.json({
      success: true,
      viewsCount: post.views,
      isNewView: shouldIncrementView
    });
  } catch (error) {
    console.error('Error incrementing view:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment
router.delete('/post-comments/:commentId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { commentId } = req.params;

    // Find the user who owns the comment
    const user = await User.findOne({ 'comments.comment_id': commentId });
    if (!user) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find the comment
    const commentIndex = user.comments.findIndex(c => c.comment_id === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = user.comments[commentIndex];

    // Check if the user owns this comment or the post
    const postOwner = await User.findOne({ 'discussionPosts.post_id': comment.post_id });
    const isCommentOwner = user._id.toString() === userId;
    const isPostOwner = postOwner && postOwner._id.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: 'You can only delete your own comments or comments on your posts' });
    }

    // Remove the comment
    user.comments.splice(commentIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedCommentId: commentId
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/top-discussions', async (req, res) => {
  try {
    // Get all users and their discussion posts and comments
    const users = await User.find({}, 'name email discussionPosts comments avatarColor profileImage').lean();

    // Flatten all discussion posts with user information and calculate engagement score
    const allPosts = [];
    users.forEach(user => {
      if (user.discussionPosts && user.discussionPosts.length > 0) {
        user.discussionPosts.forEach(post => {
          // Calculate engagement score: likes + comments + views
          const likesCount = post.likes ? post.likes.length : 0;
          let commentsCount = 0;

          // Calculate total comments for this post
          users.forEach(u => {
            if (u.comments && u.comments.length > 0) {
              const postComments = u.comments.filter(comment => comment.post_id === post.post_id);
              commentsCount += postComments.length;
            }
          });

          const viewsCount = post.views || 0;
          const engagementScore = likesCount + commentsCount + viewsCount;

          // Only include posts from the last week
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (new Date(post.createdAt) >= oneWeekAgo) {
            allPosts.push({
              ...post,
              likesCount,
              commentsCount,
              viewsCount,
              engagementScore,
              author: {
                name: user.name || user.email.split('@')[0],
                email: user.email,
                avatarColor: user.avatarColor,
                profileImage: user.profileImage
              }
            });
          }
        });
      }
    });

    // Sort by engagement score (highest first) and limit to top 3
    allPosts.sort((a, b) => b.engagementScore - a.engagementScore);
    const topDiscussions = allPosts.slice(0, 3);

    res.json({
      success: true,
      topDiscussions
    });
  } catch (error) {
    console.error('Error fetching top discussions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a discussion post
router.delete('/discussion-posts/:postId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { postId } = req.params;

    // Find the user who owns the post
    const user = await User.findOne({ 'discussionPosts.post_id': postId });
    if (!user) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the post
    const postIndex = user.discussionPosts.findIndex(p => p.post_id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = user.discussionPosts[postIndex];

    // Check if the user owns this post
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    // Delete associated image from Cloudinary if it exists
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
        console.log('Image deleted from Cloudinary:', post.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Remove the post
    user.discussionPosts.splice(postIndex, 1);
    await user.save();

    // Also delete all comments associated with this post
    const allUsers = await User.find({});
    for (const u of allUsers) {
      if (u.comments && u.comments.length > 0) {
        u.comments = u.comments.filter(comment => comment.post_id !== postId);
        await u.save();
      }
    }

    res.json({
      success: true,
      message: 'Post deleted successfully',
      deletedPostId: postId
    });
  } catch (error) {
    console.error('Error deleting discussion post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
