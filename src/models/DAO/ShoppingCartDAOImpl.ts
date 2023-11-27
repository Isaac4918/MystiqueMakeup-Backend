import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { ShoppingCart } from './Interfaces'
import {ProductAddedToCart} from './Interfaces';

export class ShoppingCartDAOImpl implements CrudDAO{
    private static instance: ShoppingCartDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstance(): ShoppingCartDAOImpl {
        if (!ShoppingCartDAOImpl.instance) {
            ShoppingCartDAOImpl.instance = new ShoppingCartDAOImpl();
        }
        return ShoppingCartDAOImpl.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pUsername: string): Promise<boolean> {
        try {
            let products: ProductAddedToCart[] = [];
            let pObj: ShoppingCart = {
                username: pUsername,
                products: products
            }

            await setDoc(doc(db, "ShoppingCart", pUsername), pObj);
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

     //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<ShoppingCart[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'ShoppingCart'));
            let data: ShoppingCart[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({...doc.data() } as unknown as ShoppingCart);
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
              let data = {...docSnapshot.data()} as unknown as ShoppingCart;
          
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
    async update(pObj: ShoppingCart): Promise<boolean> {
        try {
            const docRef = doc(db, 'ShoppingCart', pObj.username);

            await updateDoc(docRef, {
                username: pObj.username,
                products: pObj.products
            });
            console.log("ShoppingCart actualizada con éxito");
            return true;
        } catch (error) {
            console.error("Error al actualizar la cuenta: ", error);
            return false;
        }
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async delete(pUsername: string): Promise<boolean> {
        try {
            const docRef = doc(db, 'ShoppingCart', pUsername);
            await deleteDoc(docRef);
            console.log("Carrito de compras eliminado con éxito");
            return true;
        } catch (error) {
            console.error("Error al eliminar el carrito de compras: ", error);
            return false;
        }
    }
    
    // --------------------------- Empty cart ---------------------------------------------------------
    async emptyCart(pUsername: string): Promise<boolean> {
        try {
            const docRef = doc(db, 'ShoppingCart', pUsername);
            await updateDoc(docRef, {
                username: pUsername,
                products: []
            });
            console.log("Carrito de compras vaciado con éxito");
            return true;
        } catch (error) {
            console.error("Error al vaciar el carrito de compras: ", error);
            return false;
        }
    }
}
