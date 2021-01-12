'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb';
import path from 'path';
import logger from 'morgan';

import routes from './routes';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/questions', routes);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});

var port = process.env.PORT || 3000;

const server = app.listen(process.env.PORT || port, ()=>{
    console.log(`Listening on port ${server.address().port}`);
});