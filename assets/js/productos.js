// ✅ Arreglo de productos incluido directamente
const productosData = [
    { "id": 1, "nombre": "Manzanas Rojas", "precio": 2.5, "imagen": "/assets/img/frutas_manzanas.jpg", "descripcion": "Manzanas rojas frescas por kilo.", "categoria": "Frutas y Verduras", "marca": "AgroAndes", "stock": 35 ,"vendidos": 150},
    { "id": 2, "nombre": "Plátanos", "precio": 1.8, "imagen": "/assets/img/frutas_platanos.jpg", "descripcion": "Plátanos maduros por kilo.", "categoria": "Frutas y Verduras", "marca": "AgroAndes", "stock": 50 ,"vendidos": 320},
    { "id": 3, "nombre": "Tomates", "precio": 2.2, "imagen": "/assets/img/verduras_tomates.jpg", "descripcion": "Tomates frescos de ensalada por kilo.", "categoria": "Frutas y Verduras", "marca": "CampoVerde", "stock": 28 ,"vendidos": 85},

    { "id": 4, "nombre": "Leche Entera 1L", "precio": 1.2, "imagen": "/assets/img/lacteos_leche.jpg", "descripcion": "Leche entera pasteurizada de 1 litro.", "categoria": "Lácteos", "marca": "Lácteos Andinos", "stock": 60,"vendidos": 280 },
    { "id": 5, "nombre": "Queso Fresco", "precio": 3.5, "imagen": "/assets/img/lacteos_queso.jpg", "descripcion": "Queso fresco tipo panela 500g.", "categoria": "Lácteos", "marca": "Lácteos Andinos", "stock": 22,"vendidos": 95 },
    { "id": 6, "nombre": "Yogur Natural 1L", "precio": 2.8, "imagen": "/assets/img/lacteos_yogur.jpg", "descripcion": "Yogur natural sin azúcar.", "categoria": "Lácteos", "marca": "Lácteos Andinos", "stock": 0,"vendidos": 45 },

    { "id": 7, "nombre": "Pechuga de Pollo", "precio": 5.99, "imagen": "/assets/img/carnes_pollo.jpg", "descripcion": "Pechuga de pollo sin hueso por kilo.", "categoria": "Carnes", "marca": "Carnes Selectas", "stock": 18,"vendidos": 220},
    { "id": 8, "nombre": "Carne Molida de Res", "precio": 7.5, "imagen": "/assets/img/carnes_res.jpg", "descripcion": "Carne molida de res 90/10 por kilo.", "categoria": "Carnes", "marca": "Carnes Selectas", "stock": 26 ,"vendidos": 175},
    { "id": 9, "nombre": "Chuletas de Cerdo", "precio": 6.8, "imagen": "/assets/img/carnes_cerdo.jpg", "descripcion": "Chuletas de cerdo frescas por kilo.", "categoria": "Carnes", "marca": "Carnes Selectas", "stock": 14, "vendidos": 60 },

    { "id": 10, "nombre": "Jugo de Naranja 1L", "precio": 2.4, "imagen": "/assets/img/bebidas_jugo_naranja.jpg", "descripcion": "Jugo natural de naranja sin conservadores.", "categoria": "Bebidas", "marca": "Bebidas del Sol", "stock": 40,"vendidos": 135 },
    { "id": 11, "nombre": "Refresco Cola 2L", "precio": 2.1, "imagen": "/assets/img/bebidas_refresco_cola.jpg", "descripcion": "Refresco sabor cola 2 litros.", "categoria": "Bebidas", "marca": "Burbujas", "stock": 55,"vendidos": 410 },
    { "id": 12, "nombre": "Agua Mineral 1.5L", "precio": 1.5, "imagen": "/assets/img/bebidas_agua_mineral.jpg", "descripcion": "Agua mineral natural con gas.", "categoria": "Bebidas", "marca": "Nevada", "stock": 48 ,"vendidos": 525},

    { "id": 13, "nombre": "Shampoo 400ml", "precio": 4.2, "imagen": "/assets/img/higiene_shampoo.jpg", "descripcion": "Shampoo hidratante para todo tipo de cabello.", "categoria": "Higiene y Limpieza", "marca": "PureCare", "stock": 30,"vendidos": 88 },
    { "id": 14, "nombre": "Jabón de Tocador 3 pack", "precio": 2.5, "imagen": "/assets/img/higiene_jabon.jpg", "descripcion": "Jabón de tocador suave con la piel.", "categoria": "Higiene y Limpieza", "marca": "PureCare", "stock": 36,"vendidos": 200 },
    { "id": 15, "nombre": "Detergente en Polvo 1kg", "precio": 3.8, "imagen": "/assets/img/limpieza_detergente.jpg", "descripcion": "Detergente en polvo para ropa blanca y de color.", "categoria": "Higiene y Limpieza", "marca": "LimpioMax", "stock": 20 ,"vendidos": 145 }
];

