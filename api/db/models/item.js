const validator = require('validator');
const mongo = require('mongoose');

const Schema = mongo.Schema;
const itemSchema = new Schema({
    itemId: {
        type: String,
        required:true,
        unique: true
    },
    itemName:{
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required:true
    },
    buildDate: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required:true
    }
});

module.exports = mongo.model('items',itemSchema);