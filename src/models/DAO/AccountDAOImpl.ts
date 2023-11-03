import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Account } from '../Account';

export class AccountDAOImpl implements CrudDAO{
    private static instance: AccountDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstanceAccount(): AccountDAOImpl {
        if (!AccountDAOImpl.instance) {
            AccountDAOImpl.instance = new AccountDAOImpl();
        }
        return AccountDAOImpl.instance;
    }

    //Methods
    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Account): Promise<boolean> {
        let username = pObj.getUsername();
        try {
            await setDoc(doc(db, "Accounts", username), {
                username: pObj.getUsername(),
                password: pObj.getPassword(),
                email: pObj.getEmail(),
                admin: pObj.getAdmin()
            });
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

     //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Account[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Accounts'));
            let data: Account[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              let accountData = doc.data();
              let account = new Account(accountData.username, accountData.password, accountData.email, accountData.admin);
              data.push(account);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen cuentas');
          }
    }

     //--------------------------- GET ONE ACCOUNT ---------------------------------------------------------
    async get(username: string): Promise<Account> {
        try {
            console.log("BUSCANDO");
            const docSnapshot = await getDoc(doc(db, 'Accounts', username));
            
          
            if (docSnapshot.exists()) {
                console.log("SÍ EXISTE")
              // Get data
              let accountData = docSnapshot.data();
              let account = new Account(accountData.username, accountData.password, accountData.email, accountData.admin);

              // Return object
              console.log(account.getUsername());
              return account;
            } else {
                throw new Error('No existe la cuenta');
            }

        } catch (error) {
            throw new Error('Error al obtener la cuenta: '+ error);
        }   
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async update(pObj: Account): Promise<boolean> {
        let username = pObj.getUsername();
        try {
            const docRef = doc(db, 'Accounts', username);
            await updateDoc(docRef, {
                password: pObj.getPassword(),
                email: pObj.getEmail(), 
                admin: pObj.getAdmin()
            });
            console.log("Cuenta actualizada con éxito");
            return true;
        } catch (error) {
            console.error("Error al actualizar la cuenta: ", error);
            return false;
        }
    }
    
    //--------------------------- DELETE ---------------------------------------------------------
    async delete(pObj: Account): Promise<boolean> {
        let username = pObj.getUsername();
        try {
            const docRef = doc(db, 'Accounts', username);
            await deleteDoc(docRef);
            console.log("Cuenta eliminada con éxito");
            return true;
            
        } catch (error) {
            console.error("Error al eliminar la cuenta: ", error);
            return false;
        }
    }
}
