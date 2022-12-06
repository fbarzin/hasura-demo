# Getting started with Hasura

This is a sample project that shows how to get started with Hasura. It is a simple TODO app that allows you to add, edit and delete TODOs

## Prerequisites

- [Hasura CLI](https://hasura.io/docs/latest/hasura-cli/index/#installation)
- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

## Setup

### 1. Clone the repo

```bash
git clone 
cd hasura-todo-app
```

Alternatively, you can also download the docker compose file from [Hasura](https://hasura.io/docs/latest/getting-started/docker-simple/#step-1-get-the-docker-compose-file) and add the `docker-compose.yml` file to the root of the project.

```bash
curl https://raw.githubusercontent.com/hasura/graphql-engine/stable/install-manifests/docker-compose/docker-compose.yaml -o docker-compose.yml
```

### 2. Initialize the Hasura project

Run the following command to initialize the Hasura project or switch the branch to `step-1` to get the initialized project.

```bash
hasura init
```
