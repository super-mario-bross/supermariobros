const { OK } = require("http-status-codes");
const faker = require("faker");
/**
 * create review with ratings,title, description
 * @param {*} fastify instance
 */

module.exports.getProductById = () => async (request, reply) => {
  const skus = [
    "7379806",
    "8107301",
    "7226919",
    "8479643",
    "8623507",
    "5686606",
    "7321820",
    "7959727",
    "6762009",
    "6859205"
  ];
  const product = {
    product_id: request.query.product_id,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    image: `https://falabella.scene7.com/is/image/Falabella/${
      skus[
        faker.random.number({
          min: 0,
          max: 9
        })
      ]
    }?wid=300&hei=300`
  };

  reply.code(OK).send(product);
};
