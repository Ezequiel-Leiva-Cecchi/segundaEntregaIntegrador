import { productsFs } from "./products.fs.js";
import { productMongoose } from "./products.mongoose.js";

let productDAO;

const DAO_OPTION = process.env.DAO_OPTION;

switch (DAO_OPTION) {
  case 'mongoose':
    productDAO = new productMongoose();
    break;
  case 'fs':
    productDAO = new productsFs();
    break;
  default:
    productDAO = new productMongoose();
}

export {productDAO};