// ✅ Variables globales
let productoActual = {};

// ✅ Iniciar cuando cargue el DOM
$(document).ready(function () {
    cargarProductoDesdeURL();
});

// ✅ Leer ID desde URL y cargar producto
function cargarProductoDesdeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id")) || 1;
    cargarProducto(productId);
}

// ✅ Cargar producto específico
function cargarProducto(id) {
    productoActual = productosData.find(p => p.id === id);

    if (!productoActual) return mostrarError();

    $("#productName").text(productoActual.nombre);
    $("#productCategory").text(productoActual.categoria);
    $("#productPrice").text(`$${productoActual.precio.toFixed(2)}`);
    $("#productPriceSidebar").text(`$${productoActual.precio.toFixed(2)}`);

    const precioAnterior = productoActual.precio / 0.85;
    $("#productPriceOld").text(`Precio anterior: $${precioAnterior.toFixed(2)}`);

    $("#productDescription").text(productoActual.descripcion);

    $("#breadcrumb-categoria-link")
        .text(productoActual.categoria)
        .attr("href", `catalogo.html?categoria=${encodeURIComponent(productoActual.categoria)}`);

    $("#breadcrumb-producto").text(productoActual.nombre);

    $("#mainImage").attr("src", productoActual.imagen).attr("alt", productoActual.nombre);

    generarThumbnails();
    cargarProductosRelacionados();
}

// ✅ Thumbnails usando jQuery
function generarThumbnails() {
    const cont = $("#thumbnailsContainer");
    cont.empty();

    for (let i = 0; i < 4; i++) {
        const img = $(`<img src="${productoActual.imagen}" alt="Vista ${i + 1}" class="product-thumbnail">`);
        if (i === 0) img.addClass("active");

        img.on("click", function () {
            changeImage($(this), productoActual.imagen);
        });

        cont.append(img);
    }
}

// ✅ Cambiar imagen principal
function changeImage(thumbnail, newSrc) {
    $("#mainImage").attr("src", newSrc);
    $(".product-thumbnail").removeClass("active");
    thumbnail.addClass("active");
}

// ✅ Productos relacionados
function cargarProductosRelacionados() {
    const cont = $("#relatedProductsContainer");
    cont.empty();

    let relacionados = productosData.filter(
        p => p.categoria === productoActual.categoria && p.id !== productoActual.id
    ).slice(0, 4);

    if (relacionados.length < 4) {
        let otros = productosData
            .filter(p => p.id !== productoActual.id && !relacionados.includes(p))
            .slice(0, 4 - relacionados.length);
        relacionados = relacionados.concat(otros);
    }

    relacionados.forEach(producto => {
        cont.append(`
            <div class="col">
                <div class="card h-100 related-product">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h6 class="card-title small">${producto.nombre}</h6>
                        <p class="fw-bold mb-2 product-price">$${producto.precio.toFixed(2)}</p>
                        <a href="productos.html?id=${producto.id}" class="btn btn-sm btn-outline-secondary w-100">Ver detalles</a>
                    </div>
                </div>
            </div>
        `);
    });
}

