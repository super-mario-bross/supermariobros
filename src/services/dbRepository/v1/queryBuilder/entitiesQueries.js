const SQL = require("@nearform/sql");

exports.insertEntities = entities => {
  const sql = SQL`INSERT INTO entities(
                      uuid,
                      entity_id
                  )
                VALUES `;
  const rows = [];
  entities.map(entity => {
    rows.push(SQL`(${entity.uuid}, ${entity.entityId})`);
  });
  sql.append(sql.glue(rows, " , "));
  sql.append(SQL` ON CONFLICT (entity_id) DO NOTHING`);
  sql.append(SQL` RETURNING uuid`);

  return sql;
};

exports.getAllEntities = () =>
  SQL`SELECT uuid,entity_id FROM entities where 1=1`;

exports.entityByIdQuery = id => {
  const sql = SQL`SELECT * FROM entities`;
  sql.append(SQL` WHERE uuid=${id}`);
  return sql;
};


exports.updateEntityById = (data) => {
  const sql = SQL`UPDATE entities SET `;
  const updates = [];

  updates.push(SQL`avg_rating = ${data.avgRating || 0}`);
  updates.push(SQL`positive_sentiments = ${data.totalPositiveSentiments || 0}`);
  updates.push(SQL`negative_sentiments = ${data.totalNegativeSentiments || 0}`);
  updates.push(SQL`neutral_sentiments = ${data.totalNeutralSentiments || 0}`);
  updates.push(SQL`total_reviews = ${data.totalReviews || 0}`);

  sql.append(sql.glue(updates, " , "));
  sql.append(SQL`WHERE uuid = ${data.entity_id}`);
  return sql;
};
