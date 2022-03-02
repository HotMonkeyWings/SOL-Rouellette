const web3 = require('@solana/web3.js');

// Function to fetch wallet balance of a public key.
const getWalletBalance = async (pubk) => {
    try {
        let connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        );
        let balance = await connection.getBalance(new web3.PublicKey(pubk));
        return balance / web3.LAMPORTS_PER_SOL;
    } catch (err) {
        console.log(err);
    }
};

// Transfers <amount> SOLs from one wallet to another
const transferSOL = async (from, to, amount) => {
    try {
        let connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        );
        let transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to.publicKey,
                lamports: amount * web3.LAMPORTS_PER_SOL,
            })
        );
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        return signature;
    } catch (err) {
        throw new Error();
    }
};

// Airdrops <amount> of SOL to a Public Key.
const airDropSol = async (publicKey, amount) => {
    try {
        let connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        )

        let airdropSignature = await connection.requestAirdrop(publicKey, amount * web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(airdropSignature);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    airDropSol,
    getWalletBalance,
    transferSOL
}