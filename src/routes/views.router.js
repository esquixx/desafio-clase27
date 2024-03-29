import appRouter from './router.js'
import {
    getProductsViewsController,
    getRealTimeProductsController,
    getChatController,
    getProductsByIdViewController,
    getCartViewController
} from '../controllers/view.controller.js'

export default class ViewsProductsRouter extends appRouter {
    init() {
        this.get('/', ['USER', 'ADMIN'], getProductsViewsController)

        this.get('/realTimeProducts', ['ADMIN'], getRealTimeProductsController)

        this.get('/chat', ['USER', 'ADMIN'], getChatController)

        this.get('/product/:pid', ['USER', 'ADMIN'], getProductsByIdViewController)

        this.get('/carts/:cid', ['USER', 'ADMIN'], getCartViewController)
    }
}