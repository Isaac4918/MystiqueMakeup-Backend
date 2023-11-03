import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { ShoppingCart } from '../ShoppingCart';

export class shoppingCartDAOImpl implements CrudDAO{
    private static instance: shoppingCartDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstanceAccount(): shoppingCartDAOImpl {
        if (!shoppingCartDAOImpl.instance) {
            shoppingCartDAOImpl.instance = new shoppingCartDAOImpl();
        }
        return shoppingCartDAOImpl.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: ShoppingCart): Promise<void> {
        try {
            await setDoc(doc(db, "ShoppingCart", "un id"), {
                id: "Una prueba"
            });
            console.log("Agregó con éxito");
        } catch (error) {
            console.error("Error al escribir: ", error);
        }
    }

     //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<ShoppingCart[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'ShoppingCart'));
            let data: ShoppingCart[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({ id: doc.id, ...doc.data() } as unknown as ShoppingCart);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen cuentas');
          }
    }

     //--------------------------- GET ONE ACCOUNT ---------------------------------------------------------
    async get(pId: string): Promise<ShoppingCart> {
        try {
            const docSnapshot = await getDoc(doc(db, 'ShoppingCart', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as ShoppingCart;
          
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
    async update(pObj: ShoppingCart): Promise<void> {
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
    async delete(pObj: ShoppingCart): Promise<void> {
        try {
            const docRef = doc(db, 'ShoppingCart', "un id");
            await deleteDoc(docRef);
            console.log("Carrito de compras eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el carrito de compras: ", error);
        }
    }

}
