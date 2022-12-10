# Getting started with Hasura

This is a sample project that shows how to get started with Hasura. It is a simple TODO app that allows you to add, edit and delete TODOs

## Prerequisites

- [Hasura CLI](https://hasura.io/docs/latest/hasura-cli/index/#installation)
- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

## Step 1 - Setup

### Clone the repo

```bash
git clone git@github.com:fbarzin/hasura-demo.git
# or use the GitHub CLI
gh repo clone fbarzin/hasura-demo

cd hasura-todo-app
```

Alternatively, you can download the docker compose file from [Hasura](https://hasura.io/docs/latest/getting-started/docker-simple/#step-1-get-the-docker-compose-file) and add the `docker-compose.yml` file to the root of the project.

```bash
curl https://raw.githubusercontent.com/hasura/graphql-engine/stable/install-manifests/docker-compose/docker-compose.yaml -o docker-compose.yml

# or run
wget https://raw.githubusercontent.com/hasura/graphql-engine/stable/install-manifests/docker-compose/docker-compose.yaml
```

### Initialize the Hasura project

Run the following command to initialize the Hasura project or switch the branch to `step-1` to get the initialized project.

```bash
hasura init
```

This command will create the Hasura project where it stores migrations, metadata, seeds, etc.

Update `hasura/config.yaml` to the following:

```yaml
version: 3
endpoint: http://localhost:8080
metadata_directory: metadata
admin_secret: myadminsecretkey
actions:
  kind: synchronous
  handler_webhook_baseurl: http://localhost:4000
```

Adding the `admin_secret` to this file will instruct the CLI to run the engine with this password. Otherwise, you add the secret in the command line.

### Run the project

Now that we have the project initialized, let's run it and see it in action:

```bash
docker-compose up -d
```

This will download the Hasura Engine and Postgres docker files and runs them.

> You need to have Docker installed on your machine

Run the Hasura console

```bash
cd hasura

hasura console
```

## Step 2 - Create the database and tables

In this step we will add the database and tables to the project. We will use the Hasura console to do this.

You can switch to the `step-2` branch to get the project with the database and tables created, and run the following command to apply the migrations:

```bash
# Runs the metadata to first create the connection to the database
hasura metadata apply

# Runs the migrations
hasura migrate apply
```

## Step 3 - Update Permissions

In this step we will update the permissions to allow the user to perform CRUD operations on the tables. We will create a role called `user` and assign permissions to the tables. We will also set up Firebase Auth to authenticate the users.

You can switch to the `step-3` branch to get the project with the permissions updated, and run the following command to apply the metadata:

```bash
hasura metadata apply
```

First you need to create a project in Firebase and enable the authentication with email and password. You can follow the [documentation](https://firebase.google.com/docs/auth) to do this.

Once you have the project created, you need to generate the JWT config and add it to the `docker-compose.yml` file. In order to do this,
go to <https://hasura.io/jwt-config/> and select the Firebase option. Then copy the JWT config and add it to the `docker-compose.yml` file.

```yaml
HASURA_GRAPHQL_JWT_SECRET: '{"type":"RS256","jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", "audience": "hasura-demo-f3d73", "issuer": "https://securetoken.google.com/hasura-demo-f3d73"}'
```

After adding the JWT config, you need to restart the docker containers:

```bash
docker-compose down
docker-compose up -d
```

Now we need to have a service that authenticates the users and generates the JWT token. I have created a server using NestJS that does this. You can find the code in the `server` folder and sample requests in the `http` folder.

## Step 4 - Add a remote schema

In this step we will add the GraphQL API in the `server` folder as a remote schema to the Hasura project. In order to do this, we need to first run the server:

```bash
cd server
npm install
npm run start:dev
```

Then we need to add the remote schema to the project. You can switch to the `step-4` branch to get the project with the remote schema added, and run the following command to apply the metadata:

```bash
hasura metadata apply
```

The added remote schema won't show up if you don't have the admin secret or a valid JWT token. So we need to activate anonymous access to Hasura. You can do this by adding the following to the `docker-compose.yml` file:

```yaml
HASURA_GRAPHQL_UNAUTHORIZED_ROLE: anonymous
```

Now, we should rerun the docker containers for the changes to be applied:

```bash
docker-compose down
docker-compose up -d
```

## Step 5 - Create Actions

In this step we will create an Action log the user into application. The Action will convert a REST API to a GraphQL mutation. You can switch to the `step-5` branch to get the project with the actions added, and run the following command to apply the metadata:

```bash
hasura metadata apply
```
