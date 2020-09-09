const responsePanel = document.getElementById('response-panel')
const responseIcon = document.getElementById('response-icon')
const responseTitle = document.getElementById('response-title')
const responseText = document.getElementById('response-text')
const responseBtn = document.getElementById('response-btn')
const captchaModal = document.getElementById('captchaModal')
const captchaForm = document.getElementById('captcha-form')
const captchaResponseBox = document.getElementById('captcha-response')

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const turnModal = (modalID, state, cancel) => {
    if (!modalID) return

    const modal = document.getElementById(modalID)

    if (state === 'show') {
        modal.style.display = 'block'
        modal.style.paddingRight = '17px'
        modal.className = 'modal fade show'

        document.body.classList.add('modal-open')
    } else {
        modal.style.display = 'none'
        modal.className = 'modal fade'

        document.body.classList.remove('modal-open')

        if (cancel) btnSwitch('check-button', 'success')
    }
}

const check = async (data) => {
    const captchaResponse = data.response.toLowerCase()
    if (!captchaResponse) {
        btnSwitch('check-button', 'error')
        responsePanel.classList.remove('d-none')
        responseIcon.innerHTML =
            '<i class="fal fa-times-circle text-danger"></i>'
        responseTitle.innerHTML = 'Wystąpił błąd przy sprawdzaniu!'
        responseText.innerHTML =
            'Captcha nie została wykonana, spróbuj ponownie.'
        responseBtn.classList.add('d-none')
    } else {
        if (captchaResponse === 'success') {
            if (data.exists) {
                btnSwitch('check-button', 'error')
                responsePanel.classList.remove('d-none')
                responseIcon.innerHTML =
                    '<i class="fal fa-times-circle text-danger"></i>'
                responseTitle.innerHTML =
                    'Ta subdomena jest już zarejestrowana!'
                responseText.innerHTML =
                    'Możesz poszukać innej subdomeny, która będzie pasowała do twojej strony!'
                responseBtn.classList.add('d-none')
            } else {
                btnSwitch('check-button', 'success')
                responsePanel.classList.remove('d-none')
                responseIcon.innerHTML =
                    '<i class="fal fa-check-circle text-success"></i>'
                responseTitle.innerHTML =
                    'Ta subdomena jest dostępna do rejestracji!'
                responseText.innerHTML =
                    'Możesz ją bezpłatnie zarejestrować w 5 minut! Wystarczy, że klikniesz poniższy przycisk i się zarejestrujesz!'
                responseBtn.classList.remove('d-none')
            }
        } else if (captchaResponse === 'captcha is not completed') {
            btnSwitch('check-button', 'error')
            responsePanel.classList.remove('d-none')
            responseIcon.innerHTML =
                '<i class="fal fa-times-circle text-danger"></i>'
            responseTitle.innerHTML = 'Wystąpił błąd przy sprawdzaniu!'
            responseText.innerHTML =
                'Captcha nie została wykonana, spróbuj ponownie.'
            responseBtn.classList.add('d-none')
        } else {
            btnSwitch('check-button', 'error')
            responsePanel.classList.remove('d-none')
            responseIcon.innerHTML =
                '<i class="fal fa-times-circle text-danger"></i>'
            responseTitle.innerHTML = 'Wystąpił błąd przy sprawdzaniu!'
            responseText.innerHTML =
                'Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.'
            responseBtn.classList.add('d-none')
        }
    }
}

const btnSwitch = async (btn, state) => {
    const button = document.getElementById(btn)
    if (state === 'success') {
        button.classList.remove('disabled', 'btn-danger', 'btn-warning')
        button.classList.add('btn-success')
        button.innerHTML = 'Sprawdź'
    } else if (state === 'check') {
        button.classList.remove('btn-success', 'btn-danger')
        button.classList.add('btn-warning', 'disabled')
        button.innerHTML = '<i class="fas fa-spinner fa-lg spin"></i>'
    } else {
        button.classList.remove('btn-success', 'disabled', 'btn-warning')
        button.classList.add('btn-danger')
        button.innerHTML = '<i class="fas fa-times fa-lg"></i>'
        await sleep(2000)
        await btnSwitch(button.id, 'success')
    }
}

