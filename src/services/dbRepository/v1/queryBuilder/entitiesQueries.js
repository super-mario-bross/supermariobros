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

exports.updateRatingsBulk = data => {
  let sql = SQL`UPDATE entities SET avg_rating = CASE `;
  Object.keys(data).forEach(entity =>
    sql.append(
      SQL` WHEN uuid = ${entity} THEN CAST(${data[entity]["avgRating"]} AS FLOAT)\n`
    )
  );
  sql.append(SQL` END`);
  sql.append(SQL`, positive_sentiments = CASE `);
  Object.keys(data).forEach(entity =>
    sql.append(
      SQL` WHEN uuid = ${entity} THEN CAST(${data[entity]["totalPositiveSentiments"]} AS INTEGER)\n`
    )
  );
  sql.append(SQL` END`);
  sql.append(SQL`, negative_sentiments = CASE `);
  Object.keys(data).forEach(entity =>
    sql.append(
      SQL` WHEN uuid = ${entity} THEN CAST(${data[entity]["totalNegativeSentiments"]} AS INTEGER)\n`
    )
  );
  sql.append(SQL` END`);
  sql.append(SQL`, neutral_sentiments = CASE `);
  Object.keys(data).forEach(entity =>
    sql.append(
      SQL` WHEN uuid = ${entity} THEN CAST(${data[entity]["totalNeutralSentiments"]} AS INTEGER)\n`
    )
  );
  sql.append(SQL` END`);
  sql.append(SQL`, total_reviews = CASE `);
  Object.keys(data).forEach(entity =>
    sql.append(
      SQL` WHEN uuid = ${entity} THEN CAST(${data[entity]["totalReviews"]} AS INTEGER)\n`
    )
  );
  sql.append(SQL` END`);
  return sql;
};
