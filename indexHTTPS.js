'use strict';

require('dotenv').config({path: './.env'});
const https = require("https");
const fs = require("fs");
const mongoose = require('mongoose');
const app = require('./app');
const port = 3700;
app.set('port', port)
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.BBDD_USER}:${process.env.BBDD_PASSWORD}@${process.env.BBDD_URL}:${process.env.BBDD_PORT}/${process.env.BBDD_NAME}`)
.then(() => {
    console.log("[BBDD] Conected");
    // Creació del servidor
    https
    .createServer({key: fs.readFileSync("/etc/ssl/kmacerts/private_api.key"),cert: fs.readFileSync("/etc/ssl/kmacerts/certificate_api.crt")},app)
    .listen(port, () => {
        console.log("[Express] Listening to port",port)
    });
})
.catch((err) => {
    console.error(err);
})
