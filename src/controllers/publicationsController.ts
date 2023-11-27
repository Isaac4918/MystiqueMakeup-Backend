import { Publication, RequestedMakeups } from "../models/DAO/Interfaces";
import { PublicationDAOImpl } from "../models/DAO/publicationDAOImpl";
import { RequestedMakeupsDAOImpl } from "../models/DAO/RequestedMakeupsDAOImpl";
import { PublicationFactory } from "../models/PublicationFactory";

export class PublicationsController{
    private static instance: PublicationsController;
    private publicationDAO: PublicationDAOImpl;
    private requestedMakeupsDAO: RequestedMakeupsDAOImpl;
    
    //Constructor
    constructor(){
        this.publicationDAO = PublicationDAOImpl.getInstancePublication();
        this.requestedMakeupsDAO = RequestedMakeupsDAOImpl.getInstance();
    }

    //Getter
    public static getInstance(): PublicationsController {
        if (!PublicationsController.instance) {
            PublicationsController.instance = new PublicationsController();
        }
        return PublicationsController.instance;
    }

    //Methods
    // Publications

    // --------------------------- GET ID -------------------------------------------------------
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

    //Requested Makeups
    // --------------------------- GET ID ---------------------------------------------------------
    async getIdRequestedMakeup(): Promise<number> {
        return await this.requestedMakeupsDAO.getId();
    }

    //--------------------------- UPDATE ID ---------------------------------------------------------
    async updateIdRequestedMakeup(pId: number): Promise<boolean>{
        return await this.requestedMakeupsDAO.updateId(pId);
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async createRequestedMakeup(pRequestedMakeup: RequestedMakeups): Promise<boolean> {
        return this.requestedMakeupsDAO.create(pRequestedMakeup);
    }
    
    //--------------------------- GET ALL ---------------------------------------------------------
    async getAllRequestedMakeup(): Promise<RequestedMakeups[]> {
        let requestedMakeups: RequestedMakeups[] = [];
        requestedMakeups = await this.requestedMakeupsDAO.getAll();
        return requestedMakeups;
    }

    //--------------------------- GET BY ID ---------------------------------------------------------
    async getRequestedMakeup(pId: string){
        let requestedMakeup: RequestedMakeups;
        requestedMakeup = await this.requestedMakeupsDAO.get(pId);
        return requestedMakeup;
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateRequestedMakeup(pRequestedMakeup: RequestedMakeups): Promise<boolean> {
        return this.requestedMakeupsDAO.update(pRequestedMakeup);
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async deleteRequestedMakeup(pId: string): Promise<boolean> {
        return this.requestedMakeupsDAO.delete(pId);
    }
}