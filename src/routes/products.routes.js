import e, {Router} from 'express';
import{getProducts, getProduct, addProduct, editProduct, deleteProduct} from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:pid',getProduct);
productRouter.post('/',addProduct);
productRouter.put('/:pid', editProduct);
productRouter.delete('/:pid', deleteProduct);

export default productRouter;