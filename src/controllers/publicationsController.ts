import { Publication } from "../models/Publication";
import {  PublicationDAOImpl  } from "../models/DAO/publicationDAOImpl";
import { PublicationFactory } from "../models/PublicationFactory";
import { SubCategory } from "../models/SubCategory";

export class PublicationsController{
    private static instance: PublicationsController;
    private publicationDAO: PublicationDAOImpl;
    private publicationFactory: PublicationFactory;
    
    //Constructor
    constructor(){
        this.publicationDAO = PublicationDAOImpl.getInstancePublication();
        this.publicationFactory = new PublicationFactory();
    }

    //Getter
    public static getInstance(): PublicationsController {
        if (!PublicationsController.instance) {
            PublicationsController.instance = new PublicationsController();
        }
        return PublicationsController.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------
    async createPublication(pName: string, pDescripcion: string, pImage: Blob, pDate: string, pKeyWords: string[], pSubCategory: SubCategory){
        let publication = this.publicationFactory.createItem(pName, pDescripcion, pImage, pDate, pKeyWords, pSubCategory);
        this.publicationDAO.create(publication);
    }

}