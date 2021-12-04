#!/bin/bash

mypath=`realpath $0`
mybase=`dirname $mypath`
cd $mybase

# (source equivalent)
. ../backend/.flaskenv
dbname=$DB_NAME

# Check if any flask server is currently connected to db
if psql amazoff -c "SELECT pid FROM pg_stat_activity WHERE state = 'idle'" | grep -q 1; then
    echo 'ERROR: Close all database connections and run again'
    exit 1
fi
# Create db called amazoff
if [[ -n `psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    dropdb $dbname
fi
createdb $dbname

# Create and fill tables
psql -af create.sql $dbname
psql -af load_many.sql $dbname
