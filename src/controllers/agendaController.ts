const Agenda = require("../models/DAO/Interfaces/Agenda.ts");
const agendaDAOImpl = require("../models/DAO/AgendaDAOImpl.ts");

class AgendaController{
    private static instance: AgendaController;
    private agendaDAO: typeof agendaDAOImpl;

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
    async createEntry(pEntry: typeof Agenda) : Promise<boolean | string>{ 
        return await this.agendaDAO.create(pEntry);
    }

    //--------------- GET ALL ----------------------------------------------------------------------
    async getAllAgenda(): Promise<typeof Agenda[]>{
        return await this.agendaDAO.getAll();
    }
    
    //--------------------------- GET ONE ENTRY ---------------------------------------------------------
    async getEntry(pId: string): Promise<typeof Agenda | null>{
        return await this.agendaDAO.get(pId);
    }

    //-------------- UPDATE -----------------------------------------------------------------------
    async updateAgenda(pEntry: typeof Agenda) : Promise<boolean>{
        return await this.agendaDAO.update(pEntry);
    }

    //-------------- DELETE --------------------------------------------------------------------------
    async deleteAgenda(pId: string): Promise<boolean>{
        return await this.agendaDAO.delete(pId);
    }

}

export default AgendaController;