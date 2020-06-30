const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// API response handling
const check = async data => {
    const response = data
    switch (response.response.toLowerCase()) {
        case 'success':
            switch (response.exists) {
                case true:
                    btnSwitch('check-button', 'error')
                    $('#response-panel').removeClass('d-none')
                    $('#response-icon').html(
                        '<i class="fal fa-times-circle text-danger"></i>'
                    )
                    $('#response-title').html(
                        'Ta subdomena jest już zarejestrowana!'
                    )
                    $('#response-text').html(
                        'Możesz poszukać innej subdomeny, która będzie pasowała do twojej strony!'
                    )
                    $('#response-btn').addClass('d-none')
                    break
                case false:
                    btnSwitch('#check-button', 'success')
                    $('#response-panel').removeClass('d-none')
                    $('#response-icon').html(
                        '<i class="fal fa-check-circle text-success"></i>'
                    )
                    $('#response-title').html(
                        'Ta subdomena jest dostępna do rejestracji!'
                    )
                    $('#response-text').html(
                        'Możesz ją bezpłatnie zarejestrować w 5 minut! Wystarczy, że klikniesz poniższy przycisk i się zarejestrujesz!'
                    )
                    $('#response-btn').removeClass('d-none')
                    break
            }
            break
        case 'captcha is not completed':
            btnSwitch('#check-button', 'error')
            $('#response-panel').removeClass('d-none')
            $('#response-title').html('Wystąpił błąd przy sprawdzaniu!')
            $('#response-text').html(
                'Captcha nie została wykonana, spróbuj ponownie.'
            )
            $('#response-btn').addClass('d-none')
            break
        default:
            btnSwitch('#check-button', 'error')
            $('#response-panel').removeClass('d-none')
            $('#response-title').html('Wystąpił błąd przy sprawdzaniu!')
            $('#response-text').html(
                'Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.'
            )
            $('#response-btn').addClass('d-none')
            break
    }
}

// Search button state changer
const btnSwitch = async (btn, state) => {
    btn = $(btn)
    switch (state) {
        case 'success':
            btn.removeClass('disabled btn-danger btn0warning')
            btn.addClass('btn-success')
            btn.html('Sprawdź')
            break
        case 'check':
            btn.removeClass('btn-success btn-danger')
            btn.addClass('btn-warning disabled')
            btn.html('<i class="fas fa-spinner fa-lg spin"></i>')
            break
        case 'error':
            btn.removeClass('btn-success btn-warning disabled')
            btn.addClass('btn-danger')
            btn.html('<i class="fas fa-times fa-lg"></i>')
            await sleep(2000)
            btnSwitch(btn, 'success')
            break
    }
}

// Captcha callback
let captchaCheck = false
function captchaCallback() {
    captchaCheck = true
}

function captchaExpiredCallback() {
    captchaCheck = false
    $('#captcha-response').html(
        '<div class="alert alert-danger" role="alert">Captcha wygasła. Wykonaj ją ponownie.</div>'
    )
}

$('#captchaModal').on('hide.bs.modal', () => {
    btnSwitch('#check-button', 'success')
})

// Basket
$('#response-btn').click(e => {
    e.preventDefault()
    Cookies.set('wszech-basket', $('#check-input').val(), {expires: 2})
    window.location.href =
        window.location +
        'user/domains/create?domain=' +
        $('#check-input').val()
})

const find = async () => {
    btnSwitch('#check-button', 'check') // Change search button state

    let domain = $('#check-input').val() // Assign input value to variable
    let error = {error: false} // Error message template

    if (!domain.match(/^([aA-zZ1-9])+$/g)) error = {error: true, type: 'regex'} // Check if domain passes regex
    if (domain.length < 2) error = {error: true, type: 'length'} // Check domain length

    if (error.error) {
        btnSwitch('#check-button', 'error') // Change search button state
        $('#response-panel').removeClass('d-none') // Display panel under search
        $('#response-title').html('Wystąpił błąd przy sprawdzaniu!') // Add message to that panel
        switch (error.type) {
            case 'length':
                $('#response-text').html(
                    'Subdomena, którą podałeś/aś jest za krótka! Minimalna długość, to: <b>2</b>.'
                )
                $('#response-btn').addClass('d-none')
                return false
            case 'regex':
                $('#response-text').html(
                    'Subdomena, którą podałeś/aś zawiera niedozwolone znaki. (Dozwolone znaki A-Z, 1-9)'
                )
                $('#response-btn').addClass('d-none')
                return false
        }
    } else {
        $('#captchaModal').modal('show')
        $('#modal-domain-input').val($('#check-input').val())
    }
}

$('#check-button').click(async () => {
    await find()
})

$('#captcha-form').submit(e => {
    if (!captchaCheck) {
        $('#captcha-response').removeClass('d-none')
        $('#captcha-response').html(
            '<div class="alert alert-danger" role="alert">Captcha nie została zakończona. Spróbuj ponownie.</div>'
        )
        e.preventDefault()
        return
    }
    e.preventDefault()
    $('#captchaModal').modal('hide')

    $.ajax({
        type: 'POST',
        url: 'api/check',
        data: $('#captcha-form').serialize(),
    })
        .done(async data => {
            await check(data)
            btnSwitch('#check-button', 'success')
            $('#captcha-response').addClass('d-none')
            captchaCheck = false
            grecaptcha.reset()
        })
        .fail(async () => {
            btnSwitch('#check-button', 'error')
            $('#response-panel').removeClass('d-none')
            $('#response-title').html('Wystąpił błąd przy sprawdzaniu!')
            $('#response-text').html(
                'Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.'
            )
            $('#response-btn').addClass('d-none')
            captchaCheck = false
            grecaptcha.reset()
        })
})
$(document).ready(() => {
    $('[data-toggle="tooltip"]').tooltip()
    // $(window).scroll(function() {
    //     $('#top-nav').toggleClass('scrolled')
    // })
    // $(window).scroll(function() {
    //     let scroll = $(window).scrollTop()
    //     if (scroll < 300) {
    //         $('#top-nav')
    //             .toggleClass('scrolled')
    //             .toggleClass('sticky-top')
    //         console.log('aaa')
    //     } else {
    //         $('#top-nav')
    //             .toggleClass('scrolled')
    //             .toggleClass('sticky-top')
    //         console.log('bbb')
    //     }
    // })
    // $('#check-button').click(async () => {
    //     $('#check-button').click(function () {
    //         btnSwitch('#check-button','check');
    //
    //         let domain = $('#check-input').val();
    //
    //         let error = {"error": false};
    //
    //         if (!domain.match(/^([aA-zZ1-9])+$/g)) error = {"error": true, "type": "regex"};
    //
    //         if (domain.length < 2) error = {"error": true, "type": "length"};
    //
    //         if (error.error) {
    //             btnSwitch('#check-button','error');
    //             $('#response-panel').removeClass('d-none');
    //             $('#response-title').html('Wystąpił błąd przy sprawdzaniu!');
    //             switch (error.type) {
    //                 case 'length':
    //                     $('#response-text').html('Subdomena, którą podałeś/aś jest za krótka! Minimalna długość, to: <b>2</b>.');
    //                     $('#response-btn').addClass('d-none');
    //                     return false;
    //                 case 'regex':
    //                     $('#response-text').html('Subdomena, którą podałeś/aś zawiera niedozwolone znaki. (Dozwolone znaki A-Z, 1-9)');
    //                     $('#response-btn').addClass('d-none');
    //                     return false;
    //             }
    //         } else {
    //             $('#modal-domain-input').val($('#check-input').val());
    //         }
    //     });
    // });
})
