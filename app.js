'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';

import routes from './routes';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/qa', {
    useNewUrlParser: true,
    useUnifiedTopology: true  
});

const db = mongoose.connection;

db.on('error', (err)=>{
    console.error('connection error: ', err);
});

db.once('open', ()=>{
    console.log('db connection successful');
});

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    next();
});

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