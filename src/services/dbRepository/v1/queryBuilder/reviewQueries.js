const SQL = require("@nearform/sql");
exports.insertReviewsBulk = reviews => {
  const sql = SQL`INSERT INTO rating_n_reviews(
                    uuid,
                    entity,
                    author,
                    title,
                    review_desc,
                    rating,
                    sentiment_score
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
                 ${review.sentimentScore})`
    );
  });
  sql.append(sql.glue(rows, " , "));
  sql.append(SQL` ON CONFLICT (entity,author) DO UPDATE
                    SET title = EXCLUDED.title,
                        review_desc = EXCLUDED.review_desc,
                        rating = EXCLUDED.rating,
                        sentiment_score = EXCLUDED.sentiment_score`);
  return sql;
};

exports.getAllReviews = () =>
  SQL`SELECT entity,rating,sentiment_score FROM rating_n_reviews WHERE 1=1`;

exports.reviewAndRatingByEntityQuery = (options) => {
    const sql = SQL`SELECT * FROM rating_n_reviews`;
    sql.append(SQL` WHERE entity=${options.entity}`);
    return sql;
  };
