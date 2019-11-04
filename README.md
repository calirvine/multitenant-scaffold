# multitenant-scaffold

## Dev environment requirements:
Node, docker, postgres
docker-compose up will start redis and the app running in a node container. Postgres can be configured locally or remotely, just add your database url and login credentials to DB_HOST.

Making an application skeleton to handle multi-tenant SaaS

Setup a .env file with the following environment variables:

DB_HOST=
DB_USER=
DB_PASSWORD=
SECRET=

You will need to create a database with format appName + versionString where appName comes from the env variable in docker-compose (or .env, you can move it) and versionString comes from your NODE_ENV (also set currently in docker-compose).

## Currently working on:

Making the application stateless, moving tenant connection info out of local-storage and into (probably?) Redis.

## Structure:

- src - App entry point
  - authentication - contains passport config as well as utilities for encrypting and checking passwords, as well as the middleware to ensure incoming connections are authenticated for the endpoints they are trying to reach
  - config - Reads process.env (which comes from the docker-compose file as well as .env file) and loads values into a config object
  - connections 
    - commonDBConnection - creates a pg pool and exposes a function for executing queries. Returns a promise.
    - connectionManager - maps tenant data into seperate namespaces as well as getting the correct connection for the currently connected tennant
    - connectionResolver - matches the incoming connection to a tenant mapped by connectionManager
    - redisConnection - creates an interface for interacting with redis client
      - set (key, value, print: boolean) prints to console if print is true, the rest is self explanatory
      - get (key) returns a promise
      - del (key) deletes key
  - init
    - attachMiddleware - exposes function that takes express app and attaches middleware used by the application to the app
    - commonDb - Checks if common app tables exist. If they do not, they are created with default entries.
  - routes - Should not access data layer directly
    - public - routes here are open for any incoming connection
    - private - routes here are open to any authenticated user
    - admin - routes here are exposed only to users that have an admin user type (used for internal employee things)
  - services
    - App controllers live in here. Should NOT access the request or response objects directly, they should receive relevant pieces from the routes, and return data to the route to be sent in the response. This layer can access the data layer.
  - subscribers
    - See user.js for an example of attaching listeners. Index creates a event emitter, attaches listeners, and exports it so that routes or controllers can emit. The purpose is to create pub/sub type actions. Routes should not care about the end result of these actions, they are meant for starting long task(s) and for actions that the req/res do not care about.
    
