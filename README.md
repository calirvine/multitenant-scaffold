# multitenant-scaffold

Dev environment requirements:
Node, docker, postgres
docker-compose up will start redis and the app running in a node container. Postgres can be configured locally or remotely, just add your database url and login credentials o DB_HOST.

Making an application skeleton to handle multi-tenant SaaS

Setup a .env file with the following environment variables:

DB_HOST=
DB_USER=
DB_PASSWORD=
SECRET=

You will need to create a database with format appName + versionString where appName comes from the env variable in docker-compose (or .env, you can move it) and versionString comes from your NODE_ENV (also set currently in docker-compose).
