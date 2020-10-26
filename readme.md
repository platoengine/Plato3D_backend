# Plato3D back end

This express app provides services for the Plato3D Modeler such as analysis code execution and post processing of results.

## Getting started

Clone the repo, then 'npm install', and 'nodemon app.js'

## Using Docker

Docker provides an easy way to spin up the backend, frontend, and database for local development
without installing any dependencies on your machine (except docker). 

1. Download and install [Docker] (https://docs.docker.com/engine/install/ubuntu/) and [docker-compose] (https://docs.docker.com/compose/install/).
2. In the Plato3D_Backend directory run ```bash docker-compose up build```. This will generate an
image from the modeler and backend's Dockerfile and then spin up 3 separate containers based on 
the configuration in the docker-compose.yml. They are now ready for development.
3. Run ```bash docker ps``` to verify 3 containers are running on your machine.
4. If you need to get into the container, run ```bash docker exec -it name_of_container bash```
5. To shutdown containers run ```bash docker-compose down```

### Other Notes on Docker
* The setup above works for linux and windows. On Macs you will need to install Docker for Mac.
* Whether development is done using containers or installing dependencies on your machine directly.
Development and version control is not affected. Modeler and Backend containers use volumes to allow
for hot reloading, updating code in your local area will update the containers code as well.
* Running ```bash docker-compose down``` will shut down the container but not delete it, this means data will be preserved in the mongoDB as long until you delete the container.

### Prerequisites

To configure a virtual machine on Google Compute Platform:

* Create a VM on GCP using Ubuntu 18.04, 50 Gb of drive space, and as many vCPUs as you like.
* Create a basic installation environment
  * sudo apt-get update
  * sudo apt-get upgrade
  * sudo apt-get install build-essential curl git gfortran python python-dev vim tcl environment-modules unzip csh ubuntu-drivers-common
* Install node
  * curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
  * (exit and open a new shell)
  * nvm install 14.1.0
  * npm install -g nodemon
* Install expy
  * git clone https://github.com/platoengine/spack.git
  * source ./spack/share/spack/setup-env.sh
  * spack bootstrap
  * source ./spack/share/spack/setup-env.sh
  * add.modules
  * source ~/.bashrc
  * spack install platoengine+expy @master
* Install sortedcontainers, trimesh
  * pip install sortedcontainers
  * pip install trimesh
* Clone the Plato3D_Backend
  * git clone https://github.com/PlatoApps/Plato3D_Backend.git
* create the directory where calculations will be run
  * cd Plato3D_Backend
  * mkdir calculations
  * cd ~
* set up environment
  * spack load platoengine
* start the Plato3D_BackEnd
  * cd Plato3D_Backend
  * npm install
  * nodemon app.js
