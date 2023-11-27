const Purchase = require('./Purchase');

export interface Observer {
    updateObserver(purchase: typeof Purchase): void;
}