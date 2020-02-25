const def = require("../config/config");
const invoke =require("../app/invoke-transaction");
const la = require("../app/query")
const timer = require("./timer");
const auction = require('../db/models/auction');
const mongo = require('mongoose');
const md5= require("md5");

const db = def.modules.dbUri;

const startAuction = async (body, username, orgname)=> {
    return new Promise((resolve, reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            console.log("Database Connected!!");
            const newauction =  new auction({
                auctionId: md5((Math.floor(Date.now() / 1000)).toString()),
                auctionName: body.auctionName,
                items: body.items,
                basePrice: body.basePrice,
                startTime: Date(),
                endTime: body.endTime,
                owner: username
            });
            newauction.save().then((item) => {
                timer.check(item.endTime, item.auctionId, username, orgname, true, body);
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
                    timer.check(element.endTime,element.auctionId,element.owner,"Auctiondepartment",false)
                });
                resolve(1);
            }
        })
        .catch((error) => console.log("Database connection error!!"+error));
    });
}

const makeBid =  (body,username,orgname) => {
    return new Promise( async (resolve,reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            let bid = {
                bidId: (Math.floor(Date.now() / 1000)).toString(),
                startTime: Date(),
                bidValue: body.bidValue,
                owner: username
            };
            const data = await auction.findOneAndUpdate({auctionId: body.auctionId}, { $set: {bid : bid} },{new: true, passRawResult: true, useFindAndModify:false}).catch((error) => { reject(error); });
            if(data === undefined)
                resolve(0);
            else{
                var peers = def.modules.endorsingPeers;
                var chaincodeName = def.modules.chaincodeName;
                var channelName = def.modules.channelName;
                var fcn = "makeBid";
                var args = [`"${bid.bidId}"`,`"${body.auctionId}"`,`"${bid.bidValue}"`,`"${bid.owner}"`];
                console.log(peers,chaincodeName,fcn,channelName,args);
                let message = await invoke.invokeChaincode(
                  peers,
                  channelName,
                  chaincodeName,
                  fcn,
                  args,
                  username,
                  orgname
                );
                resolve(1);
            }
        })
        .catch((error) => console.log("Database connection error!!"+error));
    });
}

const auctionHistory = async (query, username, orgname) => {
    return new Promise( async (resolve, reject) => {
        var channelName = def.modules.channelName;
        var chaincodeName = def.modules.chaincodeName;
        let args = query.args;
        let fcn = "getAuctionHistory";
        let peer;
        if(orgname === "Auctiondepartment")
            peer = def.modules.Auctiondepartment;
        else if(orgname === "Auditor")
            peer = def.modules.Auditor;
        else
            peer = def.modules.Bidder;
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        let message = await la.queryChaincode(
          peer,
          channelName,
          chaincodeName,
          args,
          fcn,
          username,
          orgname
        ).catch((error)=>{reject(error)});
        resolve(message)
    });
}

const viewAuctions = async (username, orgname) => {
    return new Promise(async (resolve, reject) => {
        var channelName = def.modules.channelName;
        var chaincodeName = def.modules.chaincodeName;
        let args = ["{\"selector\":{\"docType\":\"auction\"}}"];
        let fcn = "viewItems";
        let peer;
        if(orgname === "Auctiondepartment")
            peer = def.modules.Auctiondepartment;
        else if(orgname === "Auditor")
            peer = def.modules.Auditor;
        else
            peer = def.modules.Bidder;
 //       args = args.replace(/'/g, '"');
//        args = JSON.parse(args);
        let message = await la.queryChaincode(
          peer,
          channelName,
          chaincodeName,
          args,
          fcn,
          username,
          orgname
        ).catch((error) => {reject(error)})
        resolve(message);
    });
}

module.exports = {
    startAuction: startAuction,
    serverStart: serverStart,
    makeBid: makeBid,
    auctionHistory: auctionHistory,
    viewAuctions: viewAuctions
}