$(function () {
    const $form     = $(".login-container");
    const $loading  = $(".loading").hide();
    const $success  = $(".success").hide();
    const $error    = $(".error").hide();

    // Click en el botón Log In
    $(".btn-register").on("click", function () {
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
    });
});
