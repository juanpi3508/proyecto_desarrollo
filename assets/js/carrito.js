// assets/js/carrito.js
(function (w) {
    const KEY = 'koko_cart_v1';

    const load  = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
    const save  = (items) => localStorage.setItem(KEY, JSON.stringify(items));
    const idxOf = (items, id) => items.findIndex(i => i.id === id);
    const hasNum = (v) => Number.isFinite(v) && v >= 0;

    const api = {
        items() { return load(); },
        get(id) { return load().find(i => i.id === id) || null; },
        clear() { save([]); },

        /**
         * Agrega con validación de stock.
         * producto: {id, nombre, precio, imagen, stock}
         * qty: cantidad a sumar
         * return: { ok, clamped, allowed, stock, item }
         */
        add(producto, qty = 1) {
            qty = parseInt(qty, 10) || 1;
            const items = load();
            const i = idxOf(items, producto.id);
            const stock = hasNum(producto.stock) ? Math.max(0, parseInt(producto.stock,10)) : null;

            if (i >= 0) {
                // mantener metadatos actuales y actualizar stock si viene informado
                if (hasNum(stock)) items[i].stock = stock;
                const curr = items[i].qty;
                const target = curr + qty;
                let allowed = target;

                if (hasNum(items[i].stock)) {
                    allowed = Math.min(target, items[i].stock);
                }

                items[i].qty = Math.max(0, allowed);
                save(items);

                return {
                    ok: items[i].qty > curr,
                    clamped: allowed < target,
                    allowed: items[i].qty - curr,
                    stock: items[i].stock ?? null,
                    item: items[i]
                };
            } else {
                // nuevo ítem
                let allowed = qty;
                if (hasNum(stock)) allowed = Math.min(qty, stock);

                const nuevo = {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: Number(producto.precio || 0),
                    imagen: producto.imagen || '',
                    stock: hasNum(stock) ? stock : null,
                    qty: Math.max(0, allowed)
                };
                if (nuevo.qty > 0) {
                    items.push(nuevo);
                    save(items);
                }
                return {
                    ok: nuevo.qty > 0,
                    clamped: allowed < qty,
                    allowed: nuevo.qty,
                    stock: nuevo.stock,
                    item: nuevo
                };
            }
        },

        /**
         * Actualiza cantidad con límite por stock.
         */
        update(id, qty) {
            qty = Math.max(1, parseInt(qty, 10) || 1);
            const items = load();
            const i = idxOf(items, id);
            if (i >= 0) {
                const stock = items[i].stock;
                if (hasNum(stock)) qty = Math.min(qty, stock);
                items[i].qty = qty;
                save(items);
                return { ok: true, clamped: hasNum(stock) && qty >= stock, item: items[i] };
            }
            return { ok: false, clamped: false, item: null };
        },

        remove(id) {
            const items = load().filter(i => i.id !== id);
            save(items);
            return items;
        },

        countItems() { return load().reduce((a, i) => a + i.qty, 0); },
        subtotal()   { return load().reduce((a, i) => a + (i.precio * i.qty), 0); },
        shipping()   { const s = this.subtotal(); return s >= 20 ? 0 : (s === 0 ? 0 : 3.99); },
        taxes()      { return 0; },
        total()      { return this.subtotal() + this.shipping() + this.taxes(); },

        fmt(n, loc='es-EC', curr='USD') {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: curr }).format(n);
        },

        renderBadge() {
            const el = document.getElementById('cart-count');
            if (el) el.textContent = this.countItems();
        }
    };

    w.Carrito = api;
})(window);

window.addEventListener('storage', () => Carrito.renderBadge());
