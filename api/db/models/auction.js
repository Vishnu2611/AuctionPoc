const validator = require('validator');
const mongo = require('mongoose');

const Schema = mongo.Schema;
const auctionSchema = new Schema({
    auctionId: {
        type: String,
        required:true,
        unique: true
    },
    auctionName:{
        type: String,
        required: true,
        unique: true
    },
    items: {
        type: String,
        required:true
    },
    basePrice: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isNumeric(value))
                throw new Error("Price should be a number");
        }
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required:true
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String,
        required:true
    },
    bid: {
        type: Object,
    }
});

module.exports = mongo.model('auctions',auctionSchema);