// ✅ Agregar al carrito
function agregarAlCarrito() {
    const cantidad = parseInt($("#quantity").val(), 10) || 1;

    // Validación rápida antes de llamar al carrito
    if (Number.isFinite(productoActual.stock) && cantidad > productoActual.stock) {
        alert(`Solo hay ${productoActual.stock} unidades disponibles.`);
        $("#quantity").val(productoActual.stock);
        return;
    }

    const res = Carrito.add({
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen: productoActual.imagen,
        stock: productoActual.stock // IMPORTANTE
    }, cantidad);

    Carrito.renderBadge();

    if (!res.ok) {
        alert("No hay stock disponible para este producto.");
        return;
    }
    if (res.clamped) {
        alert(`Se agregaron ${res.allowed} unidades (límite de stock: ${res.stock}).`);
    } else {
        alert(`Agregado: ${productoActual.nombre} x${res.allowed}`);
    }
}


// ✅ Comprar ahora
function comprarAhora() {
    const cantidad = $("#quantity").val();
    const total = productoActual.precio * cantidad;
    alert(`Compra rápida:\n\n${productoActual.nombre}\nCantidad: ${cantidad}\nTotal: $${total.toFixed(2)}\n\n¡Redirigiendo al pago!`);
}

// ✅ Mostrar error
function mostrarError() {
    $("#productName").text("Producto no encontrado");
    $("#productDescription").text("El producto que buscas no está disponible.");
}

/* ============================================================
   ✅ CATALOGO.JS — CONVERTIDO A JQUERY
   ============================================================ */

const stateCatalogo = {
    all: [],
    filtered: [],
    q: '',
    cat: '',
    sort: 'relevance'
};

// Formatear moneda
function fmtCurrency(n, locale = 'es-EC', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
}

// Renderizar categorías
function renderCategoriesCatalogo(items) {
    const cats = [...new Set(items.map(p => p.categoria).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));

    $("#cat").html(
        '<option value="">Todas</option>' +
        cats.map(c => `<option value="${c}">${c}</option>`).join('')
    );
}

// Renderizar tarjetas
function renderGridCatalogo(items) {
    if (!items.length) {
        $("#grid").html(`
            <div class="col-12">
                <div class="alert alert-warning">No se encontraron productos.</div>
            </div>
        `);
        return;
    }

    const cards = items.map(p => {
        const img = p.imagen || "https://via.placeholder.com/600x600?text=Sin+imagen";
        const badge = p.stock === 0 ? `<span class="badge text-bg-secondary">Agotado</span>` : '';
        const price = fmtCurrency(p.precio ?? 0);
        const url = `productos.html?id=${encodeURIComponent(p.id)}`;

        return `
            <div class="col">
                <div class="card h-100">
                    <a href="${url}" class="text-decoration-none text-reset">
                        <img src="${img}" class="card-img-top" loading="lazy">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between">
                            <h6 class="card-title mb-1">
                                <a href="${url}" class="stretched-link text-reset">${p.nombre}</a>
                            </h6>
                            ${badge}
                        </div>
                        <p class="text-muted small mb-2">${p.marca || ''} · ${p.categoria || ''}</p>
                        <p class="fw-bold mb-3">${price}</p>
                    </div>
                </div>
            </div>`;
    }).join('');

    $("#grid").html(cards);
}

// Filtros
function applyFiltersCatalogo() {
    const q = stateCatalogo.q.trim().toLowerCase();
    const cat = stateCatalogo.cat;

    let items = stateCatalogo.all.filter(p => {
        const matchesText = !q || [
            p.nombre, p.descripcion, p.marca, p.categoria
        ].filter(Boolean).some(v => String(v).toLowerCase().includes(q));

        const matchesCat = !cat || p.categoria === cat;
        return matchesText && matchesCat;
    });

    switch (stateCatalogo.sort) {
        case 'price-asc': items.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0)); break;
        case 'price-desc': items.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0)); break;
        case 'name-asc': items.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "")); break;
        case 'name-desc': items.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || "")); break;
    }

    stateCatalogo.filtered = items;
    renderGridCatalogo(items);
}

