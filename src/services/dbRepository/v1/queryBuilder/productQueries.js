const SQL = require("@nearform/sql");

exports.insertAttributesQuery = attribute => SQL`INSERT INTO attributes (
                      uuid,
                      seller_id,
                      tenant_id,
                      group_name,
                      attributes
                  )
                  VALUES (${attribute.uuid},
                      ${attribute.sellerId},
                      ${attribute.tenantId},
                      ${attribute.groupName},
                      ${attribute.attributes}
                  ) RETURNING *`;
