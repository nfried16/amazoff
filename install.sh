#!/bin/bash

chmod +x backend/setup.sh
chmod +x db/setup.sh
chmod +x frontend/setup.sh

sudo apt-get -qq update
sudo apt install python3-pip
sudo apt install nodejs npm

bash ./backend/setup.sh
bash ./db/setup.sh
bash ./frontend/setup.sh