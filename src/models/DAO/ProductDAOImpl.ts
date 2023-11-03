import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Product } from '../Product';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export class ProductDAOImpl implements CrudDAO{
    private static instance: ProductDAOImpl;

    //Constructor
    private constructor(){
        //Default
    }

    //Getter
    public static getInstanceProduct(): ProductDAOImpl {
        if (!ProductDAOImpl.instance) {
            ProductDAOImpl.instance = new ProductDAOImpl();
        }
        return ProductDAOImpl.instance;
    }

    //Methods

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Product): Promise<void> {
        try{ 
            let urlImage = await this.uploadImage(pObj.getImage(), `Products/${pObj.getId()}`); // Upload image to Firebase Storage y get URL
            const docRef = await addDoc(collection(db, "Products"), {
                id: pObj.getId(), 
                name: pObj.getName(), 
                description: pObj.getDescription(),
                price: pObj.getPrice(),
                available: pObj.getAvailable(),
                image: pObj.getImage(),
                imagePath: urlImage
            });
            console.log("Agregó con éxito");
        }catch(error){
            console.error("Error al escribir: ", error);
        }
    }

    
    async uploadImage(pImagen: Blob, pPath: string): Promise<string> {
        const storage = getStorage();         //Get a reference to the Firebase storage service
        const imagenRef = ref(storage, pPath);  //Create a reference to the location where you want to save the image
        await uploadBytes(imagenRef, pImagen);  //Upload the image to Firebase Storage
        const url = await getDownloadURL(imagenRef); //Get image download URL
        return url;
    }


    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Product[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Products'));
            let data: Product[] = [];
  
            querySnapshot.forEach((doc) => {
              // Add objects
              data.push({id: doc.id, ...doc.data()} as unknown as Product);
            });
  
            //Return object array
            return data;
  
          } catch (error) {
            throw new Error('Por el momento, no existen productos');
          }
    }

    //--------------------------- GET ONE Product---------------------------------------------------------
    async get(pId: string): Promise<Product> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Products', pId));
          
            if (docSnapshot.exists()) {
              // Get data
              let data = {id: docSnapshot.id, ...docSnapshot.data()} as unknown as Product;
          
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
    async update(obj: Product): Promise<void> {
        //falta code
    }


    //--------------------------- DELETE ---------------------------------------------------------
    async delete(obj: Product): Promise<void> {
        //falta code
    }

}
