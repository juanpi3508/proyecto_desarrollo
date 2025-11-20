import { productosData } from "../models/productosModel.js";
import { renderGridCatalogo, renderCategoriesCatalogo } from "../views/catalogoView.js";

export const stateCatalogo = {
    all: [],
    filtered: [],
    q: '',
    cat: '',
    sort: 'relevance'
};

export function initCatalogo() {

    if (!$("#catalogo").length) return;

    stateCatalogo.all = productosData;

    renderCategoriesCatalogo(productosData);
    aplicarFiltros();

    $("#q").on("input", function () {
        stateCatalogo.q = $(this).val();
        aplicarFiltros();
    });

    $("#cat").on("change", function () {
        stateCatalogo.cat = $(this).val();
        aplicarFiltros();
    });

    $("#sort").on("change", function () {
        stateCatalogo.sort = $(this).val();
        aplicarFiltros();
    });

    aplicarCategoriaDesdeURL();
}

function aplicarFiltros() {
    let items = stateCatalogo.all;

    const q = stateCatalogo.q.trim().toLowerCase();
    const cat = stateCatalogo.cat;
    const sort = stateCatalogo.sort;

    // FILTROS
    items = items.filter(p => {
        const text = [p.nombre, p.descripcion, p.marca, p.categoria]
            .join(" ")
            .toLowerCase();

        const okQ = !q || text.includes(q);
        const okCat = !cat || p.categoria === cat;

        return okQ && okCat;
    });

    // ORDENAMIENTO
    switch (sort) {

        case "price-asc":
            items.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
            break;

        case "price-desc":
            items.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
            break;

        case "name-asc":
            items.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
            break;

        case "name-desc":
            items.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
            break;

        case "relevance":
        default:
            // No ordenar (queda como está)
            break;
    }

    renderGridCatalogo(items);
}


function aplicarCategoriaDesdeURL() {
    const categoria = new URLSearchParams(window.location.search).get("categoria");
    if (categoria) {
        $("#cat").val(categoria);
        stateCatalogo.cat = categoria;
        aplicarFiltros();
    }
}
