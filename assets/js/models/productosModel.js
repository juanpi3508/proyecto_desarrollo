// MODELO: Maneja datos de productos

export const productosData = [
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

// Obtiene producto por ID
export function getProductoById(id) {
    return productosData.find(p => p.id === id);
}

// Filtrar productos por categoría
export function getProductosRelacionados(producto) {
    let relacionados = productosData.filter(
        p => p.categoria === producto.categoria && p.id !== producto.id
    ).slice(0, 4);

    if (relacionados.length < 4) {
        let otros = productosData
            .filter(p => p.id !== producto.id && !relacionados.includes(p))
            .slice(0, 4 - relacionados.length);
        relacionados = relacionados.concat(otros);
    }
    return relacionados;
}
