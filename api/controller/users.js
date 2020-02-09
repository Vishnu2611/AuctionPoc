var log4js = require("log4js");
var logger = log4js.getLogger("SampleWebApp");
const user = require('../db/models/user');
const mongo = require('mongoose');
const md5 = require("md5");

const register = async (body,orgName)=> {
    return new Promise((resolve, reject) => {
        const db = "mongodb://localhost:27017/Auction";
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async () => {
            console.log(body);
            if(body.role === "auditor"){
                console.log("Database Connected!!-student");
                const newauditor =  new user({
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                    email: body.email,
                    phoneNumber: body.phoneNumber,
                    password: md5(body.password),
                    role: body.role,
                    orgName: orgName
                });
                newauditor.save().then(item => resolve(item)).catch(err => reject(err));
            }
            else if (body.role === "auctiondepartment") {
                console.log("Database Connected!!-student");
                const newauctiondepartment =  new user({
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                    email: body.email,
                    phoneNumber: body.phoneNumber,
                    password: md5(body.password),
                    role: body.role,
                    orgName: orgName
                });
                newauctiondepartment.save().then(item => resolve(item)).catch(err => reject(err));
            }
            else {
                console.log("Database Connected!!-student");
                const newbidder =  new user({
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                    email: body.email,
                    phoneNumber: body.phoneNumber,
                    password: md5(body.password),
                    role: body.role,
                    orgName: orgName
                });
                newbidder.save().then(item => resolve(item)).catch(err => reject(err));
            }
        })
        .catch((error)=>{reject(error)});
    });
}

 const login = (body) => {
     return new Promise( async (resolve,reject) => {
        const db = "mongodb://localhost:27017/Auction"
        mongo.connect(db,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true })
        .then(async ()=>{
            console.log("Database Connected!!")
            const info = await user.findOne({email: body.email}).catch((error) => { reject(error) });
            if(!info){
                let response = {};
                response.message = "user does not exists";
                response.status = "failure";
                reject(response);
            }
           else{
               if(info.password === md5(body.password))
                    resolve(info);
               else{
                let response = {};
                response.message = "Passwords dont match";
                response.status = "failure";
                reject(response);
               }
           }
        })
        .catch((error)=>{
            console.log(error);
            reject(error);
        });
    });
 }
module.exports = {
    register: register,
    login: login
}