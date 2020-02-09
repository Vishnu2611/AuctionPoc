./bin/configtxgen -profile AuctionGenesis -channelID mychannel -outputBlock ./channel-artifacts/genesis.block

./bin/configtxgen -profile Auction_Channel -outputCreateChannelTx ./channel-artifacts/Auction_Channel.tx -channelID auctionchannel


./bin/configtxgen -profile Auction_Channel -outputAnchorPeersUpdate ./channel-artifacts/Auditor_Channelanchors.tx -channelID auctionchannel -asOrg AuditorMSP

./bin/configtxgen -profile Auction_Channel -outputAnchorPeersUpdate ./channel-artifacts/Auctiondepartment_Channelanchors.tx -channelID auctionchannel -asOrg AuctiondepartmentMSP

./bin/configtxgen -profile Auction_Channel -outputAnchorPeersUpdate ./channel-artifacts/Bidder_Channelanchors.tx -channelID auctionchannel -asOrg BidderMSP