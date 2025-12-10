// MODELO: Toda la lógica del carrito
(function (w) {

    const KEY = 'koko_cart_v1';

    const load = () => {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    };

    const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));
    const idxOf = (items, id) => items.findIndex(i => i.id === id);
    const hasNum = (v) => Number.isFinite(v) && v >= 0;

    const api = {

        items() { return load(); },

        get(id) { return load().find(i => i.id === id) || null; },

        clear() {
            save([]);
            window.dispatchEvent(new Event("cartUpdated"));
        },

        add(producto, qty = 1) {
            qty = parseInt(qty, 10) || 1;
            const items = load();
            const i = idxOf(items, producto.id);
            const stock = hasNum(producto.stock) ? Math.max(0, parseInt(producto.stock, 10)) : null;

            if (i >= 0) {
                if (hasNum(stock)) items[i].stock = stock;
                const curr = items[i].qty;
                const target = curr + qty;

                let allowed = hasNum(items[i].stock)
                    ? Math.min(target, items[i].stock)
                    : target;

                items[i].qty = Math.max(0, allowed);
                save(items);
                window.dispatchEvent(new Event("cartUpdated"));

                return {
                    ok: items[i].qty > curr,
                    clamped: allowed < target,
                    allowed: items[i].qty - curr,
                    stock: items[i].stock ?? null,
                    item: items[i]
                };
            }

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
                window.dispatchEvent(new Event("cartUpdated"));
            }

            return {
                ok: nuevo.qty > 0,
                clamped: allowed < qty,
                allowed: nuevo.qty,
                stock: nuevo.stock,
                item: nuevo
            };
        },

        update(id, qty) {
            qty = Math.max(1, parseInt(qty, 10) || 1);
            const items = load();
            const i = idxOf(items, id);

            if (i >= 0) {
                const stock = items[i].stock;
                if (hasNum(stock)) qty = Math.min(qty, stock);

                items[i].qty = qty;
                save(items);
                window.dispatchEvent(new Event("cartUpdated"));

                return { ok: true, clamped: hasNum(stock) && qty >= stock, item: items[i] };
            }

            return { ok: false, clamped: false, item: null };
        },

        remove(id) {
            const items = load().filter(i => i.id !== id);
            save(items);
            window.dispatchEvent(new Event("cartUpdated"));
            return items;
        },

        countItems() {
            return load().reduce((a, i) => a + i.qty, 0);
        },

        subtotal() {
            return load().reduce((a, i) => a + (i.precio * i.qty), 0);
        },

        shipping() {
            const s = this.subtotal();
            return s >= 20 ? 0 : (s === 0 ? 0 : 3.99);
        },

        taxes() {
            const iva = 0.12; // 12%
            return this.subtotal() * iva;
        },

        total() {
            return this.subtotal() + this.shipping() + this.taxes();
        },

        fmt(n, loc = 'es-EC', curr = 'USD') {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: curr }).format(n);
        },

    };

    w.CartModel = api;

})(window);
