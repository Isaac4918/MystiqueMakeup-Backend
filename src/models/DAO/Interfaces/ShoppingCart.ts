const ProductAddedToCart = require('./ProductAddedToCart');

interface ShoppingCart {
    username: string;
    products: typeof ProductAddedToCart[];
}

export default ShoppingCart;