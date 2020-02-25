const def = require("../config/config");
const invoke =require("../app/invoke-transaction");
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

const check =  async (time, auctionid, username, orgname, flag, body) => {
  const endtime = moment().format(time)
  console.log(`endtime parsed: ${Date.parse(endtime)}`);
  console.log(auctionid,username,orgname)
  var refreshid = setInterval( async () => {
    let response = calculatetime(moment().format(),endtime);
    if(response === true){
        console.log(`Auction with auctionId ${auctionid} has ended`);
        try {
          console.log("One:1")
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
      if(flag) {
        var peers = def.modules.endorsingPeers;
        var chaincodeName = def.modules.chaincodeName;
        var channelName = def.modules.channelName;
        var fcn = "startAuction";
        var args = [`"${auctionid}"`,`"${body.auctionName}"`,`"${body.items}"`,`"${body.basePrice}"`,`"${body.endTime}"`,`"${username}"`];
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
        flag = false;
      }
//      console.log(`Auction with auctionid ${auctionid} has ${(response/1000)}seconds time left.`);
    }
  }, 1000);
}

const auctioncomplete =  (auctionId,username,orgname) => {
  return new Promise(  (resolve,reject) => {
      console.log(auctionId,username,orgname);
      mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
      .then(async () => {
          console.log("Database connected");
          const data = await auction.findOneAndUpdate({auctionId: auctionId}, { $set: {status : false} },{new: true, passRawResult: true, useFindAndModify:false}).catch((error) => { reject(error); });
          var peers = def.modules.endorsingPeers;
          var chaincodeName = def.modules.chaincodeName;
          var channelName = def.modules.channelName;
          var fcn = "endAuction";
          var args = [`"${auctionId}"`];
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
          console.log(message);
          resolve(true);
      })
      .catch((error) => console.log("Database connection error!!"+error));
  });
}


module.exports = {
  check: check
}