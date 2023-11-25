import { Agenda } from "../models/DAO/Interfaces";
import { agendaDAOImpl } from "../models/DAO/AgendaDAOImpl";

export class AgendaController{
    private static instance: AgendaController;
    private agendaDAO: agendaDAOImpl;

    //Constructor
    constructor(){
        this.agendaDAO = agendaDAOImpl.getInstance();
    }

    
    //Getter
    public static getInstance(): AgendaController {
        if (!AgendaController.instance) {
            AgendaController.instance = new AgendaController();
        }
        return AgendaController.instance;
    }

    //Methods

    //---------------- CREATE --------------------------------------------------------------------------
    async createEntry(pEntry: Agenda) : Promise<boolean>{ 
        return await this.agendaDAO.create(pEntry);
    }

    //--------------- GET ALL ----------------------------------------------------------------------
    async getAllAgenda(): Promise<Agenda[]>{
        return await this.agendaDAO.getAll();
    }
    
    //--------------------------- GET ONE ENTRY ---------------------------------------------------------
    async getEntry(pId: string): Promise<Agenda | null>{
        return await this.agendaDAO.get(pId);
    }

    //-------------- UPDATE -----------------------------------------------------------------------
    async updateAgenda(pEntry: Agenda) : Promise<boolean>{
        return await this.agendaDAO.update(pEntry);
    }

    //-------------- DELETE --------------------------------------------------------------------------
    async deleteAgenda(pEntry: Agenda): Promise<boolean>{
        return await this.agendaDAO.delete(pEntry);
    }

}