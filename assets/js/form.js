$(function () {
    const $form     = $(".login-container");
    const $loading  = $(".loading").hide();
    const $success  = $(".success").hide();
    const $error    = $(".error").hide();

    // Función para validar email
    function validarEmail(email) {
        return email.includes('@') && email.trim() !== '';
    }

    // Función para mostrar error en un campo
    function mostrarError($input, mensaje) {
        // Remover error previo si existe
        $input.removeClass('is-valid').addClass('is-invalid');
        $input.next('.invalid-feedback').remove();

        // Agregar mensaje de error
        $input.after(`<div class="invalid-feedback d-block">${mensaje}</div>`);
    }

    // Función para limpiar error de un campo
    function limpiarError($input) {
        $input.removeClass('is-invalid').addClass('is-valid');
        $input.next('.invalid-feedback').remove();
    }

    // Función para limpiar todos los errores
    function limpiarTodosLosErrores() {
        $('#email, #password').removeClass('is-invalid is-valid');
        $('.invalid-feedback').remove();
    }

    // Validar en tiempo real cuando el usuario escribe
    $('#email').on('input', function() {
        const email = $(this).val().trim();

        if (email === '') {
            limpiarError($(this));
        } else if (!validarEmail(email)) {
            mostrarError($(this), 'Escribe una dirección de correo electrónico válida.');
        } else {
            limpiarError($(this));
        }
    });

    $('#password').on('input', function() {
        const password = $(this).val();

        if (password === '') {
            limpiarError($(this));
        } else if (password.length > 0) {
            limpiarError($(this));
        }
    });

    // Click en el botón Log In
    $(".btn-login").on("click", function () {
        limpiarTodosLosErrores();

        const email = $('#email').val().trim();
        const password = $('#password').val();
        let hayErrores = false;

        // Validar email
        if (email === '') {
            mostrarError($('#email'), 'Por favor, completa este campo.');
            hayErrores = true;
        } else if (!validarEmail(email)) {
            mostrarError($('#email'), 'Escribe una dirección de correo electrónico válida.');
            hayErrores = true;
        }

        // Validar password
        if (password === '') {
            mostrarError($('#password'), 'Por favor, completa este campo.');
            hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
            return;
        }

        $form.hide("slow");
        $error.hide("slow");
        $success.hide("slow");

        $loading.fadeIn(500);

        setTimeout(function () {
            $loading.hide("slow");
            $success.fadeIn(500);
        }, 1500);
    });

    $("#volver").on("click", function () {
        $error.hide("slow");
        $form.fadeIn(500);
        limpiarTodosLosErrores();
    });
});

// ============================================
// CÓDIGO PARA SIGNUP (REGISTRO)
// ============================================

