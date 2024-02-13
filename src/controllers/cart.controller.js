import { cartDAO } from "../dao/cart.js";

export const getCart = async (req, res, next) => {
    try {
        const carts = await cartDAO.getCarts();
        res.json({ carts });
    } catch (error) {
        res.json({ error: error.message });
    }
};
export const getCartProducts = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const cart = await cartDAO.getCartById(cartId);
        if (!cart) {
            throw new Error('CART NOT FOUND');
        }
        res.json({ cartProduct: cart.products });
    } catch (error) {
        res.json({ error: error.message });
    }
};
export const addCart = async (req, res, next) => {
    try {
        await cartDAO.addCart();
        res.json({ message: 'Successfully add cart' });
    } catch (error) {
        res.json({ error: error.message });
    }
};
export const addProductInCart = async (req, res, next) => {
    try {
        const { productId, cartId } = req.params;
        await cartDAO.deleteProductCart({ productId, cartId });
        res.json({ message: 'Successfully add product in cart' });
    } catch (error) {
        res.json({ error: error.message })
    }
};
export const deleteProductFromCart = async (req, res, next) =>{
    try {
        const { productId, cartId} = req.params;
       await cartDAO.deleteProductFromCart({productId, cartId});
       res.json({message:'Successfully delete product'}); 
    } catch (error) {
        res.json({error:error.message}); 
    }
};
export const deleteCart = async(req, res, next) =>{
    try {
        const{cartId} = req.params;
        const deleteCart = await cartDAO.deleteCart(cartId);
        if(!deleteCart){
            throw new Error('CART NOT FOUND');
        }
        res.json({message:'Successfully delete cart'});
    } catch (error) {
        res.json({error:error.message});
    }
};
export const updateCart = async (req, res, next) => {
    try {
        const {cartId} = req.params;
        await cartDAO.updateCart({cartId, updateProduct:req.body,});
    } catch (error) {
        res.json({error: error.message});
    }
};