#!/bin/sh

echo "Running migrations"
node dbMigrations/index.js|| (echo "DB migration failed" && kill 1)

echo "Start application"
node src/index.js