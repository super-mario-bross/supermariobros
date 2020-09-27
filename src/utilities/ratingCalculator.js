const _ = require("lodash");

exports.calculateRating = reviews => {
  const ratings = {};
  reviews = _.groupBy(reviews, "entity");
  Object.keys(reviews).map(entity => {
    let totalRatings = 0;
    let totalPositiveSentiments = 0;
    let totalNegativeSentiments = 0;
    let totalNeutralSentiments = 0;
    reviews[entity].map(r => {
      totalRatings += parseFloat(r.rating);
      if (r.sentimentScore === 0) {
        totalNeutralSentiments += 1;
      } else if (Math.sign(r.sentimentScore) === 1) {
        totalPositiveSentiments += 1;
      } else if (Math.sign(r.sentimentScore) === -1) {
        totalNegativeSentiments += 1;
      }
    });
    ratings[entity] = {
      avgRating: parseFloat((totalRatings / reviews[entity].length).toFixed(1)),
      totalPositiveSentiments,
      totalNegativeSentiments,
      totalNeutralSentiments,
      totalReviews: reviews[entity].length
    };
  });

  return ratings;
};

exports.helpfulnessContentModeration = review =>
  review.title &&
  review.reviewDesc &&
  review.reviewDesc.length > 300 &&
  review.sentimentScore > -3;
