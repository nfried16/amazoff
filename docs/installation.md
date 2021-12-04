# Installation

The install.sh script in the root amazoff directory:
- Installs python3-pip using apt
- Installs nodejs and npm using apt
- Runs backend/setup.sh, db/setup.sh, and frontend/setup.sh (see below)

## DB Setup

The db/setup.sh script:
- Creates a postgresql database called amazoff (deletes any existing)
- Creates all tables specified in create.sql
- Loads sample data into tables using load_many.sql and the sample csv data in generation/data
(more on data generation [here](./generation.md))

## Backend Setup

The backend/setup.sh script:
- Sets up environment variables for connecting to database such as db username/password
- Sets up virtual environment in backend folder with all necessary packages using pipenv

## Frontend Setup
The frontend/setup.sh script:
- Fetches the VM external ip and adds it as an environment variable in the react app
in order to programatically make api calls
- Installs all npm packages in node_modules