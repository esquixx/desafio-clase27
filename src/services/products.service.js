import productModel from '../dao/models/product.model.js'

export const getProductsService = async (req) => {
    const { 
        limit = 10, 
        page = 1, 
        sort = '', 
        category = '', 
        stock: availability = '' 
    } = req.query

    const filter = category ? { category } : {}
    if (availability) {
        filter.stock = parseInt(availability)
    }

    const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}

    const options = { 
        limit: parseInt(limit), 
        page: parseInt(page), 
        sort: sortOptions, 
        lean: true 
    }

    const result = await productModel.paginate(filter, options)

    const { 
        totalPages, 
        prevPage, 
        nextPage, 
        hasPrevPage, 
        hasNextPage 
    } = result
    
    const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null
    const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null

    return {
        payload: result.docs,
        limit: result.limit,
        totalPages,
        prevPage,
        nextPage,
        currentPage: result.page,   // Cambié nombre variable para evitar conflictos
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
    }
}

export const getProductsByIdService = async (req) => {
    const pid = req.params.pid
    const product = await productModel.findById(pid).lean().exec()

    return product ? product : { status: 'error', message: 'The product does not exist' }
}

export const addProductsService = async (req) => {
    if (!req.file) console.log('No image')
    
    if (!req.body) return { status: 'error', message: 'Product cannot be created without properties' }

    let product = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        thumbnails: [req?.file?.originalname] || [],
        code: req.body.code,
        category: req.body.category,
        stock: parseInt(req.body.stock),
    }

    const addProduct = await productModel.create(product)

    const products = await productModel.find().lean().exec()
    req.app.get('socketio').emit('updatedProducts', products)

    return addProduct
}

const getUpdatedProducts = async () => {
    return await productModel.find()
}

export const updateProductsService = async (req) => {
    const pid = req.params.pid

    if (req.body._id === pid) return { status: 'error', message: 'Cannot modify product id' }

    const updated = req.body
    const productFind = await productModel.findById(pid)

    if (!productFind) return { status: 'error', message: 'The product does not exist' }

    await productModel.updateOne({ _id: pid }, updated)
    const updatedProducts = await getUpdatedProducts()

    req.app.get('socketio').emit('updatedProducts', updatedProducts)

    const result = await productModel.findById(pid)
    return result
}

export const deleteProductsService = async (req) => {
    const pid = req.params.pid
    const result = await productModel.findByIdAndDelete(pid)

    if (!result) return { status: 'error', message: `No such product with id: ${pid}` }

    const updatedProducts = await getUpdatedProducts()
    req.app.get('socketio').emit('updatedProducts', updatedProducts)

    return updatedProducts
}



/*
export const getProductsService = async (req) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const sort = req.query.sort || ''
    const category = req.query.category || ''
    const availability = parseInt(req.query.stock) || ''

    let filter = {}
    if (req.query.category) {
        filter = { category }
    }
    if (req.query.stock) {
        filter = { ...filter, stock: availability }
    }
    let sortOptions = {}
    if (sort === 'asc') {
        sortOptions = { price: 1 }
    } else if (sort === 'desc') {
        sortOptions = { price: -1 }
    }
    const options = {
        limit,
        page,
        sort: sortOptions,
        lean: true
    }
    const result = await productModel.paginate(filter, options)
    const totalPages = result.totalPages
    const prevPage = result.prevPage
    const nextPage = result.nextPage
    const currentPage = result.page
    const hasPrevPage = result.hasPrevPage
    const hasNextPage = result.hasNextPage
    const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null
    const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null

    return {
        payload: result.docs,
        limit: result.limit,
        totalPages,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
    }
}

export const getProductsByIdService = async (req) => {
    const pid = req.params.pid 
    const product = await productModel.findById(pid).lean().exec()
    if (product === null) {
        return { status: 'error', message: `The product doesn't exist` }
    }
    return product
}

export const addProductsService = async (req) => {
    if (!req.file) {
        console.log('No image')
    }
    if (!req.body) {
        return { status: 'error', message: 'Product no can be created without properties' }
    }
    let product = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        thumbnails: [req?.file?.originalname] || [],
        code: req.body.code,
        category: req.body.category,
        stock: parseInt(req.body.stock)
    }
    const addProduct = await productModel.create(product)
    const products = await productModel.find().lean().exec()
    req.app.get('socketio').emit('updatedProducts', products)
    return addProduct
}

export const updateProductsService = async (req) => {
    const pid = req.params.pid 
    if (req.body._id === pid) {
        return { status: 'error', message: 'Cannot modify product id' }
    }

    const updated = req.body 
    const productFind = await productModel.findById(pid)
    if (!productFind) {
        return { status: 'error', message: `The product doesn't exist` }
    }
    await productModel.updateOne({ _id: pid }, updated)
    const updatedProducts = await productModel.find()

    req.app.get('socketio').emit('updatedProducts', updatedProducts)
    const result = await productModel.findById(pid)
    return result
}

export const deleteProductsService = async (req) => {
    const pid = req.params.pid 
    const result = await productModel.findByIdAndDelete(pid)
    if (result === null) {
        return { status: 'error', message: `No such product with id: ${pid}` }
    }

    const updatedProducts = await productModel.find().lean().exec()
    req.app.get('socketio').emit('updatedProducts', updatedProducts)
    return updatedProducts
} */