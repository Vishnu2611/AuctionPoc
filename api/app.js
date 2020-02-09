/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";
var log4js = require("log4js");
var logger = log4js.getLogger("SampleWebApp");
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var http = require("http");
var util = require("util");
var app = express();
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var bearerToken = require("express-bearer-token");
var cors = require("cors");
const _ = require("lodash");

require("./config.js");
var hfc = require("fabric-client");

var helper = require("./app/helper.js");
var createChannel = require("./app/create-channel.js");
var join = require("./app/join-channel.js");
var updateAnchorPeers = require("./app/update-anchor-peers.js");
var install = require("./app/install-chaincode.js");
var instantiate = require("./app/instantiate-chaincode.js");
var invoke = require("./app/invoke-transaction.js");
var query = require("./app/query.js");
const user = require("./controller/users");
const auction = require("./controller/auction");
const def = require("./config/config");

var host = process.env.HOST || hfc.getConfigSetting("host");
var port = process.env.PORT || hfc.getConfigSetting("port");
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options("*", cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// set secret variable
app.set("secret", "thisismysecret");
app.use(
  expressJWT({
    secret: "thisismysecret"
  }).unless({
    path: ["/signup", "/login","/certificate/pending","/certificate/approved","/certificate/rejected","/certificate/apply","/channels/:channelName/chaincodes/:chaincodeName","/channels/:channelName/chaincodes/:chaincodeName"]
  })
);
app.use(bearerToken());
app.use(function(req, res, next) {
  logger.debug(" ------>>>>>> new request for %s", req.originalUrl);
  if (
    req.originalUrl.indexOf("/signup") >= 0 ||
    req.originalUrl.indexOf("/login") >= 0 ||
    req.originalUrl.indexOf("/certificate/pending") >= 0 ||
    req.originalUrl.indexOf("/certificate/approved") >= 0 ||
    req.originalUrl.indexOf("/certificate/rejected") >= 0 ||
    req.originalUrl.indexOf("/certificate/apply") >= 0 ||
    req.originalUrl.indexOf("/channels/:channelName/chaincodes/:chaincodeName") >= 0 ||
    req.originalUrl.indexOf("/channels/:channelName/chaincodes/:chaincodeName") >= 0




  ) {
    return next();
  }

  var token = req.token;
  jwt.verify(token, app.get("secret"), function(err, decoded) {
    if (err) {
      res.send({
        success: false,
        message:
          "Failed to authenticate token. Make sure to include the " +
          "token returned from /users call in the authorization header " +
          " as a Bearer token"
      });
      return;
    } else {
      // add the decoded user name and org name to the request object
      // for the downstream code to use
      req.username = decoded.username;
      req.orgname = decoded.orgName;
      logger.debug(
        util.format(
          "Decoded from JWT token: username - %s, orgname - %s",
          decoded.username,
          decoded.orgName
        )
      );
      return next();
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, async function() {
  console.log("Starting existing auctions");
  const result = await auction.serverStart();
  if(result === 0)
      console.log("No existing auction to start!!");
});
logger.info("****************** SERVER STARTED ************************");
logger.info("***************  http://%s:%s  ******************", host, port);
server.timeout = 240000;

function getErrorMessage(field) {
  var response = {
    success: false,
    message: field + " field is missing or Invalid in the request"
  };
  return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
//Login appi

app.post("/signup", async function(req, res) {
  var username = req.body.email
  var orgName
  var role=req.body.role;
  let info;
  logger.debug("End point : /signup");
  logger.debug("First Name : " + req.body.firstName);
  logger.debug("Last Name  : " + req.body.lastName);
  logger.debug("Email  : " + req.body.email);
  logger.debug("Phone Number : " + req.body.phoneNumber);
  logger.debug("Password  : " + req.body.password);
  logger.debug("Role  : " + req.body.role);
  if (!req.body.firstName) {
    res.json(getErrorMessage("'First Name'"));
    return;
  }
  if (!req.body.middleName) {
    res.json(getErrorMessage("'Middle Name'"));
    return;
  }
  if (!req.body.lastName) {
    res.json(getErrorMessage("'Last Name'"));
    return;
  }
  if (!req.body.email) {
    res.json(getErrorMessage("'Email"));
    return;
  }
  if (!req.body.phoneNumber) {
    res.json(getErrorMessage("'Phone Number'"));
    return;
  }
  if (!req.body.password) {
    res.json(getErrorMessage("'password'"));
    return;
  }
  if (!req.body.role) {
    res.json(getErrorMessage("'Role'"));
    return;
  }
  if (role === "auditor")
    orgName = "Auditor";
  else if (role === "auctiondepartment")
    orgName = "Auctiondepartment";
  else if (role === "bidder")
    orgName = "Bidder"
  else {
    let response = {};
    response.message = "Invalid Role";
    response.status = "failure";
    return res.json(response);
  }
  try{
    info = await user.register(req.body,orgName);
  }
  catch(error){
    let response = {};
    response.message = "Mongo Error" + error;
    response.status = "failure";
    return res.json(response);
  }
  try{
  let response = await helper.getRegisteredUser(info.email, info.orgName, true);
	logger.debug(
	  "-- returned from registering the username %s for organization %s",
	  username,
	  orgName
	);
	if (response && typeof response !== "string") {
	  logger.debug(
		"Successfully registered the username %s for organization %s",
		username,
		orgName
	  );
	  response.message = "user created successfully";
	  response.status = "success";
	  delete response.secret;
	  res.json(response);
	} else {
	  logger.debug(
		"Failed to register the username %s for organization %s with::%s",
		username,
		orgName,
		response
	  );
	  res.json({ success: false, message: response });
	}
  }
  catch(error) {
	  let response = {};
    response.message = "user exists in wallet";
    response.status = "failure";
    return res.json(response);
  }
});

// Login user
app.post("/login", async function(req, res) {
  let response = {};
  var username = req.body.email;
  const password = req.body.password;
  logger.debug("End point : /users");
  logger.debug("Email : " + username);
  logger.debug("Password  : " + password);
  if (!username) {
    res.json(getErrorMessage("'email'"));
    return;
  }
  if (!password) {
    res.json(getErrorMessage("'password'"));
    return;
  }
  try{
  const info = await user.login(req.body);
	var token = jwt.sign(
		{
		  exp:
			Math.floor(Date.now() / 1000) +
			parseInt(hfc.getConfigSetting("jwt_expiretime")),
		  username: info.email,
      name: info.firstName + info.middleName + info.lastName,
      orgName: info.orgName,
      role: info.role
		},
		app.get("secret")
    );
    console.log(jwt.decode(token));
    response.status = "200";
    response.message = "Success";
    response.token = token;
    res.json(response);
  }
  catch(error){
	  response.message = "Error";
	  response.error = error;
    response.status = "failure";
    return res.json(response);
  }
});

// Create Auction
app.post("/createAuction",async function(req,res){

  logger.debug("End point : /createAuction");
  logger.debug("auctionName :"+req.body.auctionName);
  logger.debug("items :"+req.body.items);
  logger.debug("basePrice :"+req.body.basePrice);
  logger.debug("owner :"+req.username);
  logger.debug("endTime :"+req.body.endTime);

  if(!req.body.auctionName){
    res.json(getErrorMessage("'Auction Name'"));
    return;
  }
  if(!req.body.items){
    res.json(getErrorMessage("'Items'"));
    return;
  }
  if(!req.body.basePrice){
    res.json(getErrorMessage("'Base Price'"));
    return;
  }
  if(!req.body.endTime){
    res.json(getErrorMessage("'End Time'"));
    return;
  }
  try{
    if(req.orgname === "Auctiondepartment"){
      await auction.startAuction(req.body, req.username, req.orgname);
      let response = {};
      response.message = "stored in mongo db";
      response.status = "success";
      return res.json(response);
    }
    else
      throw new Error ("Invalid operation, Only allowed by auctiondepartment employee!!");
  }
  catch(error){
    let response = {};
    response.message = "Mongo Error" + " " + error;
    response.status = "failure";
    return res.json(response);
  }
})

// show pending certificats

app.get("/certificate/pending",async function(req,res){
  console.log('show pending certificats')
  try{
    const pending= await cert.pendingCert()
    res.send(pending)
} catch(e){
    res.status(500).send()
}
});

// show approved certificats

app.get("/certificate/approved",async function(req,res){
  console.log('show approved certificats')
  try{
    const approved= await cert.approvedCert()
    res.send(approved)
} catch(e){
    res.status(500).send()
}
});

// show rejected certificats

app.get("/certificate/rejected",async function(req,res){
  console.log('show rejected certificats')
  try{
    const rejected= await cert.rejectedCert()
    res.send(rejected)
} catch(e){
    res.status(500).send()
}
});

// approve a certificate

app.post("/approveCertificate", async function(
  req,
  res
) {
  logger.debug("==================== Generate Certificate ==================");
  var peers = def.modules.endorsingPeers;
  var chaincodeName = def.modules.chaincodeName;
  var channelName = def.modules.channelName;
  var fcn = createCertificate;
  var args = req.body.args;
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!fcn) {
    res.json(getErrorMessage("'fcn'"));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'"));
    return;
  }
  await cert.approve()
  let message = await invoke.invokeChaincode(
    peers,
    channelName,
    chaincodeName,
    fcn,
    args,
    req.username,
    req.orgname
  );
  res.send(message);
});


app.post("/channels", async function(req, res) {
  logger.info("<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>");
  logger.debug("End point : /channels");
  var channelName = req.body.channelName;
  var channelConfigPath = req.body.channelConfigPath;
  logger.debug("Channel name : " + channelName);
  logger.debug("channelConfigPath : " + channelConfigPath); //../artifacts/channel/mychannel.tx
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!channelConfigPath) {
    res.json(getErrorMessage("'channelConfigPath'"));
    return;
  }

  let message = await createChannel.createChannel(
    channelName,
    channelConfigPath,
    req.username,
    req.orgname
  );
  res.send(message);
});


// Join Channel
app.post("/channels/:channelName/peers", async function(req, res) {
  logger.info("<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>");
  var channelName = req.params.channelName;
  var peers = req.body.peers;
  logger.debug("channelName : " + channelName);
  logger.debug("peers : " + peers);
  logger.debug("username :" + req.username);
  logger.debug("orgname:" + req.orgname);

  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!peers || peers.length == 0) {
    res.json(getErrorMessage("'peers'"));
    return;
  }

  let message = await join.joinChannel(
    channelName,
    peers,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Update anchor peers
app.post("/channels/:channelName/anchorpeers", async function(req, res) {
  logger.debug("==================== UPDATE ANCHOR PEERS ==================");
  var channelName = req.params.channelName;
  var configUpdatePath = req.body.configUpdatePath;
  logger.debug("Channel name : " + channelName);
  logger.debug("configUpdatePath : " + configUpdatePath);
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!configUpdatePath) {
    res.json(getErrorMessage("'configUpdatePath'"));
    return;
  }

  let message = await updateAnchorPeers.updateAnchorPeers(
    channelName,
    configUpdatePath,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Install chaincode on target peers
app.post("/chaincodes", async function(req, res) {
  logger.debug("==================== INSTALL CHAINCODE ==================");
  var peers = req.body.peers;
  var chaincodeName = req.body.chaincodeName;
  var chaincodePath = req.body.chaincodePath;
  var chaincodeVersion = req.body.chaincodeVersion;
  var chaincodeType = req.body.chaincodeType;
  logger.debug("peers : " + peers); // target peers list
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("chaincodePath  : " + chaincodePath);
  logger.debug("chaincodeVersion  : " + chaincodeVersion);
  logger.debug("chaincodeType  : " + chaincodeType);
  if (!peers || peers.length == 0) {
    res.json(getErrorMessage("'peers'"));
    return;
  }
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!chaincodePath) {
    res.json(getErrorMessage("'chaincodePath'"));
    return;
  }
  if (!chaincodeVersion) {
    res.json(getErrorMessage("'chaincodeVersion'"));
    return;
  }
  if (!chaincodeType) {
    res.json(getErrorMessage("'chaincodeType'"));
    return;
  }
  let message = await install.installChaincode(
    peers,
    chaincodeName,
    chaincodePath,
    chaincodeVersion,
    chaincodeType,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Instantiate chaincode on target peers
app.post("/channels/:channelName/chaincodes", async function(req, res) {
  logger.debug("==================== INSTANTIATE CHAINCODE ==================");
  var peers = req.body.peers;
  var chaincodeName = req.body.chaincodeName;
  var chaincodeVersion = req.body.chaincodeVersion;
  var channelName = req.params.channelName;
  var chaincodeType = req.body.chaincodeType;
  var fcn = req.body.fcn;
  var args = req.body.args;
  logger.debug("peers  : " + peers);
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("chaincodeVersion  : " + chaincodeVersion);
  logger.debug("chaincodeType  : " + chaincodeType);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!chaincodeVersion) {
    res.json(getErrorMessage("'chaincodeVersion'"));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!chaincodeType) {
    res.json(getErrorMessage("'chaincodeType'"));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'"));
    return;
  }

  let message = await instantiate.instantiateChaincode(
    peers,
    channelName,
    chaincodeName,
    chaincodeVersion,
    chaincodeType,
    fcn,
    args,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Invoke transaction on chaincode on target peers
app.post("/channels/:channelName/chaincodes/:chaincodeName", async function(
  req,
  res
) {
  logger.debug("==================== INVOKE ON CHAINCODE ==================");
  var peers = req.body.peers;
  var chaincodeName = req.params.chaincodeName;
  var channelName = req.params.channelName;
  var fcn = req.body.fcn;
  var args = req.body.args;
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!fcn) {
    res.json(getErrorMessage("'fcn'"));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'"));
    return;
  }

  let message = await invoke.invokeChaincode(
    peers,
    channelName,
    chaincodeName,
    fcn,
    args,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Query on chaincode on target peers
app.get("/channels/:channelName/chaincodes/:chaincodeName", async function(
  req,
  res
) {
  logger.debug("==================== QUERY BY CHAINCODE ==================");
  var channelName = req.params.channelName;
  var chaincodeName = req.params.chaincodeName;
  let args = req.query.args;
  let fcn = req.query.fcn;
  let peer = req.query.peer;

  logger.debug("channelName : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("fcn : " + fcn);
  logger.debug("args : " + args);

  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!fcn) {
    res.json(getErrorMessage("'fcn'"));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'"));
    return;
  }
  args = args.replace(/'/g, '"');
  args = JSON.parse(args);
  logger.debug(args);

  let message = await query.queryChaincode(
    peer,
    channelName,
    chaincodeName,
    args,
    fcn,
    req.username,
    req.orgname
  );
  res.send(message);
});
//  Query Get Block by BlockNumber
app.get("/channels/:channelName/blocks/:blockId", async function(req, res) {
  logger.debug("==================== GET BLOCK BY NUMBER ==================");
  let blockId = req.params.blockId;
  let peer = req.query.peer;
  logger.debug("channelName : " + req.params.channelName);
  logger.debug("BlockID : " + blockId);
  logger.debug("Peer : " + peer);
  if (!blockId) {
    res.json(getErrorMessage("'blockId'"));
    return;
  }

  let message = await query.getBlockByNumber(
    peer,
    req.params.channelName,
    blockId,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Query Get Transaction by Transaction ID
app.get("/channels/:channelName/transactions/:trxnId", async function(
  req,
  res
) {
  logger.debug(
    "================ GET TRANSACTION BY TRANSACTION_ID ======================"
  );
  logger.debug("channelName : " + req.params.channelName);
  let trxnId = req.params.trxnId;
  let peer = req.query.peer;
  if (!trxnId) {
    res.json(getErrorMessage("'trxnId'"));
    return;
  }

  let message = await query.getTransactionByID(
    peer,
    req.params.channelName,
    trxnId,
    req.username,
    req.orgname
  );
  res.send(message);
});
// Query Get Block by Hash
app.get("/channels/:channelName/blocks", async function(req, res) {
  logger.debug("================ GET BLOCK BY HASH ======================");
  logger.debug("channelName : " + req.params.channelName);
  let hash = req.query.hash;
  let peer = req.query.peer;
  if (!hash) {
    res.json(getErrorMessage("'hash'"));
    return;
  }

  let message = await query.getBlockByHash(
    peer,
    req.params.channelName,
    hash,
    req.username,
    req.orgname
  );
  res.send(message);
});
//Query for Channel Information
app.get("/channels/:channelName", async function(req, res) {
  logger.debug(
    "================ GET CHANNEL INFORMATION ======================"
  );
  logger.debug("channelName : " + req.params.channelName);
  let peer = req.query.peer;

  let message = await query.getChainInfo(
    peer,
    req.params.channelName,
    req.username,
    req.orgname
  );
  res.send(message);
});
//Query for Channel instantiated chaincodes
app.get("/channels/:channelName/chaincodes", async function(req, res) {
  logger.debug(
    "================ GET INSTANTIATED CHAINCODES ======================"
  );
  logger.debug("channelName : " + req.params.channelName);
  let peer = req.query.peer;

  let message = await query.getInstalledChaincodes(
    peer,
    req.params.channelName,
    "instantiated",
    req.username,
    req.orgname
  );
  res.send(message);
});
// Query to fetch all Installed/instantiated chaincodes
app.get("/chaincodes", async function(req, res) {
  var peer = req.query.peer;
  var installType = req.query.type;
  logger.debug(
    "================ GET INSTALLED CHAINCODES ======================"
  );

  let message = await query.getInstalledChaincodes(
    peer,
    null,
    "installed",
    req.username,
    req.orgname
  );
  res.send(message);
});
// Query to fetch channels
app.get("/channels", async function(req, res) {
  logger.debug("================ GET CHANNELS ======================");
  logger.debug("peer: " + req.query.peer);
  var peer = req.query.peer;
  if (!peer) {
    res.json(getErrorMessage("'peer'"));
    return;
  }

  let message = await query.getChannels(peer, req.username, req.orgname);
  res.send(message);
});
