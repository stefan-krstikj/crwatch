#!/usr/bin/env node
const CoinGecko = require('coingecko-api');

const { printTable } = require('./output');



const CoinGeckoClient = new CoinGecko();

var global = async (coin) => {
    const data = await CoinGeckoClient.global();
    console.log(data)
};

var ping = async () => {
    const data = await CoinGeckoClient.ping();
    console.log(data.data['gecko_says'])
};

var coinsAll = async () => {
    let data = await CoinGeckoClient.coins.all();
    if (!_isResponseSuccess(data)) {
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

var _isResponseSuccess = function (data) {
    return data.success = "true"
}

module.exports = {
    global, ping, coinsAll, coinsList, coinsMarkets
};