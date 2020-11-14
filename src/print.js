const Table = require('cli-table');
const chalk = require('chalk');
const { formatCurrency, roundNumber } = require('./formatter');
const config = require('./config.json');
const babar = require('babar');

var printTable = function (data, watch = true, activeCoin = 0, timestamp = null, clearConsole = false) {
    const table = new Table({
        head: [
            chalk.hex(config.colors.table_head_hex)('Name'),
            chalk.hex(config.colors.table_head_hex)('Current Price'),
            chalk.hex(config.colors.table_head_hex)('Price Change'),
            chalk.hex(config.colors.table_head_hex)('Market Cap'),
            chalk.hex(config.colors.table_head_hex)('24h High'),
            chalk.hex(config.colors.table_head_hex)('24h Low')
        ],
    });
    var counter = 0;
    data.map(it => {
        table.push([
            chalk.hex(config.colors.table_row_hex)((counter === activeCoin && watch !== false) ? chalk[config.colors.table_active_coin].black(it.localization[config.global.localization]) : it.localization[config.global.localization]),
            chalk[config.styles.table_price](it.market_data.price_change_percentage_24h < 0 ?  "🔻" + chalk.hex(config.colors.table_negative_hex)('$' + (it.market_data.current_price[config.global.currency])) :  "🔺" + chalk.hex(config.colors.table_positive_hex)('$' + (it.market_data.current_price[config.global.currency]))),
            it.market_data.price_change_percentage_24h < 0 ? chalk.hex(config.colors.table_negative_hex)(roundNumber(it.market_data.price_change_percentage_24h) + "%") : chalk.hex(config.colors.table_positive_hex)(roundNumber(it.market_data.price_change_percentage_24h) + "%"),
            chalk.hex(config.colors.table_row_hex)(formatCurrency(it.market_data.market_cap[config.global.currency])),
            chalk.hex(config.colors.table_row_hex)('$' + (it.market_data.high_24h[config.global.currency])),
            chalk.hex(config.colors.table_row_hex)('$' + (it.market_data.low_24h[config.global.currency]))
        ])
        counter++
    })

    if (clearConsole) console.clear()

    if (timestamp) {
        printTime(timestamp)
    }
    console.log(chalk.hex(config.colors.table_bg_hex)(table.toString()))
}

var printChart = ((data, coinId, watch) => {
    if (watch !== undefined)
        console.clear()
    console.log(babar(data, {
        color: config.colors.chart,
        height: 10,
        caption: coinId
    }));
    if (watch !== undefined)
        console.log(' ' + chalk[config.colors.table_active_coin].black('Return'))
})

var printTime = ((timestamp = null) => {
    if(!timestamp)
        timestamp = getTime()
    console.log('')
    console.log(chalk.hex(config.colors.last_update_hex)[config.styles.last_update](' Last update: ') + chalk.hex(config.colors.timestamp_hex)[config.styles.timestamp](timestamp))
})

var getTime = (() => {
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()
    var day = today.getDay() < 10 ? '0' + today.getDay() : today.getDay()
    var hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
    var minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    var seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
    return (year + '-' + month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds)
})


module.exports = {
    printTable, printChart, getTime, printTime
};
