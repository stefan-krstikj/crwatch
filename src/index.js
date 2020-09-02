#!/usr/bin/env node

const program = require('commander');
const { ping, coinsAll, coinsFetch, fetchMarketChartRange } = require('./commands');

program
    .description('List table of coins')
    .option('-t, --top [n]', 'Top n')
    .option('-o, --order', 'Order')
    .action((args) => coinsAll(args.top))

program
    .command('ping')
    .description('Ping API')
    .action(() => ping())

program
    .command('chart')
    .alias('c')
    .description('View coin as chart')
    .requiredOption('-c, --coin [coin]', "Decaf coffee")
    .option('-d, --days [n]', "Days")
    .action((args) =>
        fetchMarketChartRange(args.coin, args.days)
    )

program.parse(process.argv);