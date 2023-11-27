import { CrudDAO } from './CrudDAO';
const firestore = require('firebase/firestore');
const { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } = firestore;
const db = require('./configurationDB/databaseConfig.ts');
const RequestedMakeups = require('./Interfaces/RequestedMakeups.ts');

class RequestedMakeupsDAOImpl implements CrudDAO{
    private static instance: RequestedMakeupsDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstance(): RequestedMakeupsDAOImpl {
        if (!RequestedMakeupsDAOImpl.instance) {
            RequestedMakeupsDAOImpl.instance = new RequestedMakeupsDAOImpl();
        }
        return RequestedMakeupsDAOImpl.instance;
    }

    //Methods

    //--------------------------------------------------------------------------------------

    async getId(): Promise<number> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Identificators'));
            let currentId = 0;

            querySnapshot.forEach((doc) => {
                if (doc.id == "RequestedMakeupsID") {
                    currentId = doc.data().Id;
                }
            });
            //Return object array
            return currentId;
        } catch (error) {
            throw new Error('Por el momento, no existen productos');
        }
    }

    async updateId(pId: number): Promise<boolean> {
        try {
            const docRef = doc(db, 'Identificators', 'RequestedMakeupsID');
            await updateDoc(docRef, {
                Id: pId
            });
            return true;

        } catch (error) {
            return false;
        }
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: typeof RequestedMakeups): Promise<boolean> {
        try{ 
            await setDoc(doc(db, "RequestedMakeups", pObj.orderNumber.toString()), pObj);
            console.log("Agregó con éxito");
            return true;
          } catch (error) {
            return false;
          }
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<typeof RequestedMakeups[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'RequestedMakeups'));
            let data: typeof RequestedMakeups[] = [];
  
            querySnapshot.forEach((doc) => {
                data.push({id: doc.id, ...doc.data()} as unknown as typeof RequestedMakeups);
            });

            //Return object array
            return data;

          } catch (error) {
            throw new Error('Por el momento, no existen publicaciones de maquillajes');
          }
    }

    //--------------------------- GET ---------------------------------------------------------
    async get(pId: string): Promise<typeof RequestedMakeups> {
        try {
            const docRef = doc(db, "RequestedMakeups", pId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as typeof RequestedMakeups;
          
              // Return object
              return data;
            } else {
                throw new Error('No existe el documento');
            }
        } catch (error) {
            throw new Error('Error al obtener el documento');
        }
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async update(pObj: typeof RequestedMakeups): Promise<boolean> {
        try {
            const docRef = doc(db, "RequestedMakeups", pObj.orderNumber.toString());
            await updateDoc(docRef, {
                orderNumber: pObj.orderNumber,
                username: pObj.username,
                makeup: pObj.makeup,
                requestedDate: pObj.requestedDate,
                scheduled: pObj.scheduled
            });
            return true;

          } catch (error) {
            return false;
          }
    }

    //--------------------------- DELETE ------------------------------------------------
    async delete(pId: string): Promise<boolean> {
        try {
            const requestedMakeup = await this.get(pId);
            await deleteDoc(doc(db, "RequestedMakeups", pId));
            return true;
          } catch (error) {
            return false;
          }
    }

}

export default RequestedMakeupsDAOImpl;