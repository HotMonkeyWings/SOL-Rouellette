// First import the solana web3 library
const web3 = require("@solana/web3.js");

// Establish a connection, here with the devnet
// Second parameter specifies the commitment level
// "confirmed" => node will query most recent block voted by supermajority of cluster. 
//                  - It will incorporate votes from gossip and replay.
//                  - It doesn't count votes on descendants of block, only direct votes on the block
//                  - The confirmation level upholds "optimistic confirmation" guaranttees.
//
// "finalized" => node will query the most recent block confirmed by supermajority of the cluster
//                as having reached the maximum lockout => CLUSTER RECOGNIZED BLOCK AS FINALIZED
//
// "processed" => Node will query its most recent block. Block may be still skipped by cluster.
//
// Safety: finalized > confirmed > processed
// Speed: processed > confirmed > finalized
// => Confirmed is best & recommended
const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")
// console.log(connection);

// Player's wallet, which we'll be generating for now.
const userWallet = web3.Keypair.generate();

console.log(userWallet);