'use strict';

import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let sortAnswers = (a, b) => {
    //-negative a before b
    //0 no change
    //+ positive a after b
    if(a.votes === b.votes){
        return b.updatedAt - a.updatedAt;
    }
    return b.votes - a.votes;
};

let AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
});

AnswersSchema.methods('update', (updates, callback)=>{
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
});

AnswersSchema.methods('vote', (vote, callback)=>{
    if(vote === 'up'){
        this.votes += 1;
    }else{
        this.votes -= 1;
    }
    this.parent().save(callback);
});

let QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

QuestionSchema.pre('save', ()=>{
    this.answers.sort(sortAnswers);
    next();
});

var Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;