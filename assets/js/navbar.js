$(function () {
    // --- 1. Cargar navbar desde caché si existe ---
    if (sessionStorage.getItem("navbarHTML")) {
        $("#navbar-container").html(sessionStorage.getItem("navbarHTML"));
        inicializarNavbar(); // Configurar estados activos y carrito
    } else {
        // --- 2. Si no existe, crear el navbar y guardarlo ---
        const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
            <div class="container">
              <a class="navbar-brand fw-bold d-flex align-items-center" href="portada.html">
                  <img src="assets/img/logo.jpg"
                       alt="KoKo Market"
                       loading="eager"
                       fetchpriority="high"
                       decoding="sync"
                       style="height: 40px; width: auto; border-radius: 6px;">
                  <span>KoKo Market</span>
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        <li class="nav-item"><a class="nav-link" href="portada.html">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link" href="catalogo.html">Catálogo</a></li>
                        <li class="nav-item" id="cart-item">
                            <a class="nav-link" href="carrito.html">
                                <i class="bi bi-cart3 me-1"></i> Carrito
                                <span id="cart-count" class="badge bg-warning text-dark ms-1"></span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="log.html">
                                <i class="bi bi-person-circle me-1"></i> Ingresar
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

        // Inyectar navbar y guardarlo en caché
        $("#navbar-container").html(navbarHTML);
        sessionStorage.setItem("navbarHTML", navbarHTML);
        inicializarNavbar();
    }

    // --- 3. Función para activar página actual y mostrar contador ---
    function inicializarNavbar() {
        const currentPage = window.location.pathname.split("/").pop();

        $("#navbar-container .nav-link").each(function () {
            const href = $(this).attr("href");
            if (href === currentPage) {
                $(this).addClass("active fw-bold");
            } else {
                $(this).removeClass("active fw-bold");
            }
        });

        const $cartCount = $("#cart-count");

        function actualizarBadge() {
            if (typeof Carrito !== "undefined") {
                const count = Carrito.countItems();
                if (count > 0) {
                    $cartCount.text(count).show();
                } else {
                    $cartCount.hide();
                }
            } else {
                console.warn("⚠️ Carrito no está definido. Carga carrito.js antes de navbar.js");
            }
        }

        // Actualizar al cargar
        actualizarBadge();

        // Actualizar si cambia el localStorage (otras pestañas)
        $(window).on("storage", actualizarBadge);

        // Actualizar si el carrito cambia en esta pestaña
        $(window).on("cartUpdated", actualizarBadge);
    }
});
