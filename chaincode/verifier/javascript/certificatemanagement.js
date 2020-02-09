"use strict";

const { Contract } = require("fabric-contract-api");

class Certificate extends Contract {
    async init(ctx){
        console.info("Chaincode Instantiated");
    }
    async generateCertificate(
        ctx,
        name,
        age,
        email,
        type,
        provider,
        owner
    ) {
        let certificate = {
            id: (Math.floor(Date.now() / 1000)).toString(),
            name,
            age,
            email,
            yearofReceival: new Date().getFullYear(),
            provider,
            status: "Enabled",
            owner,
            type,
        };
        console.info(certificate);
        try {
            await ctx.stub.putState(
                certificate.id,
                Buffer.from(JSON.stringify(certificate))
            );
            console.log("The certificate is created");
            return(JSON.stringify({response:"The certificate is created successfully!!!"}));
        } catch (error) {
            throw new Error(
                "Certificate is not created this the error faced in creating: " +
                    error
            );
        }
    }

    async viewCertificates(ctx, querystring) {
        try {
            const resultIterator = await ctx.stub.getQueryResult(querystring);
            const certificates = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let certificate = {};
                    certificate.Key = res.value.Key;
                    certificate.Record = JSON.parse(res.value.value.toString("utf8"));
                    certificates.push(certificate);
                }
                if (res.done) {
                    await resultIterator.close();
                    return certificates;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async revokeCertificate(ctx, id) {
        try {
            const certificateAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
            if (!certificateAsBytes || certificateAsBytes.length === 0) {
                throw new Error(`${id} does not exist`);
            }
            console.log(certificateAsBytes.toString());
            let certificate = JSON.parse(certificateAsBytes.toString());
            certificate.status = "Disabled";
            try {
                await ctx.stub.putState(
                    certificate.id,
                    Buffer.from(JSON.stringify(certificate))
                );
                console.log("The certificate is updated");
                return(JSON.stringify({response:"The certificate is revoked successfully!!!"}));
            } catch (error) {
                throw new Error(
                    "certifiate is not revoked this the error faced in creating: " +
                        error
                );
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async getHistory(ctx,id){
        try {
            const resultIterator = await ctx.stub.getHistoryForKey(id);
            const certificates = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let certificate = {};
                    certificate.Key = res.value.Key;
                    certificate.Record = JSON.parse(res.value.value.toString("utf8"));
                    certificates.push(order);
                }
                if (res.done) {
                    await resultIterator.close();
                    return certificates;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async verifyCertificate(ctx, id) {
        try {
            const certificateAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
            if (!certificateAsBytes || certificateAsBytes.length === 0) {
                throw new Error(`${id} does not exist`);
            }
            let certificate = JSON.parse(certificateAsBytes.toString());
            if(certificate.status === "Disabled")
                return (JSON.stringify({resposne: "The certificate is not valid"}));
            console.log(certificateAsBytes.toString());
            return certificateAsBytes.toString();
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }
}

module.exports = Certificate;
