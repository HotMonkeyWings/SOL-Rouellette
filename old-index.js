// First import the solana web3 library
const web3 = require('@solana/web3.js');
const test = require('./helper.js')
// For reading wallet info
const fs = require('fs');

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
const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
);
// console.log(connection);

// Player's wallet, which we'll be generating for now.
// You can use Keypair.fromSecretKey(Uint8Array.from(userSecretKey))
// To generate a keypair from the secret key, so a new wallet doesn't need to be generated each time.
let fromWalletPath = './solana-wallet/keypair.json';
let fromWallet;

if (!fs.existsSync(fromWalletPath)) {
    fromWallet = web3.Keypair.generate();
} else {
    fromWallet = web3.Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(fromWalletPath)))
    );
}

let toWalletPath = './solana-wallet/keypair2.json';
let toWallet;

if (!fs.existsSync(toWalletPath)) {
    toWallet = web3.Keypair.generate();
} else {
    toWallet = web3.Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(toWalletPath)))
    );
}

// Creating a Transaction
// The .add() function adds instructions to the transaction
// Instructions can specify the following params:
//      - fromPubKey: The sender
//      - toPubKey: The receiver
//      - lamports: Amount in lamports (1SOL = 1000000000 lamports)

const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toWallet.publicKey,
        lamports: web3.LAMPORTS_PER_SOL,
    })
);

const transferSOL = async (from, to, transferAmt) => {
    try {
        const connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        );

        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(from.publicKey.toString()),
                toPubkey: new web3.PublicKey(to.publicKey.toString()),
                lamports: transferAmt * web3.LAMPORTS_PER_SOL,
            })
        );

        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(signature);
        return signature;
    } catch (err) {
        console.log(err);
    }
};

// Get Wallet Balance
const getWalletBalance = async (pubk) => {
    try {
        const connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        );
        const balance = await connection.getBalance(new web3.PublicKey(pubk));
        return balance / web3.LAMPORTS_PER_SOL;
    } catch (err) {
        console.log(err);
    }
};



transferSOL(toWallet, fromWallet, 4).then(() => {
    getWalletBalance(fromWallet.publicKey).then((data) => {
        console.log("From wallet has", data);
    });
    getWalletBalance(toWallet.publicKey).then((data) => {
        console.log("To wallet has", data)
    })
});