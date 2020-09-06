var formatCurrency = function (number) {
    var SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

    var tier = Math.log10(number) / 3 | 0;

    if(tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
}

var roundNumber = ((number, decimals = 2) => {
    return number.toFixed(decimals)
})

module.exports = {
    formatCurrency, roundNumber
};