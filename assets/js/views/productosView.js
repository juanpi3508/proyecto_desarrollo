// ==========================
// FORMATEO DE MONEDA
// ==========================
function fmtCurrency(n, locale = 'es-EC', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
}

// ==========================
// DETALLE PRINCIPAL DEL PRODUCTO
// ==========================
export function renderProducto(producto) {

    // Título principal
    $("#productName").text(producto.nombre);

    // Categoría
    $("#productCategory").text(producto.categoria);

    // Precios
    $("#productPrice").text(fmtCurrency(producto.precio));
    $("#productPriceSidebar").text(fmtCurrency(producto.precio));

    const precioAnterior = producto.precio / 0.85;
    $("#productPriceOld").text(`Precio anterior: ${fmtCurrency(precioAnterior)}`);

    // Descripción
    $("#productDescription").text(producto.descripcion);

    // Migas de pan (breadcrumbs)
    $("#breadcrumb-categoria-link")
        .text(producto.categoria)
        .attr("href", `catalogo.html?categoria=${encodeURIComponent(producto.categoria)}`);

    $("#breadcrumb-producto").text(producto.nombre);

    // Imagen principal
    $("#mainImage")
        .attr("src", producto.imagen)
        .attr("alt", producto.nombre)
        .attr("loading", "lazy");
}

// ==========================
// MINIATURAS
// ==========================
export function renderThumbnails(producto, onClick) {
    const cont = $("#thumbnailsContainer");
    cont.empty();

    for (let i = 0; i < 4; i++) {
        const img = $(`
            <div class="col-3">
                <img src="${producto.imagen}"
                     alt="Vista ${i + 1}"
                     class="img-fluid rounded shadow-sm product-thumbnail"
                     loading="lazy">
            </div>
        `);

        if (i === 0) img.find("img").addClass("active");

        img.on("click", function () {
            onClick($(this).find("img"), producto.imagen);
        });

        cont.append(img);
    }
}

// ==========================
// PRODUCTOS RELACIONADOS
// ==========================
export function renderRelacionados(lista) {
    const cont = $("#relatedProductsContainer");
    cont.empty();

    lista.forEach(p => {
        const badge = p.stock === 0
            ? `<span class="badge text-bg-secondary">Agotado</span>`
            : "";

        cont.append(`
            <div class="col">
                <div class="card h-100 shadow-sm related-product">

                    <a href="productos.html?id=${p.id}" class="text-decoration-none text-reset">
                        <img src="${p.imagen}"
                             class="card-img-top"
                             alt="${p.nombre}"
                             style="height:180px; object-fit:cover;"
                             loading="lazy">
                    </a>

                    <div class="card-body">

                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="card-title small mb-1 fw-semibold">
                                <a href="productos.html?id=${p.id}"
                                   class="stretched-link text-reset">
                                    ${p.nombre}
                                </a>
                            </h6>
                            ${badge}
                        </div>

                        <p class="text-muted small mb-2">${p.marca} · ${p.categoria}</p>

                        <p class="fw-bold mb-0 product-price">
                            ${fmtCurrency(p.precio)}
                        </p>
                    </div>

                </div>
            </div>
        `);
    });
}
