// Display & Input Modules
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

// Utility and Helper functions
const web3 = require('@solana/web3.js');
const { getReturnAmount, randomNumber } = require('./helper');
const { getWalletBalance, transferSOL, airDropSol } = require('./solana');
const fs = require('fs');

const questions = [
	{
		type: 'input',
		name: 'SOLamt',
		message: 'What is the amount of SOL you want to stake?',
		default() {
			return 1;
		},
	},
	{
		type: 'input',
		name: 'ratio',
		message: 'What is the ratio of your staking?',
		default() {
			return '1:1';
		},
	},
];

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

const gameExecution = async () => {
	figlet('SOL Stake', (err, data) => {
		if (err) {
			console.dir(err);
			return;
		}
		console.log(chalk.green(data));
		console.log(chalk.yellow('The max bidding amount is 2.5 SOL here'));
		inquirer.prompt(questions).then((answers) => {
			let SOLamt = answers['SOLamt'];
			let ratio = answers['ratio'];
			let returnAmount = getReturnAmount(SOLamt, ratio);
			console.log(
				'You need to pay',
				chalk.green(answers['SOLamt']),
				'to move forward'
			);
			transferSOL(toWallet, fromWallet, SOLamt)
				.then((signature) => {
					console.log(
						chalk.green(
							'You will get',
							returnAmount,
							'if guessing the number correctly'
						)
					);

					let randomGuess = randomNumber(1, 5);
					inquirer
						.prompt([
							{
								type: 'input',
								name: 'guess',
								message:
									'Guess a random number from 1 to 5 (both 1, 5 included)',
								default() {
									return 1;
								},
							},
						])
						.then((answers) => {
							console.log(
								'Signature of payment for playing the game',
								chalk.green(signature)
							);
							if (randomGuess == answers['guess']) {
								console.log(
									chalk.green(
										'Your guess is absolutely correct'
									)
								);

								transferSOL(fromWallet, toWallet, returnAmount)
									.then((winSign) => {
										console.log(
											'Here is the price signature',
											chalk.green(winSign)
										);
									})
									.catch((_) => {
										console.log(
											chalk.red(
												'The dealer is out of SOL! This is embarrasing.'
											)
										);
									});
							} else {
								console.log(
									chalk.yellow('Better luck next time')
								);
							}
						});
				})
				.catch((_) => {
					console.log(chalk.red('Insufficient Funds.'));
					return;
				});
		});
	});
};

gameExecution();
