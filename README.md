# node-js-jwt

Make sure you have a PostgreSQL database up and running. In my case, I use Docker since it's the easiest way:

$ docker run -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres

Log into the container and create the database:

$ docker exec -it <CONTAINER_ID> psql -U root

Once inside the psql shell, run:

CREATE DATABASE nodejwt;

Then, run the project:

$ npm start
