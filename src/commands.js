#!/usr/bin/env node
const CoinGecko = require('coingecko-api');
const readline = require('readline');
const { printTable, printChart } = require('./print');
const config = require('./config.json');
const { callbackify } = require('util');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const CoinGeckoClient = new CoinGecko();

var ping = async () => {
    const data = await CoinGeckoClient.ping();
    console.log(data.data['gecko_says'])
};

var coinsAll = (n, watch, activeCoin = 0) => {
    if (watch !== undefined && watch < 30) {
        console.error("error: required option '-w, --watch [seconds]' needs to be greater than 30 seconds!")
        // return
    }

    getCoins().then(data => {
        if (!_isResponseSuccess(data)) {
            console.log(data.data.error)
            return;
        }

        printTable(data.data, watch, activeCoin)
        
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else {
                switch (key.name) {
                    case ('up'):
                        activeCoin == 0 ? activeCoin : activeCoin--
                        printTable(data.data, watch, activeCoin)
                        break

                    case ('down'):
                        ((n !== undefined && activeCoin == n - 1) || (n === undefined && activeCoin == 9)) ? activeCoin : activeCoin++
                        printTable(data.data, watch, activeCoin)
                        break

                    case ('return'):
                        process.stdin.removeAllListeners('keypress')
                        fetchMarketChartRange(data.data[activeCoin].id, 1, watch)
                        watch = undefined;

                    default:
                    // do nothing
                }
            }
        });

        if (watch !== undefined) {
            new Promise(resolve => {
                setTimeout(resolve, watch * 1000)
            }).then(() => coinsAll(n, watch, activeCoin));
        }
        else{
            // process.exit();
        }
    })
};

var getCoins = async (n = 10) => {
    let data = await CoinGeckoClient.coins.all({
        per_page: n ? n : 10
    });
    return data
}

// var coinsFetch = async (coinId) => {
//     let data = await CoinGeckoClient.coins.fetch(coinId, {});

//     if (!_isResponseSuccess(data)) {
//         console.log(data.data.error)
//         return;
//     }
// }

var fetchMarketChartRange = async (coinId, days = 1, watch) => {
    const data = await CoinGeckoClient.coins.fetchMarketChart(coinId, {
        days: days
    })
    printChart(data.data.prices, coinId, watch)
    if (watch === undefined)
        process.exit();

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if(key.name == 'return'){
                process.stdin.removeAllListeners('keypress')
                coinsAll(10, watch)
            }
        }
    })
}

var _isResponseSuccess = function (data) {
    return data.success
}

module.exports = {
    ping, coinsAll, fetchMarketChartRange
};