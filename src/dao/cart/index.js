import { CartsFs } from "./cart.fs";
import { cartMongoose } from "./cart.mogoose";

let cartDAO;

const DAO_OPTION = process.env.DAO_OPTION;

switch (DAO_OPTION) {
    case 'mongoose':
        cartDAO = new cartMongoose();
        break;
    case 'fs':
        cartDAO = new CartsFs();
        break;
    default:
        cartDAO = new cartMongoose();
}
export {cartDAO};