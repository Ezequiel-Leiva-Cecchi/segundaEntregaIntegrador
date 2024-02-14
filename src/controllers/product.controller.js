import { validateAddProducts, validateEditProducts } from "../utils/validation.js"; 
import { productDAO } from "../dao/product/index.js"; 

// Controlador para obtener una lista de productos paginados
export const getProducts = async (req, res, next) => {
    try {
        const { limit, sort, page, query } = req.query; 

        // Define las opciones de paginación para la consulta
        const Options = {
            limit: !limit ? 10 : limit, 
            sort: sort ? { price: sort } : undefined, 
            page: page ? page : 1, 
        };

        // Obtiene la lista de productos paginados según los parámetros de consulta utilizando el DAO de productos
        const products = await productDAO.getPaginatedProducts(query, Options);

        // Envía la respuesta JSON con los productos y su estado
        res.json({ status: 'success', ...products });
    } catch (error) {
        // Manejo de errores: envía un mensaje de error en formato JSON
        res.json({ error: error.message });
    }
};

// Controlador para obtener un producto por su ID
export const getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params; 

        // Obtiene el producto por su ID utilizando el DAO de productos
        const product = await productDAO.getProductById(productId);

        // Si no se encuentra el producto, lanza un error
        if (!product) {
            throw new Error('PRODUCT NOT FOUND');
        }

        // Envía el producto encontrado en formato JSON como respuesta
        res.json({ product });
    } catch (error) {
        // Manejo de errores: envía un mensaje de error en formato JSON
        res.json({ error: error.message });
    }
};

// Controlador para agregar un nuevo producto
export const addProduct = async (req, res, next) => {
    const { body } = req; // Obtiene el cuerpo de la solicitud

    try {
        // Valida si hay propiedades faltantes en el objeto del producto
        const AbsentProperty = validateAddProducts(body);

        // Si hay propiedades faltantes, lanza un error
        if (AbsentProperty) {
            throw new Error(`Absent property ${AbsentProperty}`);
        }

        // Agrega el producto utilizando el DAO de productos
        await productDAO.addProduct(body);

        // Envía un mensaje de éxito en formato JSON
        res.json({ message: 'Successfully' });
    } catch (error) {
        // Manejo de errores: envía un mensaje de error en formato JSON
        res.json({ error: error.message });
    }
};

// Controlador para editar un producto existente
export const editProduct = async (req, res, next) => {
    try {
        const { body, params } = req;
        const { productId } = params; 

        // Valida las propiedades del producto a editar
        const validation = validateEditProducts(body);

        // Si no se proporciona ninguna propiedad válida para editar, lanza un error
        if (Object.keys(validation).length === 0) {
            throw new Error('At least one of the following properties is required:name, price, stock, category, description, code');
        }

        // Edita el producto utilizando el DAO de productos
        const updateProducts = await productDAO.editProduct({ id: productId, obj: validation });

        // Si el producto no se encuentra, lanza un error
        if (!updateProducts) {
            throw new Error('PRODUCT NOT FOUND');
        }

        // Envía un mensaje de éxito en formato JSON
        res.json({ message: 'Successfully edit product' });
    } catch (error) {
        // Manejo de errores: envía un mensaje de error en formato JSON
        res.json({ error: error.message });
    }
};

// Controlador para eliminar un producto por su ID
export const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params; 

        // Elimina el producto utilizando el DAO de productos
        const deleteProduct = await productDAO.deleteProduct(productId);

        // Si el producto no se encuentra, lanza un error
        if (!deleteProduct) {
            throw new Error('PRODUCT NOT FOUND');
        }

        // Envía un mensaje de éxito en formato JSON
        res.json({ message: 'Successfully delete product' });
    } catch (error) {
        // Manejo de errores: envía un mensaje de error en formato JSON
        res.json({ error: error.message });
    }
};