// Aplicar categoría desde URL
function aplicarCategoriaDesdeURLCatalogo() {
    const categoria = new URLSearchParams(window.location.search).get("categoria");

    if (categoria) {
        setTimeout(() => {
            $("#cat").val(categoria);
            stateCatalogo.cat = categoria;
            applyFiltersCatalogo();
            $("#catalogo")[0].scrollIntoView({ behavior: "smooth" });
        }, 150);
    }
}

// Cargar productos
function loadProductsCatalogo() {
    // Usamos el arreglo productosData (ya cargado en productos.js)
    const data = productosData;

    stateCatalogo.all = data;

    $("#statusMsg").show();
    renderCategoriesCatalogo(data);
    applyFiltersCatalogo();
    aplicarCategoriaDesdeURLCatalogo();
    $("#statusMsg").hide();
}

/* ================================
   ✅ EVENTOS DEL CATÁLOGO
================================ */
$(document).ready(function () {

    // Solo correr catálogo si existe #catalogo en la página
    if ($("#catalogo").length) {
        loadProductsCatalogo();

        $("#q").on("input", function () {
            stateCatalogo.q = $(this).val();
            applyFiltersCatalogo();
        });

        $("#cat").on("change", function () {
            stateCatalogo.cat = $(this).val();
            applyFiltersCatalogo();
        });

        $("#sort").on("change", function () {
            stateCatalogo.sort = $(this).val();
            applyFiltersCatalogo();
        });
    }
});

/* ============================================================
   ✅ PRODUCTOS MÁS VENDIDOS PARA PORTADA.HTML
   ============================================================ */

function cargarProductosMasVendidos() {
    // Ordenar productos por cantidad de vendidos (descendente)
    const productosMasVendidos = productosData
        .slice() // Crear copia para no modificar el original
        .sort((a, b) => b.vendidos - a.vendidos) // Ordenar por vendidos descendente
        .slice(0, 6); // Tomar solo los primeros 6

    const $contenedor = $('#mas-vendidos');
    $contenedor.empty(); // Limpiar contenedor

    // Generar tarjetas con jQuery
    productosMasVendidos.forEach(function(producto) {
        const card = `
            <div class="col">
                <div class="card h-100">
                    <a href="productos.html?id=${producto.id}" class="text-decoration-none">
                        <div style="height: 200px; overflow: hidden;">
                            <img src="${producto.imagen}"
                                 class="card-img-top"
                                 alt="${producto.nombre}"
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 loading="lazy">
                        </div>
                    </a>
                    <div class="card-body">
                        <h6 class="fw-semibold mb-1">
                            <a href="productos.html?id=${producto.id}" class="text-decoration-none text-dark">
                                ${producto.nombre}
                            </a>
                        </h6>
                        <p class="mb-0 product-price fw-bold">$${producto.precio.toFixed(2)}</p>
                        <p class="text-muted small mb-0">Vendidos: ${producto.vendidos}</p>
                    </div>
                </div>
            </div>
        `;

        $contenedor.append(card);
    });
}


/* ============================================================
   ✅ INICIALIZACIÓN AUTOMÁTICA
   ============================================================ */

$(document).ready(function () {
    // Si estamos en portada.html, cargar productos más vendidos
    if ($('#mas-vendidos').length) {
        cargarProductosMasVendidos();
    }

    // Solo correr catálogo si existe #catalogo en la página
    if ($("#catalogo").length) {
        loadProductsCatalogo();

        $("#q").on("input", function () {
            stateCatalogo.q = $(this).val();
            applyFiltersCatalogo();
        });

        $("#cat").on("change", function () {
            stateCatalogo.cat = $(this).val();
            applyFiltersCatalogo();
        });

        $("#sort").on("change", function () {
            stateCatalogo.sort = $(this).val();
            applyFiltersCatalogo();
        });
    }
});
