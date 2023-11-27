const Purchase = require('./Purchase');

export interface Subject {
    addObserver(username: string): void;
    notifyObservers(purchase: typeof Purchase): void;
}
