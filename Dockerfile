FROM plato3d/plato-analyze:cuda-10.2-cc-7.5-develop

RUN apt update; apt -y install paraview

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - ; apt-get install -y nodejs ; npm install nodemon

RUN node -v
RUN npm -v

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

ENTRYPOINT [ "/bin/bash", "--rcfile", "/etc/profile", "-l", "-c" ]
CMD [ "npm run start" ]
