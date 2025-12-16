// Formateo de moneda igual al original
function fmtCurrency(n, locale = 'es-EC', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
}

export function renderCategoriesCatalogo(items) {
    const cats = [...new Set(items.map(p => p.categoria).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));

    $("#cat").html(
        '<option value="">Todas</option>' +
        cats.map(c => `<option value="${c}">${c}</option>`).join('')
    );
}

export function renderGridCatalogo(items) {
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
        const badge = p.stock === 0
            ? `<span class="badge text-bg-secondary">Agotado</span>`
            : "";

        const price = fmtCurrency(p.precio ?? 0);
        const url = `productos.html?id=${encodeURIComponent(p.id)}`;

        return `
            <div class="col">
                <div class="card h-100 shadow-sm">

                    <a href="${url}" class="text-decoration-none text-reset">
                        <img src="${img}"
                             class="card-img-top"
                             loading="lazy"
                             alt="${p.nombre}">
                    </a>

                    <div class="card-body d-flex flex-column">

                        <div class="d-flex justify-content-between">
                            <h6 class="card-title mb-1">
                                <a href="${url}" 
                                   class="stretched-link text-reset fw-semibold">
                                   ${p.nombre}
                                </a>
                            </h6>
                            ${badge}
                        </div>

                        <p class="text-muted small mb-2">
                            ${p.marca || ''} · ${p.categoria || ''}
                        </p>

                        <p class="fw-bold mb-3 product-price">
                            ${price}
                        </p>
                    </div>
                </div>
            </div>`;
    }).join('');

    $("#grid").html(cards);
}
