#!/usr/bin/env node
const CoinGecko = require('coingecko-api');
const readline = require('readline');
const {printTable, printChart, getTime, printTime} = require('./print');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const CoinGeckoClient = new CoinGecko();
let viewingChartData = false;

function ping() {
    _ping()
        .then(response => console.log(response.code + " " + response.data['gecko_says']))
        .catch(error => console.log('error', error))
}

function getCoins(n, watch, activeCoin = 0) {
    if (watch !== undefined && watch < 30) {
        console.error("error: required option '-w, --watch [seconds]' needs to be greater than 30 seconds!")
        return
    }
    if (watch !== undefined) {
        _printCoinsInteractive(n, watch, activeCoin)
    } else {
        _printCoins(n)
    }
}

function _printCoins(n) {
    _coinsAll(n).then(data => {
        if (!_isResponseSuccess(data)) {
            console.log(data.data.error)
            return;
        }
        printTime()
        printTable(data.data, false)
    })
}

function _printCoinsInteractive(n, watch, activeCoin) {
    _coinsAll(n).then(data => {
        const timestamp = getTime();
        if (!viewingChartData)
            printTable(data.data, watch, activeCoin, timestamp, true)
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else {
                switch (key.name) {
                    case ('up'):
                        if (!viewingChartData) {
                            if (activeCoin !== 0) activeCoin--;
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        }
                        return

                    case ('down'):
                        if (!viewingChartData) {
                            if (!((n !== undefined && activeCoin === n - 1) || (n === undefined && activeCoin === 9))) activeCoin++;
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        }
                        return

                    case ('return'):
                        if (viewingChartData) {
                            viewingChartData = false
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        } else {
                            viewingChartData = true
                            _fetchMarketChartRange(data.data[activeCoin].id, 1)
                                .then(response =>
                                    printChart(response.data.prices, data.data[activeCoin].id, watch))
                                .catch(error => console.log(error))
                        }
                        return

                    default:
                        return
                }
            }
        })
        new Promise(resolve => {
            setTimeout(resolve, watch * 1000)
        }).then(() => {
            process.stdin.removeAllListeners('keypress')
            _printCoinsInteractive(n, watch, activeCoin)
        });
    })
}

async function _coinsAll(n = 10) {
    return CoinGeckoClient.coins.all({
        per_page: n ? n : 10
    });
}

async function _fetchMarketChartRange(coinId, days = 1) {
    return CoinGeckoClient.coins.fetchMarketChart(coinId, {
        days: days
    });
}

async function _ping() {
    return CoinGeckoClient.ping();
}

function _isResponseSuccess(data) {
    return data.success
}

module.exports = {
    ping, getCoins, fetchMarketChartRange: _fetchMarketChartRange
};
