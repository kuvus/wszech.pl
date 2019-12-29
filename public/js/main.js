function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function check(data) {
    let response = JSON.parse(data);
    if (response.response === "Success") {
        switch (response.exists) {
            case true:
                btnSwitch($("#check-button"),'error');
                $('#response-panel').removeClass('d-none');
                $('#response-title').html('Ta subdomena jest już zarejestrowana!');
                $('#response-text').html('Możesz poszukać innej subdomeny, która będzie pasowała do twojej strony!')
                $('#response-btn').addClass('d-none');
                break;
            case false:
                btnSwitch($("#check-button"),'success');
                $('#response-panel').removeClass('d-none');
                $('#response-title').html('Ta subdomena jest dostępna do rejestracji!');
                $('#response-text').html('Możesz ją bezpłatnie zarejestrować w 5 minut! Wystarczy, że klikniesz poniższy przycisk i się zarejestrujesz!')
                $('#response-btn').removeClass('d-none');
                break;
        }
    } else if (response.response === "Captcha is not completed") {
        btnSwitch($("#check-button"),'error');
        $('#response-panel').removeClass('d-none');
        $('#response-title').html('Wystąpił błąd przy sprawdzaniu!');
        $('#response-text').html('Captcha nie została wykonana, spróbuj ponownie.');
        $('#response-btn').addClass('d-none');
    }
    else {
        btnSwitch($("#check-button"),'error');
        $('#response-panel').removeClass('d-none');
        $('#response-title').html('Wystąpił błąd przy sprawdzaniu!');
        $('#response-text').html('Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.');
        $('#response-btn').addClass('d-none');
    }
}
async function btnSwitch(btn, state) {
    switch (state) {
        case 'error':
            btn.removeClass('btn-success');
            btn.addClass('btn-danger');
            btn.removeClass('disabled');

            btn.removeClass('btn-warning');
            btn.addClass('btn-danger');
            btn.html('<i class="fas fa-times fa-lg"></i>');
            btn.removeClass('disabled');

            await sleep(2000);
            btn.remove('btm-danger');
            btn.addClass('btn-success');
            await btn.html('Sprawdź');
            break;
        case 'check':
            if (btn.hasClass('btn-success')) {
                btn.removeClass('btn-success');
                btn.addClass('btn-warning disabled');
                btn.html('<i class="fas fa-spinner fa-lg spin"></i>');
            } else if (btn.hasClass('btn-danger')) {
                btn.removeClass('btn-danger');
                btn.addClass('btn-warning disabled');
                btn.html('<i class="fas fa-spinner fa-lg spin"></i>');
            }
            break;
        case 'success':
            if (btn.hasClass('btn-danger')) {
                btn.removeClass('disabled');
                btn.removeClass('btn-danger');
                btn.addClass('btn-success');
                btn.html('Sprawdź');
            } else if (btn.hasClass('btn-warning')) {
                btn.removeClass('btn-danger disabled');
                btn.addClass('btn-success');
                btn.html('Sprawdź');
            }
            break;
    }
}

function randomBg() {
    const rand = Math.floor(Math.random() * 7) + 1;
    $('#header').css('background-image', `url('/static/img/bg/${rand}.jpg')`);
}

var captchaCheck = false;
function captchaCallback() {
    captchaCheck = true;
}

$(document).ready(function(){
    randomBg();
    $('[data-toggle="tooltip"]').tooltip();
    $('.navbar-toggler').first().click(function() {
        if ($('#nav').hasClass('bg-none')) {
            $('#nav').addClass('bg-dark');
            $('#nav').removeClass('bg-none');
        } else {
            $('#nav').addClass('bg-none');
            $('#nav').removeClass('bg-dark');
        }
    });

    $('#captchaModal').on('hide.bs.modal', function (e) {
        btnSwitch($("#check-button"),'success');
        $("#check-button").html('Sprawdź');
    });

    $('#check-button').click(function () {
        btnSwitch($("#check-button"),'check');

        let domain = $('#check-input').val();

        let error = {"error": false};

        if (!domain.match(/^([aA-zZ1-9])+$/g)) error = {"error": true, "type": "regex"};

        if (domain.length < 2) error = {"error": true, "type": "length"};

        if (error.error) {
            btnSwitch($("#check-button"),'error');
            $('#response-panel').removeClass('d-none');
            $('#response-title').html('Wystąpił błąd przy sprawdzaniu!');
            switch (error.type) {
                case 'length':
                    $('#response-text').html('Subdomena, którą podałeś/aś jest za krótka! Minimalna długość, to: <b>2</b>.');
                    $('#response-btn').addClass('d-none');
                    return false;
                case 'regex':
                    $('#response-text').html('Subdomena, którą podałeś/aś zawiera niedozwolone znaki. (Dozwolone znaki A-Z, 1-9)');
                    $('#response-btn').addClass('d-none');
                    return false;
            }
        } else {
            $('#modal-domain-input').val($('#check-input').val());
        }
    });

    $('#captcha-form').submit(function(e) {
        if (!captchaCheck) {
            $('#captcha-response').removeClass('d-none');
            $('#captcha-response').html('<div class="alert alert-danger" role="alert">Captcha nie została zakończona. Spróbuj ponownie.</div>');
            e.preventDefault();
            return;
        }
        e.preventDefault();
        $('#captchaModal').modal('hide');
        $.ajax({
            type: "POST",
            url: "system/get.php",
            data: $(this).serialize()
        }).done(function(data) {
            check(data);
            btnSwitch($("#check-button"),'success');
            $('#captcha-response').addClass('d-none');
            captchaCheck = false;
            grecaptcha.reset();
        }).fail(function( jqXHR, textStatus ) {
            btnSwitch($("#check-button"),'error');
            $('#response-panel').removeClass('d-none');
            $('#response-title').html('Wystąpił błąd przy sprawdzaniu!');
            $('#response-text').html('Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.');
            $('#response-btn').addClass('d-none');
        });
    });

    $('#response-btn').click(function () {
        Cookies.set('wszech-basket', $('#check-input').val(), { expires: 2 })
    });
});

