#!/bin/bash

mypath=`realpath $0`
mybase=`dirname $mypath`
cd $mybase

# (source equivalent)
. ../backend/.flaskenv
dbname=$DB_NAME

echo $dbname
if [[ -n `psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    dropdb $dbname
fi
createdb $dbname

psql -af create.sql $dbname
psql -af load_many.sql $dbname
