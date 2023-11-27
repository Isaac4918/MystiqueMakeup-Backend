const Publication = require('../models/DAO/Interfaces/Publication.ts');
const RequestedMakeups = require('../models/DAO/Interfaces/RequestedMakeups.ts');
const PublicationDAOImpl = require('../models/DAO/PublicationDAOImpl.ts');
const RequestedMakeupsDAOImpl = require('../models/DAO/RequestedMakeupsDAOImpl.ts');

class PublicationsController{
    private static instance: PublicationsController;
    private publicationDAO: typeof PublicationDAOImpl;
    private requestedMakeupsDAO: typeof RequestedMakeupsDAOImpl;
    
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
    async createPublication(pPublication: typeof Publication): Promise<boolean> {
        return this.publicationDAO.create(pPublication);
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updatePublication(pPublication: typeof Publication): Promise<boolean> {
        return this.publicationDAO.update(pPublication);
        
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAllPublications(): Promise<typeof Publication[]> {
        let publications: typeof Publication[] = [];
        publications = await this.publicationDAO.getAll();
        return publications;
    }

    //--------------------------- GET BY ID ---------------------------------------------------------

    async getPublication(pId: string){
        let publication: typeof Publication;
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
    async createRequestedMakeup(pRequestedMakeup: typeof RequestedMakeups): Promise<boolean> {
        return this.requestedMakeupsDAO.create(pRequestedMakeup);
    }
    
    //--------------------------- GET ALL ---------------------------------------------------------
    async getAllRequestedMakeup(): Promise<typeof RequestedMakeups[]> {
        let requestedMakeups: typeof RequestedMakeups[] = [];
        requestedMakeups = await this.requestedMakeupsDAO.getAll();
        return requestedMakeups;
    }

    //--------------------------- GET BY ID ---------------------------------------------------------
    async getRequestedMakeup(pId: string){
        let requestedMakeup: typeof RequestedMakeups;
        requestedMakeup = await this.requestedMakeupsDAO.get(pId);
        return requestedMakeup;
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateRequestedMakeup(pRequestedMakeup: typeof RequestedMakeups): Promise<boolean> {
        return this.requestedMakeupsDAO.update(pRequestedMakeup);
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async deleteRequestedMakeup(pId: string): Promise<boolean> {
        return this.requestedMakeupsDAO.delete(pId);
    }
}

export default PublicationsController;