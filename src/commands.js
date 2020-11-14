#!/usr/bin/env node
const CoinGecko = require('coingecko-api');
const readline = require('readline');
const {printTable, printChart, getTime, printTime} = require('./print');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const CoinGeckoClient = new CoinGecko();
var viewingChartData = false

var ping = async () => {
    const data = await CoinGeckoClient.ping();
    console.log(data.data['gecko_says'])
};

var coinsAll = (n, watch, activeCoin = 0) => {
    if (watch !== undefined && watch < 30) {
        console.error("error: required option '-w, --watch [seconds]' needs to be greater than 30 seconds!")
        return
    }
    if (watch !== undefined) {
        // interactive
        interactive(n, watch, activeCoin)
    } else {
        getCoins(n).then(data => {
            if (!_isResponseSuccess(data)) {
                console.log(data.data.error)
                return;
            }
            printTime()
            printTable(data.data, watch, activeCoin)
        })
    }

}

function interactive(n, watch, activeCoin) {
    getCoins(n).then(data => {
        var timestamp = getTime()
        if(!viewingChartData)
            printTable(data.data, watch, activeCoin, timestamp, true)
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else {
                switch (key.name) {
                    case ('up'):
                        if(!viewingChartData){
                            if (activeCoin !== 0) activeCoin--;
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        }
                        return

                    case ('down'):
                        if(!viewingChartData){
                            if (!((n !== undefined && activeCoin === n - 1) || (n === undefined && activeCoin === 9))) activeCoin++;
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        }
                        return

                    case ('return'):
                        if(viewingChartData){
                            viewingChartData = false
                            printTable(data.data, watch, activeCoin, timestamp, true)
                        }else{
                            // process.stdin.removeAllListeners('keypress')
                            viewingChartData = true
                            fetchMarketChartRange(data.data[activeCoin].id, 1, watch)
                        }
                        return

                    default:
                        return
                    // do nothing
                }
            }
        })
        new Promise(resolve => {
            setTimeout(resolve, watch * 1000)
        }).then(() => {
            process.stdin.removeAllListeners('keypress')
            interactive(n, watch, activeCoin)
        });
    })
}

var getCoins = async (n = 10) => {
    let data = await CoinGeckoClient.coins.all({
        per_page: n ? n : 10
    });
    return data
}

var fetchMarketChartRange = async (coinId, days = 1, watch) => {
    const data = await CoinGeckoClient.coins.fetchMarketChart(coinId, {
        days: days
    })
    printChart(data.data.prices, coinId, watch)
}

var _isResponseSuccess = function (data) {
    return data.success
}

module.exports = {
    ping, coinsAll, fetchMarketChartRange
};
