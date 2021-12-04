mypath=`realpath $0`
mybase=`dirname $mypath`
cd $mybase

cp -f reactenv-template.env .env

# Get ip address and add as environment variable in frontend to make api calls to
base_url=$(curl ifconfig.me)
sed -i "s/default_base_url/'$base_url'/g" .env

npm install