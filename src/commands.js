#!/usr/bin/env node
const CoinGecko = require('coingecko-api');
const { printTable, printChart } = require('./output');



const CoinGeckoClient = new CoinGecko();

var ping = async () => {
    const data = await CoinGeckoClient.ping();
    console.log(data.data['gecko_says'])
};

var coinsAll = async (n) => {
    let data = await CoinGeckoClient.coins.all({
        per_page: n ? n : 10
    });

    if (!_isResponseSuccess(data)) {
        console.log(data.data.error)
        return;
    }
    printTable(data.data)
};

var coinsFetch = async (coinId) => {
    let data = await CoinGeckoClient.coins.fetch(coinId, {});

    if (!_isResponseSuccess(data)) {
        console.log(data.data.error)
        return;
    }
}

var fetchMarketChartRange = async (coinId, days = 1) => {
    const data = await CoinGeckoClient.coins.fetchMarketChart(coinId, {
        days: days
    })
    printChart(data.data.prices, coinId)
}


var _isResponseSuccess = function (data) {
    return data.success
}

module.exports = {
    ping, coinsAll, coinsFetch, fetchMarketChartRange
};