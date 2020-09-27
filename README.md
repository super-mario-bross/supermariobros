# Ratings & Review

This microservice is responsible for exposing APIs to manage Review and Ratings.

# REST API Definitions
https://app.swaggerhub.com/apis/super-mario/super-mario-bros/1.0.0

# External Integration

* PostgreSQL Database.

# Configurations
The microservice can run by setting the below environment variables.
PostgreSQL configurations for connection to database.


 - **DB_HOST:** PostgreSQL database host string.
 - **DB_PORT:** PostgreSQL database port.
 - **DB_NAME:** PostgreSQL database name.
 - **DB_USER:** PostgreSQL database user-name.
 - **DB_PASSWORD:** PostgreSQL database password.
 - **DB_MIGRATION_VERSION:** PostgreSQL database password.
 - **DB_MAX_CONNECTION:** PostgreSQL database config for connections pool.
 - **DB_SCHEMA:** PostgreSQL database schema name.
 - **NODE_ENV:** Node environment
 
Google Cloud Pub/Sub configurations for connection to Google Cloud Pub/Sub.
 - **GOOGLE_APPLICATION_CREDENTIALS:**  Path to gcp credentials file(.JSON)
 - **PROJECT_ID:** GCP Project id for connection to Google Cloud Pub/Sub.

# Project Set-up

**Postgres Set-up**
 - on local create a DB
 - [Binary](https://www.postgresql.org/docs/11/installation.html)
 - [Docker](https://hub.docker.com/_/postgres)

**Clone the git repo**

`git clone git@github.com:super-mario-bross/supermariobros.git`

The template is meant to be run on a **node.js >= 8.x.x** environment.  
To manage your node.js environments, you can use [nvm](https://github.com/creationix/nvm) 

The microservice runs in the port 4444 by default, 
but you can override it by setting the **PORT** config environment variable.

*** Generating an access token and logging in ***

In order to install dependencies, you must first generate a personal access
token in your gitlab account:

- In your personal account, click settings
- Go to Access Tokens option on the left menu (choose sensible
  expiry date, and check API access level)
- Generate the token

Use your gitlab username and the personal access token as your password to log
in and tell npm you want to scoped packages from our registry:

```console
$ npm login --registry="https://fala.cl/npm/"
$ # follow instructions
$ npm config set @ci-reuse:registry=https://fala.cl/npm/
```

Once setup or logged in you can now install the package and dependencies:

```console
$ npm i
```

``` bash
# Navigate to the project root directory.
cd supermariobros/

# set your .env and .npmrc local file (folow the examples)
touch .env
touch .npmrc

# Install dependencies
npm install

# Run DB migration scripts to create the DB tables development mode
npm run db-init

# Start development mode
npm run dev

# Start production mode
npm run start

# Run unit tests
npm run test

# Run linter
npm run lint

# Run linter fix for autofix linting errors 
npm run lint:fix

```

#Scripts

**data ingestion**
 make sure to run - npm run db-init (for any pending migrations)
 replace the file in the /scripts/data folder
  ```bash
  npm run seed
  ```
 reports are generated in the /scripts/data/reports folder

**calculate ratings**

 make sure to run - npm run db-init (for any pending migrations)
  ```bash
  npm run calculate:rating
  ```
 reports are generated in the /scripts/data/reports folder
