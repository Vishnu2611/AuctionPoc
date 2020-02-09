"use strict";

const { Contract } = require("fabric-contract-api");

class Auction extends Contract {
    async init(ctx){
        console.info("Chaincode Instantiated");
    }

    async createItem(
        ctx,
        itemId,
        name,
        value,
        owner
    ) {
        let item = {
            itemId,
            name,
            value,
            status: "Active",
            owner,
            docType: "item",
        };
        console.info(item);
        try {
            await ctx.stub.putState(
                item.itemId,
                Buffer.from(JSON.stringify(item))
            );
            console.log("The item is created successfully");
            return(JSON.stringify({response:"The item is created successfully!!!"}));
        } catch (error) {
            throw new Error(
                "The item is not created successfully this the error faced in creating: " +
                    error
            );
        }
    }

    async viewItems(ctx, querystring) {
        try {
            const resultIterator = await ctx.stub.getQueryResult(querystring);
            const items = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let item = {};
                    item.Key = res.value.Key;
                    item.Record = JSON.parse(res.value.value.toString("utf8"));
                    items.push(item);
                }
                if (res.done) {
                    await resultIterator.close();
                    return items;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async getItemHistory(ctx,id){
        try {
            const resultIterator = await ctx.stub.getHistoryForKey(id);
            const items = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let item = {};
                    item.Key = res.value.Key;
                    item.Record = JSON.parse(res.value.value.toString("utf8"));
                    items.push(item);
                }
                if (res.done) {
                    await resultIterator.close();
                    return items;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async changeItemOwner(ctx, id, newowner) {
        try {
            const itemAsBytes = await ctx.stub.getState(id);
            if (!itemAsBytes || itemAsBytes.length === 0) {
                throw new Error(`Item with itemid ${id} does not exist`);
            }
            console.log(itemAsBytes.toString());
            let item = JSON.parse(itemAsBytes.toString());
            item.owner = newowner;
            try {
                await ctx.stub.putState(
                    item.id,
                    Buffer.from(JSON.stringify(item))
                );
                console.log("The owner of item is updated");
                return(JSON.stringify({response:`Item with itemid ${id} has changed its owner to ${newowner}!!!`}));
            } catch (error) {
                throw new Error(
                    `Item with itemid ${id} has not changed correctly: ` +
                        error
                );
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async startAuction(
        ctx,
        auctionId,
        auctionName,
        items,
        basePrice,
        endTime,
        owner
    ) {
        let auction = {
            auctionId,
            auctionName,
            items,
            startTime: Date(),
            endTime,
            basePrice,
            status: "Active",
            owner,
            docType: "auction",
        };
        console.info(auction);
        try {
            await ctx.stub.putState(
                auction.auctionId,
                Buffer.from(JSON.stringify(auction))
            );
            console.log("The auction is initiated successfully");
            return(JSON.stringify({response:"The auction is initiated successfully!!!"}));
        } catch (error) {
            throw new Error(
                "The auction is not initiated successfully this the error faced in creating: " +
                    error
            );
        }
    }

    async viewAuctions(ctx, querystring) {
        try {
            const resultIterator = await ctx.stub.getQueryResult(querystring);
            const auctions = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let auction = {};
                    auction.Key = res.value.Key;
                    auction.Record = JSON.parse(res.value.value.toString("utf8"));
                    auctions.push(auction);
                }
                if (res.done) {
                    await resultIterator.close();
                    return auctions;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async endAuction(ctx, id) {
        try {
            const auctionAsBytes = await ctx.stub.getState(id);
            if (!auctionAsBytes || auctionAsBytes.length === 0) {
                throw new Error(`Auction with auctionid ${id} does not exist`);
            }
            console.log(auctionAsBytes.toString());
            let auction = JSON.parse(auctionAsBytes.toString());
            auction.status = "Completed";
            try {
                await ctx.stub.putState(
                    auction.auctionId,
                    Buffer.from(JSON.stringify(auction))
                );
                console.log("The auction  is updated");
                return(JSON.stringify({response:`Auction with auctionid ${id} has ended!!!`}));
            } catch (error) {
                throw new Error(
                    `Auction with auctionid ${id} has  not ended correctly: ` +
                        error
                );
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async getAuctionHistory(ctx,id){
        try {
            const resultIterator = await ctx.stub.getHistoryForKey(id);
            const auctions = [];
            while(true) {
                let res = await resultIterator.next();
                if(res.value && res.value.toString()) {
                    let auction = {};
                    auction.Key = res.value.Key;
                    auction.Record = JSON.parse(res.value.value.toString("utf8"));
                    auctions.push(auction);
                }
                if (res.done) {
                    await resultIterator.close();
                    return auctions;
                }
            }
        } catch (error) {
            throw new Error(`Some error has occured ${error}`);
        }
    }

    async makeBid(
        ctx,
        auctionId,
        bidValue,
        owner,
    ) {
        let bid = {
            bidId: (Math.floor(Date.now() / 1000)).toString(),
            auctionId,
            startTime: Date(),
            bidValue,
            owner,
            docType: "bid",
        };
        console.info(bid);
        try {
            const auctionAsBytes = await ctx.stub.getState(auctionId);
            if (!auctionAsBytes || auctionAsBytes.length === 0) {
                throw new Error(`Auction with auctionid ${id} does not exist`);
            }
            console.log(auctionAsBytes.toString());
            let auction = JSON.parse(auctionAsBytes.toString());
            if(auction.status === "Completed")
                return (JSON.stringify({response:`Auction has ended at ${auction.endTime}!!!`}));
            else {
                if(auction.bid === undefined)
                    auction.bid = bid
                else {
                    if(auction.bid.bidValue && auction.bid.bidValue<bidValue)
                        auction.bid = bid;
                    else
                        return (JSON.stringify({response:`Bid value entered is low please increase your bid, current bidValue is ${auction.bid.bidValue}!!!`}));
                }
            }
            try {
                await ctx.stub.putState(
                    auction.auctionId,
                    Buffer.from(JSON.stringify(auction))
                );
                console.log("The auction is updated");
                return(JSON.stringify({response:`Bid has been made current price of auction is ${auction.bid.bidValue}!!!`}));
            } catch (error) {
                throw new Error(
                    `Bid has not been made : ` +
                        error
                );
            }
        } catch (error) {
            throw new Error(
                "Some unseen error has occured: " +
                    error
            );
        }
    }

}

module.exports = Auction;
