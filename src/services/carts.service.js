import productModel from '../dao/models/product.model.js'
import cartModel from '../dao/models/cart.model.js'

const handleServiceError = message => ({ status: 'error', message })

export const addCartService = async ({ body }) => {
    try {
        const addCart = await cartModel.create(body)
        return addCart
    } catch (error) {
        return handleServiceError('Error creating cart')
    }
}

export const addProductToCartService = async ({ params }) => {
    try {
        const { pid, cid } = params
        const product = await productModel.findById(pid)
        const cart = await cartModel.findById(cid)
    
        if (!product) return handleServiceError('Invalid product')
        if (!cart) return handleServiceError('Invalid cart')
    
        const existingProduct = cart.products.findIndex((item) => item.product.equals(pid))
        if (existingProduct !== -1) {
            cart.products[existingProduct].quantity += 1
        } else {
            const newProduct = { product: pid, quantity: 1 }
            cart.products.push(newProduct)
        }
    
        const result = await cart.save()
        return result
    } catch (error) {
        return handleServiceError('Error adding product to cart')
    }
}

export const getCartService = async ({ params }) => {
    try {
        const { cid } = params
        const cart = await cartModel.findById(cid).lean().exec()
    
        if (!cart) return handleServiceError(`The cart with id ${cid} doesn't exist`)
        return cart
    } catch (error) {
        return handleServiceError('Error getting cart')
    }
}

export const updateProductToCartService = async ({ params, body }) => {
    try {
        const { cid, pid } = params
        const { quantity } = body
    
        const cart = await cartModel.findById(cid)
    
        if (!cart) return handleServiceError('Invalid cart')
    
        const existingProduct = cart.products.findIndex((item) => item.product.equals(pid))
        if (existingProduct === -1) return handleServiceError('Invalid product')
    
        if (!Number.isInteger(quantity) || quantity < 0) {
            return handleServiceError('Quantity must be a positive integer')
        }
    
        cart.products[existingProduct].quantity = quantity;
        await cart.save()
        return { status: 'success', message: 'Product quantity updated successfully' }
    } catch (error) {
        return handleServiceError('Error updating product quantity')
    }
}

export const updatedCartService = async ({ params, body }) => {
    try {
        const { cid } = params
        const { products } = body
    
        const cart = await cartModel.findById(cid)
        if (!cart) return handleServiceError('Invalid cart')
    
        if (!Array.isArray(products)) {
            return handleServiceError('The product array format is invalid')
        }
    
        cart.products = products
        const result = await cart.save()
    
        const response = {
            result,
            totalPages: 1,
            prevPage: null,
            nextPage: null,
            page: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: null,
            nextLink: null,
        }
    
        return response
    } catch (error) {
        return handleServiceError('Error updating cart')
    }
}

export const deleteCartService = async ({ params }) => {
    try {
        const { cid } = params
        const cart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true }).lean().exec()
        
        if (!cart) return handleServiceError('Invalid cart')
        return cart
    } catch (error) {
        return handleServiceError('Error deleting cart')
    }
}

export const deleteProductInCartService = async ({ params }) => {
    try {
        const { cid, pid } = params
        const cart = await cartModel.findById(cid)
    
        if (!cart) return handleServiceError('Invalid cart')
    
        const existingProduct = cart.products.findIndex((item) => item.product.equals(pid))
        if (existingProduct === -1) return handleServiceError('Invalid product')
    
        cart.products.splice(existingProduct, 1)
        const result = await cart.save()
        return result
    } catch (error) {
        return handleServiceError('Error deleting product from cart')
    }
}



/* 
export const addCartService = async (req) => {
    const cart = req.body 
    const addCart = await cartModel.create(cart)
    return addCart
}

export const addProductToCartService = async (req) => {
    const pid = req.params.pid 
    const product = await productModel.findById(pid)
    if (!product) {
        return { status: 'error', message: 'Invalid product' }
    }

    const cid = req.params.cid 
    const cart = await cartModel.findById(cid)
    if (!cart){
        return { status: 'error', message: 'Invalid cart' }
    }

    const existingProduct = cart.products.findIndex( item => item.product.equals(pid))
    if (existingProduct !== -1) {
        cart.products[existingProduct].quantity += 1
    } else {
        const newProduct = {
            product: pid,
            quantity: 1
        }
        cart.products.push(newProduct)
    }
    const result = await cart.save()
    return result
}

export const getCartService = async (req) => {
    const cid = req.params.cid 
    const cart = await cartModel.findById(cid).lean().exec()
    if (!cart) return { status: 'error', message: `The cart with id ${cid} doesn't exist` }
    return cart
}

export const updateProductToCartService = async (req) => {
    const cid = req.params.cid 
    const cart = await cartModel.findById(cid)
    if (!cart){
        return { status: 'error', message: 'Invalid cart' }
    }

    const pid = req.params.pid
    const existingProduct = cart.products.findIndex( item => item.product.equals(pid))
    if (existingProduct === -1) {
        return { status: 'error', message: 'Invalid product' }
    }

    const quantity = req.body.quantity 
    if (!Number.isInteger(quantity) || quantity < 0) {
        return { status: 'error', message: 'Quantity must be a positive integer' }
    }
    cart.products[existingProduct].quantity = quantity
    await cart.save()
    return { status: 'success', message: 'Product quantity updated successfully' }
}

export const updatedCartService = async (req) => {
    const cid = req.params.cid 
    const cart = await cartModel.findById(cid)
    if (!cart){
        return { status: 'error', message: 'Invalid cart' }
    }

    const products = req.body.products 
    if (!Array.isArray(products)) {
        return { status: 'error', message: 'The product array format is invalid' }
    }
    cart.products = products 
    const result = await cart.save()
    const totalPages = 1
    const prevPage = null
    const nextPage = null
    const page = 1
    const hasPrevPage = false
    const hasNextPage = false
    const prevLink = null 
    const nextLink = null 

    return {
        result,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
    }
}

export const deleteCartService = async (req) => {
    const cid = req.params.cid 
    const cart = await cartModel
        .findByIdAndUpdate(cid, { products: [] }, { new: true })
        .lean()
        .exec()
    if (!cart) return { status: 'error', message: 'Invalid cart' }
    return cart
}

export const deleteProductInCartService = async (req) => {
    const cid = req.params.cid 
    const cart = await cartModel.findById(cid)
    if (!cart){
        return { status: 'error', message: 'Invalid cart' }
    }

    const pid = req.params.pid
    const existingProduct = cart.products.findIndex( item => item.product.equals(pid))
    if (existingProduct === -1) {
        return { status: 'error', message: 'Invalid product' }
    }

    cart.products.splice(existingProduct, 1)
    const result = await cart.save()
    return result 
}
 */


