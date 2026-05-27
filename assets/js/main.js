document.addEventListener("DOMContentLoaded", () => {

    const contenedorProductos = document.getElementById("productos");
    const contenedorCarrito = document.getElementById("tarjetas-carrito");

    const ruta = window.location.pathname;
    let categoriaActual = "";

    if (ruta.includes("categoria-pcs")) {
        categoriaActual = "pcs";

    } else if (ruta.includes("categoria-laptops")) {
        categoriaActual = "laptops";

    } else if (ruta.includes("accesorios")) {
        categoriaActual = "accesorios";
    }

    // =========================
    // PRODUCTOS
    // =========================
    if (contenedorProductos) {

        const modal = new bootstrap.Modal(
            document.getElementById("modalProducto")
        );

        const modalConfirmacion = new bootstrap.Modal(
            document.getElementById("modalConfirmacion")
        );

        let productosGlobal = [];
        let productoActual = null;

        fetch("../assets/js/productos.json")

            .then(respuesta => respuesta.json())

            .then(productos => {

                productosGlobal = productos;

                const filtrados = categoriaActual
                    ? productos.filter(p => p.categoria === categoriaActual)
                    : productos;

                contenedorProductos.innerHTML = "";

                filtrados.forEach(p => {

                    const card = document.createElement("div");

                    card.className = "col-md-4";

                    card.innerHTML = `
                        <div class="card shadow-sm rounded-4 border-0 h-100">

                            <img 
                                src="${p.imagen}" 
                                class="card-img-top p-3 imagen-producto"
                            >

                            <div class="card-body text-center">

                                <h5 class="fw-bold">
                                    ${p.nombre}
                                </h5>

                                <p class="text-muted">
                                    ${p.descripcion}
                                </p>

                                <h4 class="text-primary">
                                    ₡${p.precio}
                                </h4>

                                <button 
                                    class="btn btn-outline-primary w-100 mt-2 btnDetalles"
                                    data-id="${p.id}"
                                >
                                    Ver detalles
                                </button>

                            </div>

                        </div>
                    `;

                    contenedorProductos.appendChild(card);

                });

            })

            .catch(() => {

                contenedorProductos.innerHTML = `
                    <p class="text-danger text-center">
                        Error cargando productos
                    </p>
                `;

            });

        // =========================
        // MODAL DETALLES
        // =========================
        document.addEventListener("click", e => {

            if (e.target.classList.contains("btnDetalles")) {

                const id = e.target.dataset.id;

                productoActual = productosGlobal.find(
                    p => p.id == id
                );

                if (!productoActual) return;

                document.getElementById("modalTitulo").textContent =
                    productoActual.nombre;

                document.getElementById("modalDescripcion").textContent =
                    productoActual.descripcion;

                document.getElementById("modalPrecio").textContent =
                    "₡" + productoActual.precio;

                document.getElementById("modalImagen").src =
                    productoActual.imagen;

                modal.show();
            }

        });

        // =========================
        // AGREGAR AL CARRITO
        // =========================
        const btnAgregar = document.getElementById("btnAgregarModal");

        if (btnAgregar) {

            btnAgregar.addEventListener("click", () => {

                if (!productoActual) return;

                let carrito = JSON.parse(
                    localStorage.getItem("carrito")
                ) || [];

                let item = carrito.find(
                    p => p.id === productoActual.id
                );

                if (item) {

                    item.cantidad += 1;

                } else {

                    carrito.push({
                        ...productoActual,
                        cantidad: 1
                    });

                }

                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );

                modal.hide();

                modalConfirmacion.show();

            });

        }

        // =========================
        // SEGUIR COMPRANDO
        // =========================
        const btnSeguir = document.getElementById("seguirComprando");

        if (btnSeguir) {

            btnSeguir.addEventListener("click", () => {

                modalConfirmacion.hide();

            });

        }

    }

    // =========================
    // CARRITO
    // =========================
    if (contenedorCarrito) {

        const totalHTML = document.getElementById("total");

        const vacio = document.getElementById("carrito-vacio");

        let carrito = JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

        let total = 0;

        if (carrito.length === 0) {

            vacio.classList.remove("d-none");

            return;
        }

        contenedorCarrito.innerHTML = "";

        carrito.forEach((p, index) => {

            total += p.precio * p.cantidad;

            contenedorCarrito.innerHTML += `
                <div class="card mb-3 p-3 shadow-sm rounded-4 border-0">

                    <div class="d-flex justify-content-between align-items-center">

                        <div class="d-flex align-items-center gap-3">

                            <img src="${p.imagen}" width="80">

                            <div>

                                <h5>${p.nombre}</h5>

                                <p class="text-muted mb-0">
                                    ₡${p.precio}
                                </p>

                                <small>
                                    Cantidad: ${p.cantidad}
                                </small>

                            </div>

                        </div>

                        <button 
                            class="btn btn-danger btn-sm px-3"
                            onclick="eliminar(${index})"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>
            `;

        });

        totalHTML.textContent = "₡" + total;

    }

    // =========================
    // FACTURA
    // =========================
    const formPago = document.getElementById("form-pago");

    if (formPago) {

        formPago.addEventListener("submit", e => {

            e.preventDefault();

            const nombre = document.getElementById("card-name").value;

            const fecha = new Date().toLocaleDateString();

            let carrito = JSON.parse(
                localStorage.getItem("carrito")
            ) || [];

            const factura = document.getElementById("factura");

            const nombreFactura =
                document.getElementById("factura-nombre");

            const fechaFactura =
                document.getElementById("factura-fecha");

            const productosFactura =
                document.getElementById("factura-productos");

            const totalFactura =
                document.getElementById("factura-total");

            productosFactura.innerHTML = "";

            let total = 0;

            carrito.forEach(p => {

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>₡${p.precio}</td>
                `;

                productosFactura.appendChild(fila);

                total += p.precio * p.cantidad;

            });

            nombreFactura.textContent = nombre;

            fechaFactura.textContent = fecha;

            totalFactura.textContent = total;

            // MOSTRAR FACTURA
            factura.classList.remove("d-none");

            // OCULTAR MAIN
            document.querySelector("main")
                .classList.add("d-none");

            // CERRAR MODAL
            const modalPago = bootstrap.Modal.getInstance(
                document.getElementById("paymentModal")
            );

            modalPago.hide();

            // BORRAR CARRITO
            localStorage.removeItem("carrito");

        });

    }

});

// =========================
// ELIMINAR PRODUCTO
// =========================
function eliminar(index) {

    let carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    carrito.splice(index, 1);

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    location.reload();

}

// =========================
// VACIAR CARRITO
// =========================
function vaciarCarrito() {

    localStorage.removeItem("carrito");

    location.reload();

}
