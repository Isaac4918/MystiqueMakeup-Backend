const Product = require("../models/DAO/Interfaces/Product.ts");
const ProductDAOImpl = require("../models/DAO/ProductDAOImpl.ts");

class ProductsController{
    private static instance: ProductsController;
    private productDAO: typeof ProductDAOImpl;
    
    //Constructor
    constructor(){
        this.productDAO = ProductDAOImpl.getInstance();
    }

    //Getter
    public static getInstance(): ProductsController {
        if (!ProductsController.instance) {
            ProductsController.instance = new ProductsController();
        }
        return ProductsController.instance;
    }

    //Methods

    //--------------------------- GET ID ---------------------------------------------------------
    async getId(): Promise<number>{
        return await this.productDAO.getId();
    }

    //--------------------------- UPDATE ID ---------------------------------------------------------
    async updateId(pId: number): Promise<boolean>{
        return await this.productDAO.updateId(pId);
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async createProduct(pProduct: typeof Product) : Promise<boolean>{ 
        //console.log("controller", pProduct);      
        return await this.productDAO.create(pProduct);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateProduct(pProduct: typeof Product) : Promise<boolean>{
        return await this.productDAO.update(pProduct);
    }

    //--------------------------- GET ALL ---------------------------------------------------------

    async getAllProducts(): Promise<typeof Product[]>{
        return await this.productDAO.getAll();
    }

    //--------------------------- GET ONE PRODUCT ---------------------------------------------------------

    async getProduct(pId: string): Promise<typeof Product>{
        return await this.productDAO.get(pId);
    }

    //--------------------------- DELETE ---------------------------------------------------------

    async deleteProduct(pId: string): Promise<boolean>{
        return await this.productDAO.delete(pId);
    }

    //--------------------------- UPLOAD IMAGE ---------------------------------------------------------

    async uploadImage(pImageBuffer: Buffer, pImageType: string,  pPath: string): Promise<string>{
        return await this.productDAO.uploadImage(pImageBuffer, pImageType, pPath);
    }

    //--------------------------- DELETE IMAGE ---------------------------------------------------------
    async deleteImage(pPath: string): Promise<boolean>{
        return await this.productDAO.deleteImage(pPath);
    }

    //--------------------------- GET AVAILABILITY ---------------------------------------------------------
    async getAvailability(pId: string): Promise<number> {
        return this.productDAO.getAvailability(pId);
    }

    //--------------------------- REDUCE AVAILABILITY ---------------------------------------------------------
    async reduceAvailability(pId: string, pQuantity: number): Promise<boolean> {
        return this.productDAO.reduceAvailability(pId, pQuantity);
    }
}

export default ProductsController;