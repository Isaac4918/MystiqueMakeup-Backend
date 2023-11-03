import { Product } from "../models/Product";
import {  ProductDAOImpl  } from "../models/DAO/productDAOImpl";
import { ProductFactory } from "../models/productFactory";
import { SubCategory } from "../models/SubCategory";

export class ProductsController{
    private static instance: ProductsController;
    private productDAO: ProductDAOImpl;
    private productFactory: ProductFactory;
    
    //Constructor
    constructor(){
        this.productDAO = ProductDAOImpl.getInstanceProduct();
        this.productFactory = new ProductFactory();
    }

    //Getter
    public static getInstance(): ProductsController {
        if (!ProductsController.instance) {
            ProductsController.instance = new ProductsController();
        }
        return ProductsController.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------
    async createProduct(pName: string, pDescripcion: string, pPrice: number, pAvailable: number, pImage: Blob, pSubCategory: SubCategory){
        let product = this.productFactory.createItem(pName, pDescripcion, pPrice, pAvailable, pImage, pSubCategory);
        this.productDAO.create(product);
    }

}