import { Category } from "../models/DAO/Interfaces";
import { SubCategory } from "../models/DAO/Interfaces";
import { categoryDAOImpl  } from "../models/DAO/CategoryDAOImpl";

export class CategoryController{
    private static instance: CategoryController;
    private categoryDAO: categoryDAOImpl;

    //Constructor
    constructor(){
        this.categoryDAO = categoryDAOImpl.getInstance();
    }

    //Getter
    public static getInstance(): CategoryController {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    //Methods

    // --------------------------- Get id -------------------------------------------------------
    async getId(): Promise<number> {
        return await this.categoryDAO.getId();
    }

    //--------------------------- UPDATE ID ---------------------------------------------------------
    async updateId(pId: number): Promise<boolean>{
        return await this.categoryDAO.updateId(pId);
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async createCategory(pCategory: Category): Promise<boolean>{
        if(this.validateEmpty(pCategory.name)){
            console.log("Debe ingresar el nombre de la categoría.");
            return false;
        }else{
            let repeatedSubCategories = await this.validateRepeatedSubCategories(pCategory.subCategories);
            if(repeatedSubCategories){
                console.log("El nombre de las subcategorías debe ser único.");
                return false;
            }else{
                let uniqueCategoryName = await this.validateUniqueCategoryName(pCategory.name);
            
                if(uniqueCategoryName){
                    return await this.categoryDAO.create(pCategory);
                }else{
                    console.log("Ese nombre ya existe. Ingrese otro nombre de categoría.");
                    return false;
                }  
            }
        }
    }

    //--------------------------- READ ---------------------------------------------------------
    async getAllCategories(): Promise<Category[]>{
        return await this.categoryDAO.getAll();
    }

    async getCategory(pCategory: string): Promise<Category>{
        return await this.categoryDAO.get(pCategory);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateCategory(pCategory: Category): Promise<boolean>{
        if(this.validateEmpty(pCategory.name)){
            console.log("Debe ingresar el nombre de la categoría.");
            return false;
        }else{
            let repeatedSubCategories = await this.validateRepeatedSubCategories(pCategory.subCategories);
            if(repeatedSubCategories){
                console.log("El nombre de las subcategorías debe ser único.");
                return false;
            }else{
                return await this.categoryDAO.update(pCategory);
            }
        }
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async deleteCategory(pCategory: Category): Promise<boolean>{
        return await this.categoryDAO.delete(pCategory);
    }

    //----------------------------- VALIDATIONS ---------------------------------------------------------
    private validateEmpty(pName: string): boolean{ //if pName is empty, return true
        if(pName == ""){
            return true;
        }
        return false;
    }

    private async validateUniqueCategoryName(pName: string): Promise<boolean>{ //if pName is unique, return true
        for(let category of await this.categoryDAO.getAll()){
            // console.log(category.name);
            // console.log(category.subCategories);

            if(category.name == pName){
                return false;
            }
        }
        return true;
    }

    private async validateRepeatedSubCategories(pSubCategory: SubCategory[]): Promise<boolean> { //returns true if repeated names are entered
        // returns true if there are repeated names in the list pSubCategory
        let repeatedSubCategories = false;
        let subCategoryList: string[] = [];

        for(let subCategory of pSubCategory){
            if(!this.validateEmpty(subCategory.name)){
                if(subCategoryList.includes(subCategory.name)){
                    repeatedSubCategories = true;
                }else{
                    subCategoryList.push(subCategory.name);
                }
            }  
        }
        return repeatedSubCategories;
    }
}