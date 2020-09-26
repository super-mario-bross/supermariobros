# Seller Domain

This microservice is responsible for exposing APIs to manage sellers.

# REST API Definitions
Documentation for the above APIs are available [here](https://confluence.falabella.com/display/Catalyst/Seller-APIs)

# External Integration

* PostgreSQL Database.
* Google Pub/Sub.

# Configurations
The microservice can run by setting the below environment variables.
PostgreSQL configurations for connection to database.


 - **DB_HOST:** PostgreSQL database host string.
 - **DB_PORT:** PostgreSQL database port.
 - **DB_NAME:** PostgreSQL database name.
 - **DB_USER:** PostgreSQL database user-name.
 - **DB_PASSWORD:** PostgreSQL database password.
 - **DB_MAX_CONNECTION:** PostgreSQL database config for connections pool.
 - **DB_SCHEMA:** PostgreSQL database schema name.
 - **NODE_ENV:** Node environment
 
Google Cloud Pub/Sub configurations for connection to Google Cloud Pub/Sub.
 - **GOOGLE_APPLICATION_CREDENTIALS:**  Path to gcp credentials file(.JSON)
 - **PROJECT_ID:** GCP Project id for connection to Google Cloud Pub/Sub.

# Project Set-up

**Postgres Set-up**
 - [Binary](https://www.postgresql.org/docs/11/installation.html)
 - [Docker](https://hub.docker.com/_/postgres)

**Google Cloud Pub/Sub**
Create the below topics in Google Cloud Pub/Sub


In-case actual GCP subscription is not available, please refer [here](https://cloud.google.com/pubsub/docs/emulator) 
for instructions on how to use Pub/Sub Emulator for local testing.

**Clone the git repo**

`git clone https://fala.cl/catalyst/core/sellers/development/sellers`

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
cd sellers

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