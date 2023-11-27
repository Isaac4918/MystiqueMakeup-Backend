import { CrudDAO } from './CrudDAO';
const firestore = require('firebase/firestore');
const { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } = firestore;
const db = require('./configurationDB/databaseConfig.ts');
const ShoppingCart = require('./Interfaces/ShoppingCart.ts');
const ProductAddedToCart = require('./Interfaces/ProductAddedToCart.ts');

class ShoppingCartDAOImpl implements CrudDAO{
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
            let products: typeof ProductAddedToCart[] = [];
            let pObj: typeof ShoppingCart = {
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
    async getAll(): Promise<typeof ShoppingCart[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'ShoppingCart'));
            let data: typeof ShoppingCart[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({...doc.data() } as unknown as typeof ShoppingCart);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen cuentas');
          }
    }

     //--------------------------- GET ONE ACCOUNT ---------------------------------------------------------
    async get(pId: string): Promise<typeof ShoppingCart> {
        try {
            const docSnapshot = await getDoc(doc(db, 'ShoppingCart', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {...docSnapshot.data()} as unknown as typeof ShoppingCart;
          
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
    async update(pObj: typeof ShoppingCart): Promise<boolean> {
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

export default ShoppingCartDAOImpl;