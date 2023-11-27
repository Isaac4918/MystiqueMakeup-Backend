import { Purchase } from "../models/DAO/Interfaces";
import { PurchaseDAOImpl } from "../models/DAO/PurchaseDAOImpl";
import { ShoppingCart } from "../models/DAO/Interfaces";
import { ShoppingCartDAOImpl } from "../models/DAO/ShoppingCartDAOImpl";

export class PurchaseController{
    private static instance: PurchaseController;
    private purchaseDAO: PurchaseDAOImpl;
    private shoppingCartDAO: ShoppingCartDAOImpl;
    
    //Constructor
    constructor(){
        this.purchaseDAO = PurchaseDAOImpl.getInstance();
        this.shoppingCartDAO = ShoppingCartDAOImpl.getInstance();
    }

    //Getter
    public static getInstance(): PurchaseController {
        if (!PurchaseController.instance) {
            PurchaseController.instance = new PurchaseController();
        }
        return PurchaseController.instance;
    }

    //Methods
    // Purchases
    // --------------------------- GET ID ---------------------------------------------------------
    async getId(): Promise<number>{
        return await this.purchaseDAO.getId();
    }

    //--------------------------- UPDATE ID ---------------------------------------------------------
    async updateId(pId: number): Promise<boolean>{
        return await this.purchaseDAO.updateId(pId);
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async createPurchase(pPurchase: Purchase) : Promise<boolean>{ 
        this.purchaseDAO.addObserver(pPurchase.username);
        return await this.purchaseDAO.create(pPurchase);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updatePurchase(pPurchase: Purchase) : Promise<boolean>{
        this.purchaseDAO.notifyObservers(pPurchase);
        return await this.purchaseDAO.update(pPurchase);
    }

    //--------------------------- GET ALL ---------------------------------------------------------

    async getAllPurchases(): Promise<Purchase[]>{
        this.purchaseDAO.addDBObserver();
        return await this.purchaseDAO.getAll();
    }

    //--------------------------- GET ONE PRODUCT ---------------------------------------------------------

    async getPurchase(pOrderNumber: string): Promise<Purchase>{
        return await this.purchaseDAO.get(pOrderNumber);
    }

    //--------------------------- DELETE ---------------------------------------------------------

    async deletePurchase(pOrderNumber: string): Promise<boolean>{
        return await this.purchaseDAO.delete(pOrderNumber);
    }

    // Shopping Carts

    //--------------------------- CREATE ---------------------------------------------------------.
    async createShoppingCart(pUsername: string) : Promise<boolean>{ 
        return await this.shoppingCartDAO.create(pUsername);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateShoppingCart(pShoppingCart: ShoppingCart) : Promise<boolean>{
        return await this.shoppingCartDAO.update(pShoppingCart);
    }

    //--------------------------- GET ONE SHOPPING CART -------------------------------------------
    async getShoppingCart(pUsername: string): Promise<ShoppingCart>{
        return await this.shoppingCartDAO.get(pUsername);
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async deleteShoppingCart(pUsername: string): Promise<boolean>{
        return await this.shoppingCartDAO.delete(pUsername);
    }

    //--------------------------- Empty Shopping Cart ---------------------------------------------------------
    async emptyShoppingCart(pUsername: string): Promise<boolean>{
        return await this.shoppingCartDAO.emptyCart(pUsername);
    }

}