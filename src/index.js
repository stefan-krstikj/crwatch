#!/usr/bin/env node

const program = require('commander');
const { global, ping, coinsAll, coinsList, coinsMarkets } = require('./commands');
const { args } = require('commander');

program
    .description('List table of coins')
    .option('-t, --top [n]', 'Top n')
    .option('-c, --coin [coin]', 'Coin')
    .action((n) => coinsAll(n))

program
    .command('ping')
    .description('Ping API')
    .action(() => ping())

program.parse(process.argv);