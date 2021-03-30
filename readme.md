# Plato3D back end

This express app provides services for the Plato3D Modeler such as analysis code execution and post processing of results.

## Getting started

Clone the repo, then 'npm install', and 'nodemon app.js'

## Docker

### Using images
The images for the Plato front-end and back-end are available on hub.docker.com.  Use the docker-compose files in PlatoApps/Plato3D_backend/docker to start both images along with a local mongo database.  From the docker directory, start the compose for your hardware, e.g., 
- For CPU:
```shell
docker-compose -f docker-compose.deployed-cpu.yml up
```
- For GPU:
```shell
docker-compose -f docker-compose.deployed-gpu.yml up
```
The default compute capability is 7.5.  This value can be changed by editing the compose file.  

### Development
Docker provides an easy way to spin up the backend, frontend, and database for local development
without installing any dependencies on your machine (except docker and docker-compose).

1. Download and install [Docker] (https://docs.docker.com/engine/install/ubuntu/) and [docker-compose] (https://docs.docker.com/compose/install/).
2. Pull latest version of Plato3D repo. Make sure it shares a parent directory with the backend repo. Folders are case-sensitive, they must match the docker compose exactly, e.g.,
```shell
mkdir dev_area; cd dev_area
git clone https://github.com/PlatoApps/Plato3D.git
git clone https://github.com/PlatoApps/Plato3D_backend.git
```
3. In the Plato3D_backend directory run:
```
docker-compose -f docker/docker-compose.yml up --build
```
This will generate an
image from the modeler and backend's Dockerfile and then spin up 3 separate containers based on 
the configuration in the docker-compose.yml. They are now ready for development.
4. Run ```docker ps``` to verify 3 containers are running on your machine.
5. If you need to get into the container, run ```docker exec -it name_of_container bash```
6. To shutdown containers run ```docker-compose down```

### Other Notes on Docker
* The setup above works for linux and windows. On Macs you will need to install Docker for Mac.
* Whether development is done using containers or installing dependencies on your machine directly.
Development and version control is not affected. Modeler and Backend containers use volumes to allow
for hot reloading, updating code in your local area will update the containers code as well.
* Running ```bash docker-compose down``` will shut down the container but not delete it, this means data will be preserved in the mongoDB as long until you delete the container.

### Deployment (generating images)
To deploy the front-end and back-end containers, npm must be installed.  
1. Generate and push the back-end image(s). From the Plato3D_backend directory:
```shell
npm install
# cpu image
docker build -f docker/Dockerfile.cpu -t plato3d/plato-backend-cpu .
sudo docker push plato3d/plato-backend-cpu
# gpu image
docker build -f docker/Dockerfile.gpu -t plato3d/plato-backend-gpu .
sudo docker push plato3d/plato-backend-gpu
```
Dockerfile.gpu and Dockerfile.cpu build from the 'develop' branch of Plato Analyze.  To build from 'release', edit the ```FROM``` statement in the appropriate Dockerfile.
2.  Generate and push the front-end image. From the Plato3D directory:
 ```shell
npm run build
mv dist deploy; cd deploy
docker build -t plato3d/plato-frontend .
sudo docker push plato3d/plato-frontend
 ```
