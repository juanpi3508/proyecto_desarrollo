import {
    getProductoById,
    getProductosRelacionados
} from "../models/productosModel.js";

import {
    renderProducto,
    renderThumbnails,
    renderRelacionados
} from "../views/productosView.js";

const Carrito = window.CartModel;

let productoActual = {};

export function initProductos() {

    // Si no estoy en productos.html, no ejecuto nada
    if (!$("#productName").length) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id")) || 1;

    const producto = getProductoById(id);
    productoActual = producto;

    if (!producto) return mostrarError();

    // Renderizar información principal
    renderProducto(producto);

    // Miniaturas y cambio de imagen
    renderThumbnails(producto, cambiarImagen);

    // Renderizar productos relacionados
    const relacionados = getProductosRelacionados(producto);
    renderRelacionados(relacionados);

    // Eventos de botones
    $("#btnAgregarCarrito").on("click", agregarAlCarrito);
    $("#btnComprarAhora").on("click", comprarAhora);
}

function cambiarImagen(thumbnail, src) {
    $("#mainImage").attr("src", src);
    $(".product-thumbnail").removeClass("active");
    thumbnail.addClass("active");
}

function agregarAlCarrito() {
    const cantidad = parseInt($("#quantity").val(), 10) || 1;
    const resultado = Carrito.add(productoActual, cantidad);

    Carrito.renderBadge();

    if (!resultado.ok) {
        alert("No hay stock disponible.");
        return;
    }

    if (resultado.clamped) {
        alert(`Se agregaron ${resultado.allowed} unidades (máx ${resultado.stock}).`);
    } else {
        alert(`Agregado: ${productoActual.nombre} x${resultado.allowed}`);
    }
}

function comprarAhora() {
    const cantidad = parseInt($("#quantity").val(), 10) || 1;

    Carrito.add(productoActual, cantidad);
    window.location.href = "carrito.html";
}

function mostrarError() {
    $("#productName").text("Producto no encontrado");
    $("#productDescription").text("El producto solicitado no está disponible.");
}

window.agregarAlCarrito = agregarAlCarrito;
window.comprarAhora = comprarAhora;