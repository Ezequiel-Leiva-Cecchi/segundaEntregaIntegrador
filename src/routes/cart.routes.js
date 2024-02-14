import { Router } from "express";
import {getCart, getCartProducts, addCart, addProductInCart, deleteProductFromCart, deleteCart, updateCart} from '../controllers/cart.controller.js';

const cartRouter = Router();

cartRouter.get('/', getCart);
cartRouter.get('/:cid', getCartProducts);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/p/:pid', addProductInCart);
cartRouter.put('/:cid', updateCart);
cartRouter.delete('/:cid/p/:pid', deleteProductFromCart);
cartRouter.delete('/:cid', deleteCart);
cartRouter.put('/:cid/p/pid', updateCart);

export default cartRouter;