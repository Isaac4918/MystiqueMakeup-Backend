import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc} from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Purchase } from './Interfaces';

export class PurchaseDAOImpl implements CrudDAO{
    private static instance: PurchaseDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstance(): PurchaseDAOImpl {
        if (!PurchaseDAOImpl.instance) {
            PurchaseDAOImpl.instance = new PurchaseDAOImpl();
        }
        return PurchaseDAOImpl.instance;
    }

    //Methods

    async getId(): Promise<number> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Identificators'));
            let currentId = 0;

            querySnapshot.forEach((doc) => {
                if (doc.id == "PurchaseID") {
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
            const docRef = doc(db, 'Identificators', 'PurchaseID');
            await updateDoc(docRef, {
                Id: pId
            });
            return true;

        } catch (error) {
            return false;
        }
    }

    //--------------------------- CREATE ---------------------------------------------------------    
    async create(pObj: Purchase): Promise<boolean> {
        let orderNumber = pObj.orderNumber.toString();
        try {
            await setDoc(doc(db, "Purchases", orderNumber), pObj);
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

     //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Purchase[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Purchases'));
            let data: Purchase[] = [];
  
            querySnapshot.forEach((doc) => {
              data.push({...doc.data() } as unknown as Purchase);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen cuentas');
          }
    }

     //--------------------------- GET ONE ACCOUNT ---------------------------------------------------------
    async get(pOrderNumber: string): Promise<Purchase> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Purchases', pOrderNumber));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {...docSnapshot.data()} as unknown as Purchase;
          
              // Return object
              return data;
            } else {
                throw new Error('No existe la cuenta');
            }

        } catch (error) {
            throw new Error('Error al obtener la cuenta: '+ error);
        }   
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async update(pObj: Purchase): Promise<boolean> {
        try {
            const docRef = doc(db, 'Purchases', pObj.orderNumber.toString());

            await updateDoc(docRef, {
                orderNumber: pObj.orderNumber,
                username: pObj.username,
                address: pObj.address,
                receiptImagePath: pObj.receiptImagePath,
                receiptImageURL: pObj.receiptImageURL,
                partialPrice: pObj.partialPrice,
                finalPrice: pObj.finalPrice,
                scheduled: pObj.scheduled,
                paymentDate: pObj.paymentDate,
                deliveryDate: pObj.deliveryDate,
                cart: pObj.cart, 
                details: pObj.details
            });
            console.log("Compra actualizada con éxito");
            return true;
        } catch (error) {
            console.error("Error al actualizar la compra: ", error);
            return false;
        }
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async delete(pOrderNumber: string): Promise<boolean> {
        try {
            const docRef = doc(db, 'Purchases', pOrderNumber);
            await deleteDoc(docRef);
            console.log("Compra eliminada con éxito");
            return true;
        } catch (error) {
            console.error("Error al eliminar la compra: ", error);
            return false;
        }
    }

}
