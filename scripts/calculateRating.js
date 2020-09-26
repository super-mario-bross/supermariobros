require("dotenv").config();
const { Client } = require("pg");
const pgCamelCase = require("pg-camelcase");
pgCamelCase.inject(require("pg"));

const { parseError } = require("../src/utilities/index");

const {
  updateRatingsBulk
} = require("../src/services/dbRepository/v1/queryBuilder/entitiesQueries");
const {
  getAllReviews
} = require("../src/services/dbRepository/v1/queryBuilder/reviewQueries");

const { calculateRating } = require("../src/utilities/ratingCalculator");

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const log = (input, data) => console.log(input, data || "");

exports.calculateRating = async () => {
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

    const allReviews = await client.query(getAllReviews());

    if (!allReviews.rows.length) {
      console.error("No Reviews Found!. Skipping!");
      process.exit();
    }

    log(`Total reviews :: ${allReviews.rows.length}`);

    const calculatedRatings = calculateRating(allReviews.rows);

    await client.query(updateRatingsBulk(calculatedRatings));

    log(
      `Ratings Calculation Finished for ${
        Object.keys(calculatedRatings).length
      } Products`
    );

    process.exit();
  } catch (error) {
    console.log("Something Went Wrogn!", parseError(error));
    process.exit();
  }
};

exports.calculateRating();
