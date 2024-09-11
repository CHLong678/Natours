const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  if (!reviews) return next(new AppError('No such review for this tour', 404));

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: { reviews }
  });
});

exports.createReviews = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  if (!newReview)
    return next(new AppError('No such review for this tour', 404));

  res.status(201).json({
    status: 'success',
    data: { newReview }
  });
});
