const socket = io()

const form = document.getElementById('form')
const productsTable = document.querySelector('#productsTable')
const tbody = productsTable.querySelector('#tbody')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Obtener los datos del formulario
    const formData = new FormData(form)
    const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
    })

    try {
        if (!res.ok) {
            throw new Error(result.error)
        } else {
            console.log(res)
            // Obtener la lista actualizada de productos desde el servidor
            const resultProducts = await fetch('/api/products?limit=100')
            const results = await resultProducts.json()
            if (results.status === 'error') {
                throw new Error(results.error)
            } else {
                // Emitir el evento 'productList' con la lista de productos actualizada
                socket.emit('productList', results.payload.payload)

                // Mostrar notificación de éxito
                Toastify({
                    text: 'Producto agregado exitosamente',
                    duration: 2000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'right',
                    stopOnFocus: true,
                    style: {
                        background: "#7dd56f",
                        borderRadius: "10px",
                        fontWeight: "600",
                    },
                    onClick: function(){}
                }).showToast()

                // Restablecer los campos del formulario
                form.reset()
            }
        }
    } catch (error) {
        console.log(error)
    }
})

// Función para eliminar un producto
const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
        const result = await res.json()
        if (result.status === 'error') throw new Error(result.error)
        else socket.emit('productList', result.payload)

        // Mostrar notificación de éxito
        Toastify({
            text: 'Producto eliminado exitosamente',
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: 'bottom',
            position: 'right',
            stopOnFocus: true,
            style: {
                background: "#E93C3C",
                borderRadius: "10px",
                fontWeight: "600",
            },
            onClick: function(){}
        }).showToast()
    } catch (error) {
        console.log(error)
    }
}

// Escuchar el evento 'updatedProducts' emitido por el servidor
socket.on('updatedProducts', (products) => {
    // Limpiar el contenido de tbody
    tbody.innerHTML = ''

    // console.log(products)
    // Agregar los nuevos productos a tbody
    products.forEach( (item) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct('${item._id}')" id="btnDelete">Eliminar</button>
            </td>
        `
        tbody.appendChild(tr)
    })
})



