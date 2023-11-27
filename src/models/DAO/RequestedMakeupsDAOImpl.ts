import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc} from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { RequestedMakeups } from "./Interfaces";

export class RequestedMakeupsDAOImpl implements CrudDAO{
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
    async create(pObj: RequestedMakeups): Promise<boolean> {
        try{ 
            await setDoc(doc(db, "RequestedMakeups", pObj.orderNumber.toString()), pObj);
            console.log("Agregó con éxito");
            return true;
          } catch (error) {
            return false;
          }
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<RequestedMakeups[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'RequestedMakeups'));
            let data: RequestedMakeups[] = [];
  
            querySnapshot.forEach((doc) => {
                data.push({id: doc.id, ...doc.data()} as unknown as RequestedMakeups);
            });

            //Return object array
            return data;

          } catch (error) {
            throw new Error('Por el momento, no existen publicaciones de maquillajes');
          }
    }

    //--------------------------- GET ---------------------------------------------------------
    async get(pId: string): Promise<RequestedMakeups> {
        try {
            const docRef = doc(db, "RequestedMakeups", pId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as RequestedMakeups;
          
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
    async update(pObj: RequestedMakeups): Promise<boolean> {
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