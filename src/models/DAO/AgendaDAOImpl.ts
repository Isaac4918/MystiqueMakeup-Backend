import { CrudDAO } from "./CrudDAO";

const firestore = require('firebase/firestore');
const { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } = firestore;
const db = require('./configurationDB/databaseConfig.ts');
const Agenda = require('./Interfaces/Agenda.ts');

class agendaDAOImpl implements CrudDAO{
    private static instance: agendaDAOImpl;

    //Constructor
    private constructor() {
        //Default
    }

    //Getter
    public static getInstance(): agendaDAOImpl {
        if (!agendaDAOImpl.instance) {
            agendaDAOImpl.instance = new agendaDAOImpl();
        }
        return agendaDAOImpl.instance;
    }

    //-------------------------- METHODS --------------------------------

    //---------- CREATE ---------------------------------
    async create(pObj: typeof Agenda): Promise<boolean | string> {
        try {
            // Crear un nuevo documento con un ID generado automáticamente
            const docRef = doc(collection(db, "Agenda"));

            // Agregar el ID del documento al objeto
            pObj.id = docRef.id;

            // Escribir los datos en el documento
            await setDoc(docRef, pObj);

            console.log("Documento escrito con ID: ", docRef.id);
            return docRef.id;
        } catch (e) {
            console.error("Error al agregar el documento: ", e);
            return false;
        }
    }

    // --------------- GET ALL ---------------------------------
    async getAll(): Promise<typeof Agenda[]> {
        let data: typeof Agenda[] = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'Agenda'));

            querySnapshot.forEach((doc) => {
                // Add objects
                let agendaData = doc.data();
                let agenda: typeof Agenda = { id: agendaData.id , title: agendaData.title, start: agendaData.start, end: agendaData.end, 
                    hour: agendaData.hour, duration: agendaData.duration, type: agendaData.type, details: agendaData.details, 
                    makeup: agendaData.makeup, clientData: agendaData.clientData };
                data.push(agenda);
            });
            //Return object array
            return data;

        } catch (error) {
            data = [];
            console.log("Error al obtener la Agenda: ", error);
            return data;
        }
    }

    //-------------------------- GET ONE -----------------------
    async get(pId: string): Promise<typeof Agenda | null> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Agenda', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {...docSnapshot.data()} as unknown as typeof Agenda;
          
              // Return object
              return data;
            } else {
                console.log("No hay entradas en la agenda con ese id");
                return null;
            }

        } catch (error) {
            console.log("Error al obtener la entrada de la agenda: ", error);
            return null;
        } 
    }


    // -------------------------- UPDATE ------------------
    async update(pObj: typeof Agenda): Promise<boolean> {
        try {
            const docRef = doc(db, 'Agenda', pObj.id);

            await updateDoc(docRef, {
                id: pObj.id,
                title: pObj.title,
                start: pObj.start,
                end: pObj.end,
                hour: pObj.hour,
                type: pObj.type,
                duration: pObj.duration,
                details: pObj.details,
                makeup: pObj.makeup,
                clientData: pObj.clientData
            });
            console.log("Entrada de la agenda actualizada con éxito");
            return true;
        } catch (error) {
            console.error("Error al actualizar la entrada de la agenda: ", error);
            return false;
        }
    }

    //------------------------ DELETE ---------------------------------
    async delete(pObj: string): Promise<boolean> {
        try {
            const docRef = doc(db, 'Agenda', pObj);
            await deleteDoc(docRef);
            console.log("Entrada de la agenda eliminada con éxito");
            return true;
        } catch (error) {
            console.error("Error al eliminar la entrada de la agenda: ", error);
            return false;
        }
    }
    
}

export default agendaDAOImpl;