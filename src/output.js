const Table = require('cli-table');
const chalk = require('chalk');
const { formatCurrency } = require('./formatter');
const config = require('./config.json');

var printTable = function (data) {
    const table = new Table({
        head: [
            chalk[config.colors.table_head]('Name'),
         chalk[config.colors.table_head]('Market Cap'),
         chalk[config.colors.table_head]('Price Change'),
         chalk[config.colors.table_head]('Current Price'),
         chalk[config.colors.table_head]('24h High'),
         chalk[config.colors.table_head]('24h Low')
        ]
    });
    data = data.slice(0, 10)
    data.map(it => table.push([
        it.localization[config.global.localization],
        formatCurrency(it.market_data.market_cap[config.global.currency]),
        it.market_data.price_change_percentage_24h < 0 ?  chalk[config.colors.negative](it.market_data.price_change_percentage_24h) : chalk[config.colors.positive](it.market_data.price_change_percentage_24h),
        (it.market_data.current_price[config.global.currency]),
        (it.market_data.high_24h[config.global.currency]),
        (it.market_data.low_24h[config.global.currency])
    ]))
    console.log(table.toString())
}


module.exports = {
    printTable
};