$(function () {
    const $formSignup = $(".register-container");
    const $loadingSignup = $(".loading-signup").hide();
    const $successSignup = $(".success-signup").hide();
    const $errorSignup = $(".error-signup").hide();

    // Funciones de validación (reutilizables)
    function validarEmail(email) {
        return email.includes('@') && email.trim() !== '';
    }

    function mostrarErrorSignup($input, mensaje) {
        $input.removeClass('is-valid').addClass('is-invalid');
        $input.next('.invalid-feedback').remove();
        $input.after(`<div class="invalid-feedback d-block">${mensaje}</div>`);
    }

    function limpiarErrorSignup($input) {
        $input.removeClass('is-invalid').addClass('is-valid');
        $input.next('.invalid-feedback').remove();
    }

    function limpiarTodosLosErroresSignup() {
        $('#nombre, #apellido, #emailSignup, #regPassword, #regPassword2').removeClass('is-invalid is-valid');
        $('.invalid-feedback').remove();
        // Limpiar ojitos
        $('.btn-toggle-password-reg, .btn-toggle-password-reg2').remove();
    }

    // Validación en tiempo real - Nombre
    $('#nombre').on('input', function() {
        const nombre = $(this).val().trim();
        if (nombre === '') {
            limpiarErrorSignup($(this));
        } else if (nombre.length > 0) {
            limpiarErrorSignup($(this));
        }
    });

    // Validación en tiempo real - Apellido
    $('#apellido').on('input', function() {
        const apellido = $(this).val().trim();
        if (apellido === '') {
            limpiarErrorSignup($(this));
        } else if (apellido.length > 0) {
            limpiarErrorSignup($(this));
        }
    });

    // Validación en tiempo real - Email
    $('#emailSignup').on('input', function() {
        const email = $(this).val().trim();
        if (email === '') {
            limpiarErrorSignup($(this));
        } else if (!validarEmail(email)) {
            mostrarErrorSignup($(this), 'Escribe una dirección de correo electrónico válida.');
        } else {
            limpiarErrorSignup($(this));
        }
    });

    // Validación en tiempo real - Password 1 (con ojito)
    $('#regPassword').on('input', function() {
        const password = $(this).val();
        const $parent = $(this).parent();

        if (password.length > 0) {
            limpiarErrorSignup($(this));
        } else {
            limpiarErrorSignup($(this));
            $parent.find('.btn-toggle-password-reg').remove();
        }
    });

    // Validación en tiempo real - Password 2 (con ojito)
    $('#regPassword2').on('input', function() {
        const password2 = $(this).val();
        const $parent = $(this).parent();

        $parent.find('.btn-toggle-password-reg2').remove();

        if (password2.length > 0) {
            limpiarErrorSignup($(this));

        } else {
            limpiarErrorSignup($(this));
            $parent.find('.btn-toggle-password-reg2').remove();
        }
    });

    // Click en el botón Sign Up
    $(".btn-register").on("click", function () {
        limpiarTodosLosErroresSignup();

        const nombre = $('#nombre').val().trim();
        const apellido = $('#apellido').val().trim();
        const email = $('#emailSignup').val().trim();
        const password = $('#regPassword').val();
        const password2 = $('#regPassword2').val();
        const terms = $('#terms').is(':checked');
        let hayErrores = false;

        // Validar nombre
        if (nombre === '') {
            mostrarErrorSignup($('#nombre'), 'Por favor, completa este campo.');
            hayErrores = true;
        }

        // Validar apellido
        if (apellido === '') {
            mostrarErrorSignup($('#apellido'), 'Por favor, completa este campo.');
            hayErrores = true;
        }

        // Validar email
        if (email === '') {
            mostrarErrorSignup($('#emailSignup'), 'Por favor, completa este campo.');
            hayErrores = true;
        } else if (!validarEmail(email)) {
            mostrarErrorSignup($('#emailSignup'), 'Escribe una dirección de correo electrónico válida.');
            hayErrores = true;
        }

        // Validar password
        if (password === '') {
            mostrarErrorSignup($('#regPassword'), 'Por favor, completa este campo.');
            hayErrores = true;
        }

        // Validar confirmación de password
        if (password2 === '') {
            mostrarErrorSignup($('#regPassword2'), 'Por favor, confirma tu contraseña.');
            hayErrores = true;
        } else if (password !== password2) {
            mostrarErrorSignup($('#regPassword2'), 'Las contraseñas no coinciden.');
            hayErrores = true;
        }

        // Si hay errores, no continuar
        if (hayErrores) {
            return;
        }

        $formSignup.hide("slow");
        $errorSignup.hide("slow");
        $successSignup.hide("slow");

        $loadingSignup.fadeIn(500);

        setTimeout(function () {
            $loadingSignup.hide("slow");
            $successSignup.fadeIn(500);
        }, 1500);
    });

    // Botón volver en error
    $("#volverSignup").on("click", function () {
        $errorSignup.hide("slow");
        $formSignup.fadeIn(500);
        limpiarTodosLosErroresSignup();
    });
});