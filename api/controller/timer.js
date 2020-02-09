const def = require("../config/config");
const invoke =require("../app/invoke-transaction")
const moment = require("moment");
const mongo = require('mongoose');
const auction = require('../db/models/auction');
const db = def.modules.dbUri;
var calculatetime = (currenttime,endtime) => {
    diff = Date.parse(endtime) - Date.parse(currenttime)
    if(diff <= 0)
        return true;
    else
        return Date.parse(endtime)-Date.parse(currenttime);
};

const check =  async (time, auctionid, username, orgname) => {
  const endtime = moment().format(time)
  console.log(`endtime parsed: ${Date.parse(endtime)}`);
  console.log(auctionid,username,orgname)
  var refreshid = setInterval( async () => {
    let response = calculatetime(moment().format(),endtime);
    if(response === true){
        console.log(`Auction with auctionId ${auctionid} has ended`);
        try {
        const result = await auctioncomplete(auctionid, username, orgname)
        console.log("result:" + result);
      }
        catch(error) {
          console.log(error);
          clearInterval(refreshid);
        };
        console.log("response:" + response);
        clearInterval(refreshid);
    }
    else{
      console.log(`Auction with auctionid ${auctionid} has ${(response/1000)}seconds time left.`);
    }
  }, 1000);
}

const auctioncomplete =  (auctionId,username,orgname) => {
  return new Promise(  (resolve,reject) => {
      console.log(auctionId,username,orgname);
      mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
      .then(async () => {
          console.log("Database connected");
          const data = await auction.findOneAndUpdate({auctionId: auctionId}, { $set: {status : "Completed"} },{new: true, passRawResult: true, useFindAndModify:false}).catch((error) => { reject(error); });
          var peers = def.modules.endorsingPeers;
          var chaincodeName = def.modules.chaincodeName;
          var channelName = def.modules.channelName;
          var fcn = endAuction;
          var args = [`"${auctionId}"`];
          console.log(peers,chaincodeName,fcn,channelName,args);
          // // if (!chaincodeName) {
          // //   res.json(getErrorMessage("'chaincodeName'"));
          // //   return;
          // // }
          // // if (!channelName) {
          // //   res.json(getErrorMessage("'channelName'"));
          // //   return;
          // // }
          // // if (!fcn) {
          // //   res.json(getErrorMessage("'fcn'"));
          // //   return;
          // // }
          // // if (!args) {
          // //   res.json(getErrorMessage("'args'"));
          // //   return;
          // // }
          // let message = await invoke.invokeChaincode(
          //   peers,
          //   channelName,
          //   chaincodeName,
          //   fcn,
          //   args,
          //   username,
          //   orgname
          // );
          resolve(true);
      })
      .catch((error) => console.log("Database connection error!!"+error));
  });
}


module.exports = {
  check: check
}