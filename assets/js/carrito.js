// assets/js/carrito.js
(function (w) {
    const KEY = 'koko_cart_v1';

    // === almacenamiento ===
    const load = () => {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    };
    const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));
    const findIndex = (items, id) => items.findIndex(i => i.id === id);

    // === API pública ===
    const api = {
        items() { return load(); },
        clear() { save([]); },
        add(producto, qty = 1) {
            qty = parseInt(qty, 10) || 1;
            const items = load();
            const i = findIndex(items, producto.id);
            if (i >= 0) {
                items[i].qty += qty;
            } else {
                items.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: Number(producto.precio || 0),
                    imagen: producto.imagen || '',
                    qty
                });
            }
            save(items);
            return items;
        },
        update(id, qty) {
            qty = Math.max(1, parseInt(qty, 10) || 1);
            const items = load();
            const i = findIndex(items, id);
            if (i >= 0) {
                items[i].qty = qty;
                save(items);
            }
            return items;
        },
        remove(id) {
            const items = load().filter(i => i.id !== id);
            save(items);
            return items;
        },
        countItems() { return load().reduce((a, i) => a + i.qty, 0); },
        subtotal()  { return load().reduce((a, i) => a + (i.precio * i.qty), 0); },
        shipping()  {
            const sub = this.subtotal();
            return sub >= 20 ? 0 : (sub === 0 ? 0 : 3.99); // gratis desde $20
        },
        taxes()     { return 0; }, // si luego quieres IVA, lo calculamos aquí
        total()     { return this.subtotal() + this.shipping() + this.taxes(); },

        // utilidades
        fmt(n, loc='es-EC', curr='USD') {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: curr }).format(n);
        },

        // badge opcional en navbar (span#cart-count)
        renderBadge() {
            const el = document.getElementById('cart-count');
            if (el) el.textContent = this.countItems();
        }


    };

    // expone como "Carrito" en window
    w.Carrito = api;
})(window);

// sincroniza el contador entre pestañas
window.addEventListener('storage', () => Carrito.renderBadge());
