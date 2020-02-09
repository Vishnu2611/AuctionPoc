const def = require("../config/config");
const timer = require("./timer");
const auction = require('../db/models/auction');
const mongo = require('mongoose');

const db = def.modules.dbUri;

const startAuction = async (body, username, orgname)=> {
    return new Promise((resolve, reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            console.log("Database Connected!!");
            const newauction =  new auction({
                auctionId: (Math.floor(Date.now() / 1000)).toString(),
                auctionName: body.auctionName,
                items: body.items,
                basePrice: body.basePrice,
                startTime: Date(),
                endTime: body.endTime,
                owner: username
            });
            newauction.save().then((item) => {
                timer.check(item.endTime, item.auctionId, username, orgname);
                resolve(item);
            }).catch(err => reject(err));
        }).catch((error)=>{reject(error)});
    });
}

const serverStart =  () => {
    return new Promise(  (resolve,reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            const data = await auction.find({status: true}).catch((error) => { reject(error);});
            if(data.length === 0)
                resolve(0);
            else{
                data.forEach(element => {
                    console.log(element.endTime);
                    timer.check(element.endTime,element.auctionId)
                });
                resolve(1);
            }
        })
        .catch((error) => console.log("Database connection error!!"+error));
    });
}

module.exports = {
    startAuction: startAuction,
    serverStart: serverStart
}