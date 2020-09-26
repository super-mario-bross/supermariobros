require("dotenv").config();
const { Client } = require("pg");
const pgCamelCase = require("pg-camelcase");
pgCamelCase.inject(require("pg"));

const { parseError } = require("../src/utilities/index");
const { BATCH_SIZE } = require("../src/utilities/constants");

const path = require("path");
const fs = require("fs");
const csvtojson = require("csvtojson");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const {
  insertEntities,
  getAllEntities
} = require("../src/services/dbRepository/v1/queryBuilder/entitiesQueries");

const {
  insertReviewsBulk
} = require("../src/services/dbRepository/v1/queryBuilder/reviewQueries");
var Sentiment = require("sentiment");
var sentiment = new Sentiment();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const log = (input, data) => console.log(input, data || "");
const validateRows = (rows, validationErrors) => {
  return rows.map((row, index) => {
    let isValid = true;
    let msg = `ROW - ${index + 1} `;
    if (!row.hasOwnProperty("Product ID")) {
      msg += ` REQUIRED - Product ID ,`;
      isValid = false;
    }
    if (!row.hasOwnProperty("author id")) {
      msg += ` REQUIRED - author id ,`;
      isValid = false;
    }
    // if(!row['ReviewText']){
    //     msg += ` REQUIRED - ReviewText id ,`
    // }
    if (!row.hasOwnProperty("Rating")) {
      msg += ` REQUIRED - Rating ,`;
      isValid = false;
    }
    if (row["Product ID"] && isNaN(row["Product ID"])) {
      msg += ` INVALID FORMAT - Product ID should be a positive number greater than 0,`;
      isValid = false;
    }
    if (row["author id"] && isNaN(row["author id"])) {
      msg += ` INVALID FORMAT - author id should be a positive number greater than 0,`;
      isValid = false;
    }
    if (row["Rating"] && isNaN(row["Rating"])) {
      msg += ` INVALID FORMAT - Rating should be a postive number greater than 0,`;
      isValid = false;
    }
    if (!isValid) {
      validationErrors.push(msg + `\n`);
      return null;
    }
    return row;
  });
};

exports.dataIngestion = async () => {
  try {
    const client = new Client({
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME,
      password: DB_PASSWORD
    });

    await client.connect().catch(err => {
      console.error("DB Connection Failed", parseError(err));
      process.exit();
    });

    const RnRDataPath = path.resolve("./scripts/data/reviews_rating_data.csv");
    if (!fs.existsSync(RnRDataPath)) {
      console.error(
        "Ingestion data file not found at destination! , skipping!"
      );
      process.exit();
    }

    let rows = await csvtojson({ delimiter: "," }).fromFile(RnRDataPath);
    if (!rows.length) {
      console.error("Empty data ingestion file detected! , skipping!");
      process.exit();
    }

    log(`Total rows recieved :: ${rows.length}`);

    rows = _.compact(validateRows(rows));

    log(`Total rows after validating :: ${rows.length}`);

    let products = [];
    let reviews = [];
    rows.forEach(row => {
      const product = _.find(products, {
        entityId: parseInt(row["Product ID"])
      });
      if (!product) {
        products.push({
          uuid: uuidv4(),
          entityId: parseInt(row["Product ID"])
        });
      }
      reviews.push({
        uuid: uuidv4(),
        reviewDesc: row["Review Text"],
        title: row["Title"] || null,
        rating: row["Rating"],
        author: row["author id"],
        entityId: row["Product ID"],
        sentimentScore:
          (row["Review Text"] && sentiment.analyze(row["Review Text"]).score) ||
          0
      });
    });

    const productsBatches = _.chunk(products, BATCH_SIZE);
    log(`Total Batches generated for products :: ${productsBatches.length}`);

    const promisesProducts = productsBatches.map((chunk, index) => {
      return client.query(insertEntities(chunk)).catch(err => {
        console.error(
          `Error Occurred while inserting products! :: BATCH : ${index + 1}`,
          parseError(err)
        );
        process.exit();
      });
    });

    await Promise.all(promisesProducts);
    log(`products inserted:: ${products.length}`);

    const allProducts = await client.query(getAllEntities());
    log(`total review recieved:: ${reviews.length}`);

    reviews = reviews.map(review => {
      const prodUUID = _.find(allProducts.rows, {
        entityId: parseInt(review.entityId)
      }).uuid;
      review.entity = prodUUID;
      delete review.entityId;
      return review;
    });

    const reviewBatches = _.chunk(reviews, BATCH_SIZE);
    const promisesReviews = reviewBatches.map((chunk, index) => {
      return client.query(insertReviewsBulk(chunk)).catch(err => {
        console.error(
          `Error Occurred while inserting reviews! :: BATCH : ${index + 1}`,
          parseError(err)
        );
      });
    });

    await Promise.all(promisesReviews);

    log(`total review inserted:: ${reviews.length}`);

    process.exit();
  } catch (error) {
    console.log("Something Went Wrogn!", parseError(error));
    process.exit();
  }
};

exports.dataIngestion();
