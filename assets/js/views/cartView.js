// VISTA: Solo renderiza el HTML
(function (w) {

    const CartModel = w.CartModel;

    function renderCarrito() {
        const items = CartModel.items();
        const $wrap = $("#cart-items").empty();

        if (items.length === 0) {
            $wrap.html(`
        <div class="alert alert-warning text-center">
          🛒 Tu carrito está vacío. <a href="catalogo.html" class="alert-link">Ver productos</a>.
        </div>`);
        } else {
            items.forEach(it => {
                const maxAttr = Number.isFinite(it.stock) ? `max="${it.stock}"` : '';
                const stockLabel = Number.isFinite(it.stock)
                    ? `<small class="text-muted">Stock: ${it.stock}</small>` : '';

                $wrap.append(`
          <div class="card mb-3" data-id="${it.id}">
            <div class="card-body">
              <div class="row align-items-center">

                <div class="col-5 d-flex align-items-center">
                  <button class="btn btn-link text-danger p-0 me-3 btn-remove"><i class="bi bi-x-lg"></i></button>
                  <img src="${it.imagen}" class="rounded me-3" style="width:60px;height:60px;object-fit:cover;">
                  <div>
                    <h6>${it.nombre}</h6>
                    <small class="text-muted">Precio: ${CartModel.fmt(it.precio)}</small><br>
                    ${stockLabel}
                  </div>
                </div>

                <div class="col-2 text-center">
                  <span class="fw-semibold">${CartModel.fmt(it.precio)}</span>
                </div>

                <div class="col-3">
                  <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary btn-dec">−</button>
                    <input type="number" class="form-control form-control-sm text-center mx-2 input-qty"
                           value="${it.qty}" min="1" ${maxAttr} style="width:60px;">
                    <button class="btn btn-sm btn-outline-secondary btn-inc">+</button>
                  </div>
                  <div class="form-text text-danger d-none msg-stock">No puedes exceder el stock.</div>
                </div>

                <div class="col-2 text-center">
                  <span class="fw-bold subtotal">${CartModel.fmt(it.precio * it.qty)}</span>
                </div>

              </div>
            </div>
          </div>
        `);
            });
        }

        // Resumen
        $("#total-items").text(CartModel.countItems());
        $("#sub-total").text(CartModel.fmt(CartModel.subtotal()));
        $("#shipping").text(CartModel.fmt(CartModel.shipping()));
        $("#taxes").text(CartModel.fmt(CartModel.taxes()));   // IVA
        $("#total").text(CartModel.fmt(CartModel.total()));   // total final

        CartModel.renderBadge();
    }

    w.CartView = { renderCarrito };

})(window);
