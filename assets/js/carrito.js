(function ($, w) {
    const KEY = 'koko_cart_v1';

    // -------------------------
    // Utilidades internas
    // -------------------------
    const load = () => {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    };

    const save  = (items) => localStorage.setItem(KEY, JSON.stringify(items));
    const idxOf = (items, id) => items.findIndex(i => i.id === id);
    const hasNum = (v) => Number.isFinite(v) && v >= 0;

    // -------------------------
    // API del carrito (motor)
    // -------------------------
    const api = {
        items() { return load(); },

        get(id) { return load().find(i => i.id === id) || null; },

        clear() {
            save([]);
            $(w).trigger("cartUpdated");
        },

        /**
         * Agrega producto con validación de stock.
         * producto: {id, nombre, precio, imagen, stock}
         * qty: cantidad a sumar
         * return: { ok, clamped, allowed, stock, item }
         */
        add(producto, qty = 1) {
            qty = parseInt(qty, 10) || 1;
            const items = load();
            const i = idxOf(items, producto.id);
            const stock = hasNum(producto.stock) ? Math.max(0, parseInt(producto.stock, 10)) : null;

            if (i >= 0) {
                if (hasNum(stock)) items[i].stock = stock;
                const curr = items[i].qty;
                const target = curr + qty;
                let allowed = target;

                if (hasNum(items[i].stock)) allowed = Math.min(target, items[i].stock);

                items[i].qty = Math.max(0, allowed);
                save(items);
                $(w).trigger("cartUpdated");

                return {
                    ok: items[i].qty > curr,
                    clamped: allowed < target,
                    allowed: items[i].qty - curr,
                    stock: items[i].stock ?? null,
                    item: items[i]
                };
            } else {
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
                    $(w).trigger("cartUpdated");
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

        update(id, qty) {
            qty = Math.max(1, parseInt(qty, 10) || 1);
            const items = load();
            const i = idxOf(items, id);

            if (i >= 0) {
                const stock = items[i].stock;
                if (hasNum(stock)) qty = Math.min(qty, stock);
                items[i].qty = qty;
                save(items);
                $(w).trigger("cartUpdated");
                return { ok: true, clamped: hasNum(stock) && qty >= stock, item: items[i] };
            }
            return { ok: false, clamped: false, item: null };
        },

        remove(id) {
            const items = load().filter(i => i.id !== id);
            save(items);
            $(w).trigger("cartUpdated");
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

        taxes() { return 0; },

        total() { return this.subtotal() + this.shipping() + this.taxes(); },

        fmt(n, loc = 'es-EC', curr = 'USD') {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: curr }).format(n);
        },

        /** Muestra/oculta el badge del carrito */
        renderBadge() {
            const $badge = $("#cart-count");
            if ($badge.length) {
                const count = this.countItems();
                if (count > 0) { $badge.text(count).show(); }
                else { $badge.text("").hide(); }
            }
        }
    };

    // Exponer globalmente
    w.Carrito = api;

    // Sincronización entre pestañas y dentro de la página
    $(w).on("storage cartUpdated", function () {
        Carrito.renderBadge();
    });

    // -------------------------
    // UI del carrito (render + eventos)
    // -------------------------
    function renderCarrito() {
        const $wrap = $("#cart-items").empty();
        const items = Carrito.items();

        if (items.length === 0) {
            $wrap.html(`
        <div class="alert alert-warning text-center">
          🛒 Tu carrito está vacío. <a href="catalogo.html" class="alert-link">Ver productos</a>.
        </div>
      `);
        } else {
            items.forEach(it => {
                const maxAttr = Number.isFinite(it.stock) ? `max="${it.stock}"` : '';
                const stockLabel = Number.isFinite(it.stock)
                    ? `<small class="text-muted">Stock: ${it.stock}</small>`
                    : '';

                const $card = $(`
          <div class="card mb-3" data-id="${it.id}">
            <div class="card-body">
              <div class="row align-items-center">

                <div class="col-5 d-flex align-items-center">
                  <button class="btn btn-link text-danger p-0 me-3 btn-remove" title="Eliminar">
                    <i class="bi bi-x-lg"></i>
                  </button>
                  <img src="${it.imagen || ''}" alt="${it.nombre}" class="rounded me-3"
                       style="width:60px;height:60px;object-fit:cover;">
                  <div>
                    <h6 class="mb-0">${it.nombre}</h6>
                    <small class="text-muted">Precio: ${Carrito.fmt(it.precio)}</small><br>
                    ${stockLabel}
                  </div>
                </div>

                <div class="col-2 text-center">
                  <span class="fw-semibold">${Carrito.fmt(it.precio)}</span>
                </div>

                <div class="col-3">
                  <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-sm btn-outline-secondary btn-dec">−</button>
                    <input type="number" class="form-control form-control-sm text-center mx-2 input-qty"
                           value="${it.qty}" min="1" ${maxAttr} style="width:60px;">
                    <button class="btn btn-sm btn-outline-secondary btn-inc">+</button>
                  </div>
                  <div class="form-text text-danger d-none msg-stock">No puedes exceder el stock.</div>
                </div>

                <div class="col-2 text-center">
                  <span class="fw-bold subtotal">${Carrito.fmt(it.precio * it.qty)}</span>
                </div>

              </div>
            </div>
          </div>
        `);
                $wrap.append($card);
            });
        }

        // Resumen
        $("#total-items").text(Carrito.countItems());
        $("#sub-total").text(Carrito.fmt(Carrito.subtotal()));
        $("#shipping").text(Carrito.fmt(Carrito.shipping()));
        $("#taxes").text(Carrito.fmt(Carrito.taxes()));
        $("#total").text(Carrito.fmt(Carrito.total()));

        Carrito.renderBadge();
    }

    // Delegaciones de eventos
    $(document)
        // + (incrementar) con tope de stock
        .on("click", ".btn-inc", function () {
            const $card = $(this).closest(".card");
            const $qty  = $card.find(".input-qty");
            const max   = parseInt($qty.attr("max"), 10);
            let val     = parseInt($qty.val(), 10) || 1;

            if (Number.isFinite(max) && val >= max) {
                $card.find(".msg-stock").removeClass("d-none");
                setTimeout(() => $card.find(".msg-stock").addClass("d-none"), 2000);
                return; // no exceder stock
            }
            $qty.val(val + 1).trigger("change");
        })

        // − (decrementar)
        .on("click", ".btn-dec", function () {
            const $card = $(this).closest(".card");
            const $qty  = $card.find(".input-qty");
            let val     = parseInt($qty.val(), 10) || 1;
            $qty.val(Math.max(1, val - 1)).trigger("change");
        })

        // Cambio manual con clamp a stock
        .on("change", ".input-qty", function () {
            const $card = $(this).closest(".card");
            const id    = $card.data("id");
            let qty     = Math.max(1, parseInt($(this).val(), 10) || 1);
            const max   = parseInt($(this).attr("max"), 10);

            if (Number.isFinite(max) && qty > max) {
                qty = max;
                $(this).val(max);
                $card.find(".msg-stock").removeClass("d-none");
                setTimeout(() => $card.find(".msg-stock").addClass("d-none"), 2000);
            }

            Carrito.update(id, qty);
            const item = Carrito.get(id);

            // actualizar subtotal y resumen
            $card.find(".subtotal").text(Carrito.fmt(item.precio * item.qty));
            $("#total-items").text(Carrito.countItems());
            $("#sub-total").text(Carrito.fmt(Carrito.subtotal()));
            $("#shipping").text(Carrito.fmt(Carrito.shipping()));
            $("#taxes").text(Carrito.fmt(Carrito.taxes()));
            $("#total").text(Carrito.fmt(Carrito.total()));
            Carrito.renderBadge();
        })

        // Eliminar
        .on("click", ".btn-remove", function () {
            const id = $(this).closest(".card").data("id");
            Carrito.remove(id);
            renderCarrito();
        });

    // Botones fuera de la lista
    $(function () {
        // Vaciar
        $("#btn-vaciar").on("click", function () {
            if (confirm("¿Deseas vaciar el carrito completo?")) {
                Carrito.clear();
                renderCarrito();
            }
        });

        // Pagar (placeholder)
        $("#btn-pagar").on("click", function () {
            if (Carrito.countItems() === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("Redirigir a la pasarela de pago (pendiente de integración).");
        });

        // Inicio
        Carrito.renderBadge();
        renderCarrito();
    });

})(jQuery, window);
