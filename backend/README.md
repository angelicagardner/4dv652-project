# Backend

This part of the project is a REST API built with Django.

## Installing requirements

In your terminal, run the following command:

```python
pip install -r requirements.txt
```

## Run project

To run the project locally, you need to create a file named `local_settings.py` and input information for the system to connect to the database, these includes the following variables:

DATABASE_USERNAME = ''

DATABASE_PASSWORD = ''

DATABASE_PORT = '32320'

DATABASE_HOST = '46.101.216.188'

However, the values for the username och password variables (credentials) can't be posted in the repository because it complains about security issues.
When the requirements are installed and the local_settings.py file is created, the project can run locally with the command:

```python
python manage.py runserver
```
