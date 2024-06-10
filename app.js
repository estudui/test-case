const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const appRoot = require('app-root-path');
require('module-alias/register');

const testIndexRouter = require('./controllers/index/index')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config({path: `${appRoot}/.env`})

app.use('/', testIndexRouter);

module.exports = app;