let captchaCheck = false

function captchaCallback() {
    captchaCheck = true
}

function captchaExpiredCallback() {
    captchaCheck = false
    document.getElementById('captcha-response').innerHTML =
        '<div class="alert alert-danger" role="alert">Captcha wygasła. Wykonaj ją ponownie.</div>'
}

captchaModal.addEventListener('hide.bs.modal', async () => {
    btnSwitch('check-button', 'success')
    turnModal('captchaModal', 'hide')
})

captchaModal.addEventListener('show.bs.modal', async () => {
    turnModal('captchaModal', 'show')
})

document.querySelectorAll(`[data-dismiss*="modal"]`).forEach((el) => {
    console.log(el.dataset)
    el.addEventListener('click', (e) => {
        e.preventDefault()
        turnModal(el.dataset.dismissId, 'hide', true)
    })
})

document.getElementById('response-btn').addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href =
        window.location +
        'user/domains/create?domain=' +
        document.getElementById('check-input').value
})

const find = async () => {
    btnSwitch('check-button', 'check') // Change search button state

    const domain = document.getElementById('check-input').value // Assign input value to variable
    let error = {error: false} // Error message template

    if (!domain.match(/^([aA-zZ1-9])+$/g)) error = {error: true, type: 'regex'} // Check if domain passes regex
    if (domain.length < 2) error = {error: true, type: 'length'} // Check domain length

    if (error.error) {
        btnSwitch('check-button', 'error') // Change search button state
        responsePanel.classList.remove('d-none') // Display panel under search
        responseTitle.innerHTML = 'Wystąpił błąd przy sprawdzaniu!' // Add message to that panel
        responseIcon.innerHTML =
            '<i class="fal fa-times-circle text-danger"></i>'

        if (error.type === 'length') {
            responseText.innerHTML =
                'Subdomena, którą podałeś/aś jest za krótka! Minimalna długość, to: <b>2</b>.'
            responseBtn.classList.add('d-none')
            return false
        } else {
            responseText.innerHTML =
                'Subdomena, którą podałeś/aś zawiera niedozwolone znaki. (Dozwolone znaki A-Z, 1-9)'
            responseBtn.classList.add('d-none')
            return false
        }
    } else {
        turnModal('captchaModal', 'show')
        $('#modal-domain-input').val($('#check-input').val())
        document.getElementById(
            'modal-domain-input'
        ).value = document.getElementById('check-input').value
    }
}

document.getElementById('check-button').addEventListener('click', async () => {
    await find()
})

captchaForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!captchaCheck) {
        captchaResponseBox.classList.remove('d-none')
        captchaResponseBox.innerHTML =
            '<div class="alert alert-danger" role="alert">Captcha nie została zakończona. Spróbuj ponownie.</div>'
        return
    }

    turnModal('captchaModal', 'hide')

    const formData = new FormData(captchaForm)
    const searchParams = new URLSearchParams()

    for (let pair of formData) {
        searchParams.append(pair[0], pair[1])
    }

    await fetch('api/check', {
        method: 'POST',
        body: searchParams,
    })
        .then((response) => response.json())
        .then(async (data) => {
            await check(data)
            btnSwitch('check-button', 'success')
            captchaResponseBox.classList.add('d-none')
            captchaCheck = false
            grecaptcha.reset()
        })
        .catch(async () => {
            btnSwitch('check-button', 'error')
            responsePanel.classList.remove('d-none')
            responseTitle.innerHTML = 'Wystąpił błąd przy sprawdzaniu!'
            responseText.innerHTML =
                'Wystąpił niespodziewany błąd przy sprawdzaniu dostępności subdomeny. Spróbuj ponownie później.'
            responseBtn.classList.add('d-none')
            captchaCheck = false
            grecaptcha.reset()
        })

    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-toggle="tooltip"]').tooltip()
    })
})
