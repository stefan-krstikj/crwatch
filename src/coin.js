export class Coin{
    constructor(id, symbol, name, block_time_in_minutes,
        image, market_data, last_updated, localization){
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