# Sample Data Generation

Our sample csv data is generated by a python script, [gen.py](../db/generation/gen.py)

We have another pipenv environment set up for the data generation script. The data can
be regenerated by running:
```
cd db/generation
pipenv install
pipenv run python gen.py
```


The database can then be repopulated by rerunning `./db/setup.sh`