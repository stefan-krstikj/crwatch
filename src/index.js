#!/usr/bin/env node
// const yargs = require("yargs");
const program = require('commander');
const { global, ping, coinsAll, coinsList, coinsMarkets } = require('./commands');
const { args } = require('commander');

// const options = yargs
//  .usage("Usage: cryptowatch [coin]")
//  .option("c", { alias: "coin", describe: "Crypto coin", type: "string", demandOption: true}
//  )
//  .argv;

program
    .command('list')
    .alias('l')
    .description('List Coins')
    .option('-c, --coin [coin]', 'Crypto Coint')
    .action((coin) => coinsAll(coin))

program
    .command('ping')
    .description('Ping API')
    .action(() => ping())

program.parse(process.argv);