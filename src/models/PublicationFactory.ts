import { ItemFactory } from "./ItemFactory";
import { Publication } from "./Publication";
import { SubCategory } from "./SubCategory";

export class PublicationFactory implements ItemFactory{
    createItem(pName: string, pDescripcion: string, pImage: Blob, pDate: string, pKeyWords: string[], pSubCategory: SubCategory): Publication {
        return new Publication(pName, pDescripcion, pImage, pDate, pKeyWords, pSubCategory);
    }
}


