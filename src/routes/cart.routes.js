import { Router } from "express";
import {getCart, getCartProducts, addCart, addProductInCart, deleteProductFromCart, deleteCart, updateCart} from '../controllers/cart.controller.js';

const router = Router();

router.get('/', getCart);
router.get('/:cid', getCartProducts);
router.post('/', addCart);
router.post('/:cid/p/:pid', addProductInCart);
router.put('/:cid', updateCart);
router.delete('/:cid/p/:pid', deleteProductFromCart);
router.delete('/:cid', deleteCart);
router.put('/:cid/p/pid', updateCart);

export default router;