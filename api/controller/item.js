const def = require("../config/config");
const la = require("../app/query");
const invoke =require("../app/invoke-transaction");
const item = require('../db/models/item');
const mongo = require('mongoose');
const md5= require("md5");

const db = def.modules.dbUri;

const createItem = async (body, username, orgname)=> {
    return new Promise((resolve, reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            console.log("Database Connected!!");
            const newitem =  new item({
                itemId: md5((Math.floor(Date.now() / 1000)).toString()),
                itemName: body.itemName,
                value: body.value,
                buildDate: Date(),
                owner: username
            });
            newitem.save().then(async (item) => {
                var peers = def.modules.endorsingPeers;
                var chaincodeName = def.modules.chaincodeName;
                var channelName = def.modules.channelName;
                var fcn = "createItem";
                var args = [`"${item.itemId}"`,`"${item.itemName}"`,`"${item.value}"`,`"${item.owner}"`];
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
                resolve(item);
            }).catch(err => reject(err));
        }).catch((error)=>{reject(error)});
    });
}

const itemChangeOwner =  (body) => {
    return new Promise(  async (resolve,reject) => {
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            const data = await auction.findOneAndUpdate({itemId: body.itemId}, { $set: {owner: body.owner} },{new: true, passRawResult: true, useFindAndModify:false}).catch((error) => { reject(error); });
            if(data === undefined)
                resolve(0);
            else{
                var peers = def.modules.endorsingPeers;
                var chaincodeName = def.modules.chaincodeName;
                var channelName = def.modules.channelName;
                var fcn = "changeItemOwner";
                var args = [`"${data.itemId}"`,`"${item.owner}"`];
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

const itemHistory = async (query, username, orgname) => {
    return new Promise(async (resolve, reject) => {
        var channelName = def.modules.channelName;
        var chaincodeName = def.modules.chaincodeName;
        let args = query.args;
        let fcn = "getItemHistory";
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
        resolve(message);
    });
}

const viewItem = async (username, orgname) => {
    return new Promise(async (resolve, reject) => {
        var channelName = def.modules.channelName;
        var chaincodeName = def.modules.chaincodeName;
        let args = ["{\"selector\":{\"docType\":\"item\"}}"];
        let fcn = "viewItems";
        let peer;
        if(orgname === "Auctiondepartment")
            peer = def.modules.Auctiondepartment;
        else if(orgname === "Auditor")
            peer = def.modules.Auditor;
        else
            peer = def.modules.Bidder;
        // args = args.replace(/'/g, '"');
        // args = JSON.parse(args);
        let message = await la.queryChaincode(
          peer,
          channelName,
          chaincodeName,
          args,
          fcn,
          username,
          orgname
        ).catch((error)=>{reject(error)})
        resolve(message)
    });
}


module.exports = {
    createItem: createItem,
    itemChangeOwner: itemChangeOwner,
    itemHistory: itemHistory,
    viewItem: viewItem
}