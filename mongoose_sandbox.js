'use strict';

var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/sandbox', {
    useNewUrlParser: true,
    useUnifiedTopology: true  
});

const db = mongoose.connection;

db.on('error', (err)=>{
    console.error('connection error: ', err);
});

db.once('open', ()=>{
    console.log('db connection successful');

    // All database communication goes here
    var Schema = mongoose.Schema;
    var AnimalSchema = new Schema({
        type: {
            type: String,
            default: 'goldfish'
        },
        size: {
            type: String,
            default: 'small'
        },
        color: {
            type: String,
            default: 'golden'
        },
        mass: {
            type: Number,
            default: 0.007
        },
        name: {
            type: String,
            default: 'Angela'
        }
    });

    var Animal = mongoose.model('Animal', AnimalSchema);

    var elephant = new Animal({
        type: 'elephant',
        size: 'big',
        color: 'gray',
        mass: 6000,
        name: 'Lawrence'
    });

    var animal = new Animal({});

    Animal.remove({}, (err)=>{
        elephant.save((err)=>{
            if(err){
                console.error('Save Failed.', err);
            }else{
                console.log('Saved!');
            }

            

            db.close(()=>{
                console.log('db connection closed!');
            });
        });
    });


});