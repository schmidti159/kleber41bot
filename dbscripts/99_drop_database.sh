#!/bin/bash

cd "$(dirname "$0")"
source ../.env

mysql -e "DROP DATABASE $DB_NAME"
