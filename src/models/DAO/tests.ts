import { categoryDAOImpl } from "./CategoryDAOImpl";
import { Category } from "./Interfaces";
import { CategoryController } from "../../controllers/CategoryController";
import { ProductDAOImpl } from "./ProductDAOImpl";
import { ShoppingCartDAOImpl } from "./ShoppingCartDAOImpl";
import { PurchaseDAOImpl } from "./PurchaseDAOImpl";

let dao = ShoppingCartDAOImpl.getInstance();
let daoPurchase = PurchaseDAOImpl.getInstance();
let controller = CategoryController.getInstance();

let prueba = {
    "username": "Isaac4918",
    "products": []
};

let pruebaPurchase = {
    "orderNumber": 12345,
    "username": "user123",
    "address": "123 Main St, Anytown, USA",
    "receiptImagePath": "/path/to/receipt.jpg",
    "receiptImageURL": "https://example.com/path/to/receipt.jpg",
    "partialPrice": 99.99,
    "finalPrice": 119.99,
    "scheduled": true,
    "paymentDate": "2022-01-01",
    "deliveryDate": "2022-01-02",
    "cart": {"username": "Isaac4918", "products": [
        {
            "productId": 1,
            "quantity": 2,
            "price": 99.99
        },
        {
            "productId": 2,
            "quantity": 1,
            "price": 19.99
        }
    ]}
}

async function test() {
    await daoPurchase.create(pruebaPurchase);
    console.log(await daoPurchase.get("12345"))
}

test();
