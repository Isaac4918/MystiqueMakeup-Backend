import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Purchase } from '../Purchase';

export class purchaseDAOImpl implements CrudDAO{
    private static instance: purchaseDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstancePurchase(): purchaseDAOImpl {
        if (!purchaseDAOImpl.instance) {
            purchaseDAOImpl.instance = new purchaseDAOImpl();
        }
        return purchaseDAOImpl.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------    
    async create(pObj: Purchase): Promise<void> {
        let orderNumber = pObj.getOrderNumber().toString();
        try {
            const docRef = await addDoc(collection(db, "Purchases"), {
                orderNumber: pObj.getOrderNumber,
                finalPrice: pObj.getFinalPrice,
                address: pObj.getAddress,
                pending: pObj.getPending
            });
            console.log("Agregó con éxito");
        } catch (error) {
            console.error("Error al escribir: ", error);
        }
    }

     //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Purchase[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'ShoppingCart'));
            let data: Purchase[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({ id: doc.id, ...doc.data() } as unknown as Purchase);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen cuentas');
          }
    }

     //--------------------------- GET ONE ACCOUNT ---------------------------------------------------------
    async get(pId: string): Promise<Purchase> {
        try {
            const docSnapshot = await getDoc(doc(db, 'ShoppingCart', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as Purchase;
          
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
    async update(pObj: Purchase): Promise<void> {
        try {
            const docRef = doc(db, 'ShoppingCart', "un id");

            await updateDoc(docRef, {
                id: "Una prueba"
            });
            console.log("Cuenta actualizada con éxito");
        } catch (error) {
            console.error("Error al actualizar la cuenta: ", error);
        }
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async delete(pObj: Purchase): Promise<void> {
        try {
            const docRef = doc(db, 'ShoppingCart', "un id");
            await deleteDoc(docRef);
            console.log("Carrito de compras eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el carrito de compras: ", error);
        }
    }

}
