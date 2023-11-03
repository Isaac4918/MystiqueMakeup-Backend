import { ItemFactory } from "./ItemFactory";
import { Product } from "./Product";
import { SubCategory } from "./SubCategory";

export class ProductFactory implements ItemFactory{
    createItem(pName: string, pDescripcion: string, pPrice: number, pAvailable: number, pImage: Blob, pSubCategory: SubCategory): Product {
        return new Product(pName, pDescripcion, pPrice, pAvailable, pImage, pSubCategory);
    }
}
