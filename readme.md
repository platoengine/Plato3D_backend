# Plato3D back end

This express app provides services for the Plato3D Modeler such as analysis code execution and post processing of results.

## Getting started

Clone the repo, then 'npm install', and 'nodemon app.js'

### Prerequisites

This service uses third party applications for analysis, post processing, etc:

* Meshlab: www.meshlab.net (on ubuntu: sudo apt-get install meshlab)
* obj2gltf: https://github.com/AnalyticalGraphicsInc/obj2gltf (npm install -g obj2gltf)

To configure a virtual machine on Google Compute Platform:

* Create a VM on GCP using Ubuntu 18.04, 50 Gb of drive space, and as many vCPUs as you like.
* Create a basic installation environment
  * sudo apt-get update
  * sudo apt-get upgrade
  * sudo apt-get install build-essential curl git gfortran python python-dev vim tcl environment-modules unzip csh ubuntu-drivers-common
* Install node
  * curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
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
