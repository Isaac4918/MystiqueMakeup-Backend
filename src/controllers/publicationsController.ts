import { Publication } from "../models/DAO/Interfaces";
import {  PublicationDAOImpl  } from "../models/DAO/publicationDAOImpl";
import { PublicationFactory } from "../models/PublicationFactory";

export class PublicationsController{
    private static instance: PublicationsController;
    private publicationDAO: PublicationDAOImpl;
    
    //Constructor
    constructor(){
        this.publicationDAO = PublicationDAOImpl.getInstancePublication();
    }

    //Getter
    public static getInstance(): PublicationsController {
        if (!PublicationsController.instance) {
            PublicationsController.instance = new PublicationsController();
        }
        return PublicationsController.instance;
    }

    //Methods

    // --------------------------- Get id -------------------------------------------------------
    async getId(): Promise<number> {
        return await this.publicationDAO.getId();
    }

    //--------------------------- UPDATE ID ---------------------------------------------------------
    async updateId(pId: number): Promise<boolean>{
        return await this.publicationDAO.updateId(pId);
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async createPublication(pPublication: Publication): Promise<boolean> {
        return this.publicationDAO.create(pPublication);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updatePublication(pPublication: Publication): Promise<boolean> {
        return this.publicationDAO.update(pPublication);
        
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAllPublications(): Promise<Publication[]> {
        let publications: Publication[] = [];
        publications = await this.publicationDAO.getAll();
        return publications;
    }

    //--------------------------- GET BY ID ---------------------------------------------------------

    async getPublication(pId: string){
        let publication: Publication;
        publication = await this.publicationDAO.get(pId);
        return publication;
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async deletePublication(pId: string): Promise<boolean> {
        return this.publicationDAO.delete(pId);
    }

}