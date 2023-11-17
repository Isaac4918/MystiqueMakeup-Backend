import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from './CrudDAO';
import { Product } from './Interfaces';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

export class ProductDAOImpl implements CrudDAO {
    private static instance: ProductDAOImpl;

    //Constructor
    private constructor() {
        //Default
    }

    //Getter
    public static getInstance(): ProductDAOImpl {
        if (!ProductDAOImpl.instance) {
            ProductDAOImpl.instance = new ProductDAOImpl();
        }
        return ProductDAOImpl.instance;
    }

    //Methods
    //getId

    async getId(): Promise<number> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Identificators'));
            let currentId = 0;

            querySnapshot.forEach((doc) => {
                if (doc.id == "ProductID") {
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
            const docRef = doc(db, 'Identificators', 'ProductID');
            await updateDoc(docRef, {
                Id: pId
            });
            return true;

        } catch (error) {
            return false;
        }
    }


    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Product): Promise<boolean> {
        try {
            await setDoc(doc(db, "Products", pObj.id.toString()), pObj);
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

    // --------------------------- UPLOAD IMAGE ---------------------------------------------------------

    // function that uploads an image to Firebase Storage
    async uploadImage(pImageBuffer: Buffer, pImageType: string, pPath: string): Promise<string> {
        try {
            const storage = getStorage();
            const imagenRef = ref(storage, pPath);

            const metadata = {
                contentType: pImageType
            };
            await uploadBytes(imagenRef, pImageBuffer, metadata);  //Upload the image to Firebase Storage
            const url = await getDownloadURL(imagenRef); 
            return url;
        } catch (error) {
            console.error("Error al subir la imagen: ", error);
            return "";
        }
    }

    // --------------------------- DELETE IMAGE ---------------------------------------------------------

    // function that deletes an image from Firebase Storage
    async deleteImage(pPath: string): Promise<boolean> {
        try {
            const storage = getStorage();
            const imagenRef = ref(storage, pPath);
            await deleteObject(imagenRef); //Delete the image from Firebase Storage
            return true;
        } catch (error) {
            console.error("Error al eliminar la imagen: ", error);
            return false;
        }
    }


    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Product[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Products'));
            let data: Product[] = [];

            querySnapshot.forEach((doc) => {
                // Add objects
                data.push({ id: doc.id, ...doc.data() } as unknown as Product);
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
                let data = { id: docSnapshot.id, ...docSnapshot.data() } as unknown as Product;

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
    async update(pObj: Product): Promise<boolean> {
        try {
            const docRef = doc(db, 'Products', pObj.id.toString());
            await updateDoc(docRef, {
                name: pObj.name,
                description: pObj.description,
                imagePath: pObj.imagePath,
                category: pObj.category,
                subCategory: pObj.subCategory,
                price: pObj.price,
                available: pObj.available.toString(),
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
            const product = await this.get(pId);
            await deleteDoc(doc(db, 'Products', pId));
            this.deleteImage(product.imagePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    //--------------------------- GET AVAILABILITY OF A PRODUCT----------------------------------

    async getAvailability(pId: string): Promise<number> {
        try {
            let product = await this.get(pId);
            return product.available;
        } catch (error) {
            throw new Error('Error al obtener el documento');
        }
    }

    //--------------------------- REDUCE AVAILABILITY OF A PRODUCT----------------------------------

    async reduceAvailability(pId: string, pQuantity: number): Promise<boolean> {
        try {
            let product = await this.get(pId);
            let alternateProduct = {
                id: product.id,
                name: product.name,
                description: product.description,
                imagePath: product.imagePath,
                category: product.category,
                subCategory: product.subCategory,
                price: product.price,
                available: product.available - pQuantity,
                imageURL: product.imageURL
            }
            if(product.available > pQuantity){
                await this.update(alternateProduct);
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
