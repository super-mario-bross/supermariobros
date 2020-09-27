const SQL = require("@nearform/sql");
const _ = require("lodash");
const { REACTIONS } = require("../../../../config");

exports.insertReviewsBulk = reviews => {
  const sql = SQL`INSERT INTO rating_n_reviews(
                    uuid,
                    entity,
                    author,
                    title,
                    review_desc,
                    rating,
                    sentiment_score,
                    is_helpful,
                    moderation_status,
                    is_published
                  )
                VALUES `;
  const rows = [];
  reviews.map(review => {
    rows.push(
      SQL`(${review.uuid},
                 ${review.entity},
                 ${review.author},
                 ${review.title || null},
                 ${review.reviewDesc || null},
                 ${review.rating},
                 ${review.sentimentScore},
                 ${review.isHelpful || 0},
                 ${review.moderationStatus || 0},
                 ${review.isPublished || false})`
    );
  });
  sql.append(sql.glue(rows, " , "));
  sql.append(SQL` ON CONFLICT (entity,author) DO UPDATE
                    SET title = EXCLUDED.title,
                        review_desc = EXCLUDED.review_desc,
                        rating = EXCLUDED.rating,
                        sentiment_score = EXCLUDED.sentiment_score,
                        is_helpful = EXCLUDED.is_helpful`);
  return sql;
};

exports.getAllReviews = () =>
  SQL`SELECT entity,rating,sentiment_score,review_desc,title FROM rating_n_reviews WHERE 1=1`;

exports.reviewAndRatingByEntityQuery = options => {
  const sql = SQL`SELECT uuid as review_id,entity,author,title,review_desc, rating, is_helpful,is_not_helpful,sentiment_score,updated_at,created_at FROM rating_n_reviews`;
  sql.append(SQL` WHERE entity=${options.entity_id} AND is_published=true`);
  if (
    !_.isNaN(options.filterByRating) &&
    parseInt(options.filterByRating) > 0
  ) {
    sql.append(SQL` AND rating=${parseInt(options.filterByRating)}`);
  }
  if (options.sort_key) {
    switch (options.sort_key) {
      case "created_at":
        sql.append(SQL` ORDER BY created_at`);
        break;
      case "is_helpful":
        sql.append(SQL` ORDER BY is_helpful`);
        break;
      case "is_not_helpful":
        sql.append(SQL` ORDER BY is_not_helpful`);
        break;
      case "rating":
        sql.append(SQL` ORDER BY rating`);
        break;
      default:
        break;
    }
  }
  if (options.sort_order) {
    options.sort_order === "ASC"
      ? sql.append(SQL` ASC`)
      : sql.append(SQL` DESC`);
  }
  if (!_.isNaN(options.offset) && parseInt(options.offset) > 0) {
    sql.append(SQL` offset ${parseInt(options.offset)}`);
  }
  if (!_.isNaN(options.limit) && parseInt(options.limit) > 0) {
    sql.append(SQL` limit ${parseInt(options.limit)}`);
  }
  return sql;
};

exports.reveiwByIdQuery = id => {
  const sql = SQL`SELECT * FROM rating_n_reviews`;
  sql.append(SQL` WHERE uuid=${id}`);
  return sql;
};

exports.updateReviewById = data => {
  const { userReaction } = data;
  const sql = SQL`UPDATE rating_n_reviews SET `;
  const updates = [];
  if (userReaction === REACTIONS.IS_HELPFUL) {
    updates.push(SQL`is_helpful = is_helpful+1`);
  }
  if (userReaction === REACTIONS.IS_NOT_HELPFUL) {
    updates.push(SQL`is_not_helpful = is_not_helpful+1`);
  }
  sql.append(sql.glue(updates, " , "));
  sql.append(SQL`WHERE uuid = ${data.reviewId}`);
  return sql;
};

exports.getReviewAndRatingCount = options => {
  const sql = SQL`SELECT COUNT(uuid) from rating_n_reviews `;
  sql.append(SQL` WHERE entity=${options.entity_id}`);
  if (
    !_.isNaN(options.filterByRating) &&
    parseInt(options.filterByRating) > 0
  ) {
    sql.append(SQL` AND rating=${parseInt(options.filterByRating)}`);
  }
  return sql;
};

exports.updatePublishmentStatus = data => {
  const sql = SQL`UPDATE rating_n_reviews SET is_published=${data.approved} WHERE uuid = ${data.reviewId}`;
  return sql;
};
