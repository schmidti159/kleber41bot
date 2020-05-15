#!/bin/bash

cd "$(dirname "$0")"
source ../.env

mysql -e "CREATE DATABASE $DB_NAME"
