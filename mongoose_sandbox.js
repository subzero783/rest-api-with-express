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

    AnimalSchema.pre("save", function(next){
		if(this.mass >= 100) {
			this.size = "big";
		} else if (this.mass >= 5 && this.mass < 100) {
			this.size = "medium";
		} else {
			this.size = "small";
		}
		next();
	});

	AnimalSchema.statics.findSize = function(size, callback){
		//this == Animal
		return this.find({size: size}, callback);
	}

	AnimalSchema.methods.findSameColor = function(callback) {
		//this == document
		return this.model("Animal").find({color: this.color}, callback);
	}

    var Animal = mongoose.model('Animal', AnimalSchema);

    var elephant = new Animal({
        type: 'elephant',
        size: 'big',
        color: 'gray',
        mass: 6000,
        name: 'Lawrence'
    });

    var animal = new Animal({});

    var whale = new Animal({
        type: 'whale',
        size: 'big', 
        mass: 190500,
        name: 'Fig'
    }); 

    var animalData = [
		{
			type: "mouse",
			color: "gray",
			mass: 0.035,
			name: "Marvin"
		},
		{
			type: "nutria",
			color: "brown",
			mass: 6.35,
			name: "Gretchen"
		},
		{
			type: "wolf",
			color: "gray",
			mass: 45,
			name: "Iris"
		},
		elephant,
		animal,
		whale
	];

    // elephant.save((err)=>{
    //     if(err){
    //         console.error('Save Failed.', err);
    //     }else{
    //         console.log('Saved!');
    //     }

    //     db.close(()=>{
    //         console.log('db connection closed!');
    //     });
    // });

    // whale.save((err)=>{
    //     if(err){
    //         console.error('Save Failed.', err);
    //     }else{
    //         console.log('Saved!');
    //     }

    //     db.close(()=>{
    //         console.log('db connection closed!');
    //     });
    // });

    // Animal.create(animalData, (err, animals)=>{
    //     if(err){
    //         console.error(err);
    //     }
    // });

    Animal.findOne({type: 'elephant'}, (err, elephant)=>{
        if(err){
            console.error(err);
        }
        elephant.findSameColor((err, animals)=>{
            if(err){
                console.error(err);
            }
            animals.forEach((animal)=>{
                console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
            });
        });
    });

    Animal.find({
        size: 'big' 
    }, (err, animals)=>{
        animals.forEach((animal)=>{
            console.log(animal.name + ' the ' + animal.color + ' ' + animal.type);
        });
        db.close(()=>{
            console.log('db connection closed!');
        })
    });

});