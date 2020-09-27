require("dotenv").config();
const moment = require("moment");
const { Client } = require("pg");
const path = require("path");
const fs = require("fs");
const pgCamelCase = require("pg-camelcase");
pgCamelCase.inject(require("pg"));

const { parseError } = require("../src/utilities/index");

const {
  updateEntityById
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
    const startTime = new Date();
    console.log(
      chalk.bold(":: SCRIPT STARTED - Rating Calculation :: \n"),
      startTime
    );
    /**
     * Create DB client
     */
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

    /**
     * fetch Reviews
     */
    const allReviews = await client.query(getAllReviews());

    if (!allReviews.rows.length) {
      console.error(chalk.red("No Reviews Found!. Skipping!"));
      process.exit();
    }

    log(chalk.yellow(`Total reviews :: ${allReviews.rows.length}`));

    /**
     * calculate Rating and sentiment analysis - ratingCalculator
     */

    const calculatedRatings = calculateRating(allReviews.rows);

    await Promise.all(
      Object.keys(calculatedRatings).map(entity => {
        calculatedRatings[entity]["entity_id"] = entity;
        return client.query(updateEntityById(calculatedRatings[entity]));
      })
    );

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
        `::check report for rating and sentiment analysis::\n${pathToReport}\n`
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

    console.log(
      chalk.bold(":: SCRIPT ENDED - Rating Calculation ::"),
      `\ntime taken : ${moment(new Date()).diff(startTime)} ms`
    );

    process.exit();
  } catch (error) {
    console.log("Something Went Wrong!", parseError(error));
    process.exit();
  }
};

exports.calculateRating();
