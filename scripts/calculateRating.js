require("dotenv").config();
const { Client } = require("pg");
const path = require("path");
const fs = require("fs");
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
const chalk = require("chalk");

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const log = (input, data) => console.log(input, data || "");

exports.calculateRating = async () => {
  try {
    console.log(chalk.bold(":: SCRIPT STARTED - Rating Calculation ::\n"));
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
      console.error(chalk.red("No Reviews Found!. Skipping!"));
      process.exit();
    }

    log(chalk.yellow(`Total reviews :: ${allReviews.rows.length}`));

    const calculatedRatings = calculateRating(allReviews.rows);

    await client.query(updateRatingsBulk(calculatedRatings));

    const pathToReport = "./scripts/data/reports/calcutedRatings.json";

    log(
      chalk.bold.green(
        `Ratings Calculation Finished for ${
          Object.keys(calculatedRatings).length
        } Products\n`
      )
    );

    log(
      chalk.bold.green(
        `::check report for rating and sentiment annalysis::\n${pathToReport}\n`
      )
    );

    fs.writeFileSync(pathToReport, JSON.stringify({}), "utf8");

    const reportPath = path.resolve(pathToReport);
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          TIME_EXECUTED: new Date(),
          OUTPUT: calculatedRatings
        },
        null,
        "\t"
      ),
      "utf8"
    );
    console.log(chalk.bold(":: SCRIPT ENDED - Rating Calculation ::"));

    process.exit();
  } catch (error) {
    console.log("Something Went Wrong!", parseError(error));
    process.exit();
  }
};

exports.calculateRating();
