#!/usr/bin/env node
class Coin {
    constructor(id, symbol, name, block_time_in_minutes,
        image, market_data, last_updated, localization) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.block_time_in_minutes = block_time_in_minutes;
        this.image = image;
        this.market_data = market_data;
        this.last_updated = last_updated;
        this.localization = localization;
    }

}

const CoinGecko = require('coingecko-api');
const Table = require('cli-table');
const chalk = require('chalk');
const config = require('./config.json');

const CoinGeckoClient = new CoinGecko();

const HEAD_COLORS = "blueBright"

var global = async (coin) => {
    const data = await CoinGeckoClient.global();
    console.log(data)
};

var ping = async () => {
    const data = await CoinGeckoClient.ping();
    console.log(data)
};

var coinsAll = async () => {
    let data = await CoinGeckoClient.coins.all();
    if (!isResponseSuccess(data)) {
        // error handler
        consonle.log("Error")
    }
    data = data.data
    printTable(data)
};

var coinsList = async () => {
    const data = await CoinGeckoClient.coins.list();
    console.log(data)
};

var coinsMarkets = async () => {
    const data = await CoinGeckoClient.coins.markets();
    console.log(data)
};

var isResponseSuccess = function (data) {
    return data.success = "true"
}

var printTable = function (data) {
    const table = new Table({
        head: [
            chalk[HEAD_COLORS]('Name'),
         chalk[HEAD_COLORS]('Market Cap'),
         chalk[HEAD_COLORS]('Price Change'),
         chalk[HEAD_COLORS]('Current Price'),
         chalk[HEAD_COLORS]('24h High'),
         chalk[HEAD_COLORS]('24h Low')
        ]
    });
    data = data.slice(0, 10)
    data.map(it => table.push([
        it.localization[config.global.localization],
        formatCurrency(it.market_data.market_cap[config.global.currency]),
        it.market_data.price_change_percentage_24h < 0 ?  chalk.redBright(it.market_data.price_change_percentage_24h) : chalk.greenBright(it.market_data.price_change_percentage_24h),
        (it.market_data.current_price[config.global.currency]),
        (it.market_data.high_24h[config.global.currency]),
        (it.market_data.low_24h[config.global.currency])
    ]))
    console.log(table.toString())
}

var formatCurrency = function (number) {
    var SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

    var tier = Math.log10(number) / 3 | 0;

    if(tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
}

module.exports = {
    global, ping, coinsAll, coinsList, coinsMarkets
};