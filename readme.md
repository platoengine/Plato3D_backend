# Plato3D back end

This express app provides services for the Plato3D Modeler such as analysis code execution and post processing of results.

## Getting started

Clone the repo, then 'npm install', and 'nodemon app.js'

## Using Docker

Docker provides an easy way to spin up the backend, frontend, and database for local development
without installing any dependencies on your machine (except docker).

1. Download and install [Docker] (https://docs.docker.com/engine/install/ubuntu/) and [docker-compose] (https://docs.docker.com/compose/install/).
2. Pull latest version of Plato3D repo. Make sure it shares a parent directory with the backend repo. Folders are case-sensitive, they must match the docker compose exactly.
3. In the Plato3D_Backend directory run ```bash docker-compose -f docker/docker-compose.develop up --build```. This will generate an
image from the modeler and backend's Dockerfile and then spin up 3 separate containers based on 
the configuration in the docker-compose.yml. They are now ready for development.
4. Run ```bash docker ps``` to verify 3 containers are running on your machine.
5. If you need to get into the container, run ```bash docker exec -it name_of_container bash```
6. To shutdown containers run ```bash docker-compose down```

### Other Notes on Docker
* The setup above works for linux and windows. On Macs you will need to install Docker for Mac.
* Whether development is done using containers or installing dependencies on your machine directly.
Development and version control is not affected. Modeler and Backend containers use volumes to allow
for hot reloading, updating code in your local area will update the containers code as well.
* Running ```bash docker-compose down``` will shut down the container but not delete it, this means data will be preserved in the mongoDB as long until you delete the container.
