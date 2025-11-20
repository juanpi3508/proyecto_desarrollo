// CONTROLADOR: Conecta vista y modelo
(function (w, $) {

    const CartModel = w.CartModel;
    const CartView = w.CartView;

    const initEvents = () => {

        $(document)
            .on("click", ".btn-inc", function () {
                const $card = $(this).closest(".card");
                const $qty = $card.find(".input-qty");
                const max = parseInt($qty.attr("max"), 10);
                let val = parseInt($qty.val(), 10) || 1;

                if (Number.isFinite(max) && val >= max) {
                    $card.find(".msg-stock").removeClass("d-none");
                    setTimeout(() => $card.find(".msg-stock").addClass("d-none"), 2000);
                    return;
                }

                $qty.val(val + 1).trigger("change");
            })

            .on("click", ".btn-dec", function () {
                const $qty = $(this).closest(".card").find(".input-qty");
                let val = parseInt($qty.val(), 10) || 1;
                $qty.val(Math.max(1, val - 1)).trigger("change");
            })

            .on("change", ".input-qty", function () {
                const $card = $(this).closest(".card");
                const id = $card.data("id");
                let qty = Math.max(1, parseInt($(this).val(), 10) || 1);
                const max = parseInt($(this).attr("max"), 10);

                if (Number.isFinite(max) && qty > max) {
                    qty = max;
                    $(this).val(max);
                    $card.find(".msg-stock").removeClass("d-none");
                    setTimeout(() => $card.find(".msg-stock").addClass("d-none"), 2000);
                }

                CartModel.update(id, qty);
                CartView.renderCarrito();
            })

            .on("click", ".btn-remove", function () {
                const id = $(this).closest(".card").data("id");
                CartModel.remove(id);
                CartView.renderCarrito();
            });

        $("#btn-vaciar").on("click", function () {
            if (confirm("¿Deseas vaciar el carrito completo?")) {
                CartModel.clear();
                CartView.renderCarrito();
            }
        });

        $("#btn-pagar").on("click", function () {
            if (CartModel.countItems() === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("Redirigir a la pasarela...");
        });

        window.addEventListener("cartUpdated", () => {
            CartView.renderCarrito();
        });
    };

    const init = () => {
        CartView.renderCarrito();
        initEvents();
    };

    w.CartController = { init };

})(window, jQuery);
