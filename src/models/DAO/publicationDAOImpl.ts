import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Publication } from '../Publication';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Publication): Promise<void> {
        try{ 
            let urlImage = await this.uploadImage(pObj.getImage(), 'Publications/${id}');  // Upload image to Firebase Storage y get URL
            const docRef = await addDoc(collection(db, "Publications"), {
                id: pObj.getId, 
                image: pObj.getImage,
                imagePath: urlImage,
                name: pObj.getName,
                date: pObj.getDate,
                keyWords: pObj.getKeyWords
            });
            console.log("Agregó con éxito");
        }catch(error){
            console.error("Error al escribir: ", error);
        }
    }

    
    async  uploadImage(pImagen: Blob, pPath: string): Promise<string> {
        const storage = getStorage();         //Get a reference to the Firebase storage service
        const imagenRef = ref(storage, pPath);  //Create a reference to the location where you want to save the image
        await uploadBytes(imagenRef, pImagen);  //Upload the image to Firebase Storage
        const url = await getDownloadURL(imagenRef); //Get image download URL
        return url;
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
    async update(obj: Object): Promise<void> {
        //falta code
    }


    //--------------------------- DELETE ---------------------------------------------------------
    async delete(obj: Object): Promise<void> {
        //falta code
    }

}



