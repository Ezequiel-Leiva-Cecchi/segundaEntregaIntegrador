import { productModel } from "../../models/porducts.model.js";

export class productMongoose {
    async getProducts() {
        return await productModel.find().lean({ virtuals: true });
    }
    async getPaginatedProducts(query, paginationOptions) {
        const products = await productModel.paginate(
            { title: { $regex: query ? query : '', $options: 'i' } },
            { ...paginationOptions, lean: true }
        );

        const totalPages = Math.ceil(products.total / paginationOptions.limit);

        const currentPage = paginationOptions.page || 1;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        return {
            products: products.docs,
            currentPage,
            prevPage,
            nextPage,
            totalPages
        };
    }

    async getProductsById(id) {
        return await productModel.findById(id).lean({ virtuals: true });
    }
    async getProductsByIds(products) {
        const groupProducts = await productModel.find({ _id: { $in: products } }).lean({ virtuals: true });
        return groupProducts;
    }
    async addProduct(Object) {
        const newProduct = new productModel(Object);
        await newProduct.save();
    }
    async editProduct({ id, Object }) {
        return await productModel.findOneAndUpdate({ _id: id }, Object);
    }
    async deleteProduct(id) {
        return await productModel.findOneAndDelete({ _id: id });
    }
}