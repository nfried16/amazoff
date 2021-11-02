mypath=`realpath $0`
mybase=`dirname $mypath`
cd $mybase
ls
cp -f reactenv-template.env .env
base_url=$(curl ifconfig.me)
sed -i "s/default_base_url/'$base_url'/g" .env