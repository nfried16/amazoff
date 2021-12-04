#!/bin/bash

sudo apt-get -qq coreutils
mypath=`realpath $0`
mybase=`dirname $mypath`
user=`whoami`
echo "Assume your database user name is: $user"
read -p "Enter database password and press [ENTER]: " dbpasswd

secret=`tr -dc 'a-z0-9-_' < /dev/urandom | head -c50`
cd $mybase
cp -f flaskenv-template.env .flaskenv
sed -i "s/default_secret/'$secret'/g" .flaskenv
sed -i "s/default_db_user/$user/g" .flaskenv
sed -i "s/default_db_password/$dbpasswd/g" .flaskenv

# Install packages from Pipfile
pipenv install