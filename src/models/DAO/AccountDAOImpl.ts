import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Account } from '../Account';
import { Notification } from './Interfaces';

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
    //-------------------------- OBSERVER ------------------------------
    async createNotify(pAccount: Account, pOrderNumber: number, pStatus: string, pDeliveryDate: string): Promise<void>{
        var message;

        if(pStatus == 'aceptada'){
            message = "Su compra número "+pOrderNumber+" ha sido "+pStatus+" con éxito. La entrega se hará el "+ pDeliveryDate;
        }else if(pStatus == 'rechazada'){
            message = "Su compra número "+pOrderNumber+" ha sido "+pStatus +" por inconsistencias en el pago. Será contactado/a posteriormente.";
        }else if(pStatus == 'cancelada'){
            message = "Su compra número "+pOrderNumber+" ha sido "+pStatus+". Pronto se le notificará cuando será reprogramada.";
        }else{
            message =  "Su compra número "+pOrderNumber+" ha sido "+pStatus+". La entrega cambió para el "+pDeliveryDate;
        }

        try {
            await setDoc(doc(db, "Notifications", pOrderNumber.toString()), {
                id: pOrderNumber,
                username: pAccount.getUsername(),
                message: message,
                read: false
            });
            console.log("Agregó con éxito");
        } catch (error) {
            console.error("Error al escribir: ", error);
        }
    }

    async getNotify(pUsername: string): Promise<Notification[]>{
        const q = query(collection(db, "Notifications"), where("username", "==", pUsername));
        const querySnapshot = await getDocs(q);
        let data: Notification[] = [];
        querySnapshot.forEach((doc) => {
            data.push({...doc.data() } as unknown as Notification);
        });
        return data;
    }

    async updateNotify(pNotification: Notification): Promise<boolean>{
        try {
            const docRef = doc(db, 'Notifications', pNotification.id.toString());
            await updateDoc(docRef, { read: true});
            return true;
        } catch (error) {
            return false;
        }
    }

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
    async get(username: string): Promise<Account | null> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Accounts', username));    
          
            if (docSnapshot.exists()) {

              // Get data
              let accountData = docSnapshot.data();
              let account = new Account(accountData.username, accountData.password, accountData.email, accountData.admin);
              return account;
            } else {
                return null;
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
