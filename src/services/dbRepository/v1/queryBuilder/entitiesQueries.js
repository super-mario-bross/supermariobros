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
