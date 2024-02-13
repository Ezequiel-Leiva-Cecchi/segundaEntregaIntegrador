import { Promise as fsp } from "fs";

const path = '../../data/products.json';

class Products {
    constructor(id, name, price, stock, category, description, status, code) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.description = description;
        this.status = status;
        this.code = code;
        this.id = id;
    }

}

export class productsFs {
    async readOrInitializeFileData() {
        try {
            const response = await fsp.readFile(path);

            const data = await JSON.parse(response);

            return data;
        } catch (error) {
            await fsp.writeFile(path, JSON.stringify([]));
            return [];
        }
    }
    async getProducts(limit) {
        const products = await this.readOrInitializeFileData();
        if (limit > 0) {
            return products.slice(0, limit);
        } else {
            return products;
        }
    }
    async addProducts(object) {
        const products = await this.readOrInitializeFileData();
        const product = new addedProduct({
            id: products.length + 1,
            ...object
        })
        products.push(product);
        await fsp.writeFile(path, JSON.stringify(products));
    }
    async getProductsById(id){
       const products = await this.readOrInitializeFileData();
       const productsExist = products.find((product) => product.id.toString() === id.toString());
       if(!productsExist){
        throw new Error(`The product no found`);
       }else{
        return productsExist;
       }
    }
    async editProducts(id, object){
        const products = await this.readOrInitializeFileData();
        let productsExist = products.findIndex((product)=> product.id === id);
        if(productsExist < 0){
           return null;
        }
        products[productsExist] = {
            ...products[productsExist],
            ...obj,
          };
          await fsp.writeFile(path, JSON.stringify(products));
          return products[productsExist];
    }
    async deleteProducts(id){
        const products = await this.readOrInitializeFileData();
        const product = products.find((product) => product.id.toString() === id.toString());
        if(!product){
            return null;
        }else{
            const updateProducts = products;
            filter((product)=> product.id !== id);
            Map((product,index)=>{
                return {...product,id:(index + 1).toString()};
            });
            await fsp.writeFile(path, JSON.stringify(updateProducts));
            return product;
        }
    }
}