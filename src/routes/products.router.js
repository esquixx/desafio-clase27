import appRouter from './router.js'
import { uploader } from '../utils.js'
import {
    getProductsController,
    getProductsByIdController,
    addProductsController,
    updateProductsController,
    deleteProductsController,
} from '../controllers/product.controller.js'

export default class ProductsRouter extends appRouter {
    init() {
        this.get('/', ['USER', 'ADMIN'], getProductsController)

        this.get('/:pid', ['USER', 'ADMIN'], getProductsByIdController)

        this.post('/', ['ADMIN'], uploader.single('file'), addProductsController)

        this.put('/:pid', ['ADMIN'], updateProductsController)

        this.delete('/:pid', ['ADMIN'], deleteProductsController)
    }
}