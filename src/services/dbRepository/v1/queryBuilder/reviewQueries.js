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

exports.entityByIdQuery = (id) => {
    const sql = SQL`SELECT uuid FROM entities`;
    sql.append(SQL` WHERE uuid=${id}`);
    return sql;
};