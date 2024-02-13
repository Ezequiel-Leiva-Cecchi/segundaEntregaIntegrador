import { validateAddProducts, validateEditProducts } from "../utils/validation.js"
import { productDAO } from "../dao/product/index.js";

export const getProducts = async (req, res, next) => {
    try {
        const { limit, sort, page, query } = req.query;
        const Options = {
            limit: !limit ? 10 : limit,
            sort: sort ? { price: sort } : undefined,
            page: page ? page : 1,
        };
        const products = await productDAO.getPaginatedProducts(
            query,
            Options
        );
        res.json({ status: 'success', ...products });
    } catch (error) {
        res.json({ error: error.message });
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productDAO.getProductById(productId);
        if (!product) {
            throw new Error('PRODUCT NOT FOUND');
        }
        res.json({ product });
    } catch (error) {
        res.json({ error: error.message });
    }
};

export const addProduct = async (req, res, next) => {
    const { body } = req;
    try {
        const AbsentProperty = validateAddProducts(body);
        if (AbsentProperty) {
            throw new Error(`Absent property ${AbsentProperty}`);
        }
        await productDAO.addProduct(body);
        res.json({ message: 'Successfully' });
    } catch (error) {
        res.json({ error: error.message });
    }
};
export const editProduct = async (req, res, next) => {
    try {
        const { body, params } = req;
        const { productId } = params;
        const validation = validateEditProducts(body);
        if (Object.keys(validation).length === 0) {
            throw new Error('At least one of the following properties is required:name, price, stock, category, description, code');
        }
        const updateProducts = await productDAO.editProduct({ id: productId, obj: validation });
        if (!deletedProduct) {
            throw new Error('PRODUCT NOT FOUND');
        }
        res.json({ message: 'Successfully edit product' });
    } catch (error) {
        res.json({ error: error.message });
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const deleteProduct = await productDAO.deleteProduct(productId);
        if (!deleteProduct) {
            throw new Error('PRODUCT NOT FOUND');
        }
        res.json({ message: 'Successfully delete product' });
    } catch (error) {
        res.json({ error: error.message });
    }
}