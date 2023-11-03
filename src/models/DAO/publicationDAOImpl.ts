import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Publication } from './Interfaces';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ProductDAOImpl } from './ProductDAOImpl';

export class PublicationDAOImpl implements CrudDAO{
    private static instance: PublicationDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstancePublication(): PublicationDAOImpl {
        if (!PublicationDAOImpl.instance) {
            PublicationDAOImpl.instance = new PublicationDAOImpl();
        }
        return PublicationDAOImpl.instance;
    }

    //Methods

    async getId(): Promise<number> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Identificators'));
            let currentId = 0;
  
            querySnapshot.forEach((doc) => {
                if(doc.id == "PublicationID"){
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
            const docRef = doc(db, 'Identificators', 'PublicationID');
            await updateDoc(docRef, {
                Id: pId
            });
            return true;

          } catch (error) {
            return false;
          }
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Publication): Promise<boolean> {
        try{ 
            await setDoc(doc(db, "Publications", pObj.id.toString()), pObj);
            console.log("Agregó con éxito");
            return true;
        }catch(error){
            console.error("Error al escribir: ", error);
            return false;
        }
    }


    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Publication[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Publications'));
            let data: Publication[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({id: doc.id, ...doc.data()} as unknown as Publication);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen publicaciones');
          }
    }

    //--------------------------- GET ONE PUBLICATION---------------------------------------------------------
    async get(pId: string): Promise<Publication> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Publications', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as Publication;
          
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
    async update(pObj: Publication): Promise<boolean> {
        try {
            const docRef = doc(db, 'Publications', pObj.id.toString());
            await updateDoc(docRef, {
                name: pObj.name,
                description: pObj.description,
                imagePath: pObj.imagePath,
                category: pObj.category,
                subCategory: pObj.subCategory,
                date: pObj.date,
                tags: pObj.tags,
                imageURL: pObj.imageURL
            });
            return true;

        } catch (error) {
            return false;
        }
    }


    //--------------------------- DELETE ---------------------------------------------------------
    async delete(pId: string): Promise<boolean> {
        try {
            const publication = await this.get(pId);
            await deleteDoc(doc(db, 'Publications', pId));
            ProductDAOImpl.getInstance().deleteImage(publication.imagePath);
            return true;
        } catch (error) {
            return false;
        }
    }

}



