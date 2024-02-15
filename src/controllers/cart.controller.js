import { cartDAO } from "../dao/cart/index.js"; 

// Controlador para obtener todos los carritos
export const getCart = async (req, res, next) => {
    try {
        const carts = await cartDAO.getCarts(); // Obtiene todos los carritos utilizando el DAO
        res.json({ carts }); 
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para obtener los productos de un carrito por su ID
export const getCartProducts = async (req, res, next) => {
    try {
        const { cartId } = req.params; // Obtiene el ID del carrito de los parámetros de la solicitud
        const cart = await cartDAO.getCartById(cartId); // Obtiene el carrito por su ID utilizando el DAO
        if (!cart) {
            throw new Error('CART NOT FOUND'); 
        }
        res.json({ cartProduct: cart.products }); 
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para agregar un nuevo carrito
export const addCart = async (req, res, next) => {
    try {
        await cartDAO.addCart(); // Agrega un nuevo carrito utilizando el DAO
        res.json({ message: 'Successfully add cart' }); 
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para agregar un producto a un carrito
export const addProductInCart = async (req, res, next) => {
    try {
        const { productId, cartId } = req.params; // Obtiene los IDs del producto y del carrito de los parámetros de la solicitud
        await cartDAO.deleteProductCart({ productId, cartId }); 
        res.json({ message: 'Successfully add product in cart' }); 
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para eliminar un producto de un carrito
export const deleteProductFromCart = async (req, res, next) => {
    try {
        const { productId, cartId } = req.params; // Obtiene los IDs del producto y del carrito de los parámetros de la solicitud
        await cartDAO.deleteProductFromCart({ productId, cartId }); // Elimina un producto del carrito utilizando el DAO
        res.json({ message: 'Successfully delete product' }); 
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para eliminar un carrito por su ID
export const deleteCart = async(req, res, next) => {
    try {
        const { cartId } = req.params; // Obtiene el ID del carrito de los parámetros de la solicitud
        const deleteCart = await cartDAO.deleteCart(cartId); // Elimina el carrito por su ID utilizando el DAO
        if (!deleteCart) {
            throw new Error('CART NOT FOUND'); 
        }
        res.json({ message: 'Successfully delete cart' }); // Envía un mensaje de éxito en formato JSON
    } catch (error) {
        res.json({ error: error.message }); 
    }
};

// Controlador para actualizar un carrito
export const updateCart = async (req, res, next) => {
    try {
        const { cartId } = req.params; // Obtiene el ID del carrito de los parámetros de la solicitud
        await cartDAO.updateCart({ cartId, updateProduct: req.body }); // Actualiza el carrito utilizando el DAO
    } catch (error) {
        res.json({ error: error.message }); 
    }
};
