import { productosData } from "../models/productosModel.js";

export function initHome() {
    if (!$("#mas-vendidos").length) return;

    cargarProductosMasVendidos();
}

function cargarProductosMasVendidos() {
    const lista = productosData
        .slice()                // Copia
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 6);           // Solo los primeros 6

    const cont = $("#mas-vendidos");
    cont.empty();

    lista.forEach(p => {
        cont.append(`
            <div class="col">
                <div class="card h-100">
                    <a href="productos.html?id=${p.id}" class="text-decoration-none">
                        <div style="height: 200px; overflow: hidden;">
                            <img src="${p.imagen}"
                                 class="card-img-top"
                                 alt="${p.nombre}"
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 loading="lazy">
                        </div>
                    </a>
                    <div class="card-body">
                        <h6 class="fw-semibold mb-1">
                            <a href="productos.html?id=${p.id}" class="text-decoration-none text-dark">
                                ${p.nombre}
                            </a>
                        </h6>
                        <p class="mb-0 product-price fw-bold">$${p.precio.toFixed(2)}</p>
                        <p class="text-muted small mb-0">Vendidos: ${p.vendidos}</p>
                    </div>
                </div>
            </div>
        `);
    });
}
