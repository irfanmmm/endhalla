const Counsellor = require('../../models/Counsellor');

/**
 * Get all available counsellors with optional filters
 * GET /api/counsellors
 * Query params: query, category, gender, maxPrice, minExperience, sortBy
 */
exports.getCounsellors = async (req, res) => {
  try {
    const { query, category, gender, maxPrice, minExperience, sortBy } = req.query;

    let filter = { isVerified: true };

    // Search query (name, title, area of focus)
    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { areasOfFocus: { $regex: query, $options: 'i' } },
      ];
    }

    // Category / Focus filter
    if (category && category !== 'All') {
      filter.areasOfFocus = { $regex: category, $options: 'i' };
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Experience filter
    if (minExperience) {
      filter.experienceYears = { $gte: Number(minExperience) };
    }

    // Price filter (on chat/voice/video rates)
    if (maxPrice) {
      filter['rates.chat'] = { $lte: Number(maxPrice) };
    }

    // Build query
    let mongoQuery = Counsellor.find(filter);

    // Sorting
    if (sortBy === 'rating') {
      mongoQuery = mongoQuery.sort({ rating: -1 });
    } else if (sortBy === 'experience') {
      mongoQuery = mongoQuery.sort({ experienceYears: -1 });
    } else if (sortBy === 'price_low') {
      mongoQuery = mongoQuery.sort({ 'rates.chat': 1 });
    } else {
      mongoQuery = mongoQuery.sort({ createdAt: -1 });
    }

    const counsellors = await mongoQuery.exec();

    return res.status(200).json({
      success: true,
      count: counsellors.length,
      data: counsellors,
    });
  } catch (error) {
    console.error('Error in getCounsellors:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching counsellors', error: error.message });
  }
};

/**
 * Get single counsellor profile by ID
 * GET /api/counsellors/:id
 */
exports.getCounsellorById = async (req, res) => {
  try {
    const { id } = req.params;
    const counsellor = await Counsellor.findById(id);

    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }

    return res.status(200).json({
      success: true,
      data: counsellor,
    });
  } catch (error) {
    console.error('Error in getCounsellorById:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching counsellor', error: error.message });
  }
};

/**
 * Get available focus categories / areas
 * GET /api/counsellors/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'all', title: 'All' },
      { id: 'anxiety', title: 'Anxiety' },
      { id: 'depression', title: 'Depression' },
      { id: 'relationships', title: 'Relationships' },
      { id: 'career', title: 'Career Stress' },
      { id: 'mindset', title: 'Mindset & Growth' },
      { id: 'grief', title: 'Grief & Loss' },
    ];

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching categories', error: error.message });
  }
};
