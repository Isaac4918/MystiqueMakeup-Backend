const ShoppingCart = require('./ShoppingCart');

interface Purchase {
    orderNumber: number;
    username: string;
    address: string;
    receiptImagePath: string;
    receiptImageURL: string;
    partialPrice: number;
    finalPrice: number;
    scheduled: string;
    paymentDate: string;
    deliveryDate: string;
    cart: typeof ShoppingCart;
    details: string; 
}

export default Purchase;