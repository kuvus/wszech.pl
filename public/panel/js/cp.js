const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/

$('.btn-d').click(function() {
    const type = $(this).data('swal') ? $(this).data('swal') : false
    const action = $(this).data('swal') ? $(this).data('stype') : false
    const domain = $(this).data('dname')
    if (type) {
        switch (action) {
            case 'renew':
                Swal.fire({
                    title: 'Czy jesteś tego pewien?',
                    html: `Czy na pewno chcesz odnowić subdomenę <b>${domain}</b>?<br>Pamiętaj, że można odnowić <b>tylko jedną</b> subdomenę dziennie!`,
                    type: 'warning',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Dajesz!',
                    cancelButtonText: 'Nie, dzięki',
                    confirmButtonColor: '#14b036',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.value) {
                        Swal.fire({
                            title: 'Trwa odnawianie subdomeny',
                            html: ``,
                            type: 'info',
                            showCloseButton: false,
                            showCancelButton: false,
                            showConfirmButton: false,
                        })
                        $.ajax({
                            type: 'POST',
                            url: '/api/renew',
                            data: {domain},
                        })
                            .done(async data => {
                                if (data.error) {
                                    Swal.fire(
                                        'Wystąpił błąd',
                                        `${data.response}`,
                                        'error'
                                    )
                                } else {
                                    Swal.fire(
                                        'Odnowiono!',
                                        `Pomyślnie odnowiono subdomenę ${domain}!`,
                                        'success'
                                    ).then(() => location.reload())
                                }
                            })
                            .fail(async () => {
                                Swal.fire(
                                    'Wystąpił błąd',
                                    `Podczas odnawiania subdomeny wystąpił błąd. Skontaktuj się z administratorem.`,
                                    'error'
                                )
                            })
                    }
                })
                break
            case 'delete':
                Swal.fire({
                    title: 'Czy jesteś tego pewien?',
                    html: `Czy na pewno chcesz usunąć subdomenę <b>${domain}</b>?<br>Pamiętaj, że <b>nie można</b> tego cofnąć!`,
                    type: 'warning',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Jedziem z tym koksem!',
                    cancelButtonText: 'Nie, dzięki',
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#14b036',
                }).then(result => {
                    if (result.value) {
                        let domainId = $(this).data('did')
                        $.post('/api/deleteDomain', {
                            domainId,
                        })
                            .done(response => {
                                if (response.error) {
                                    Swal.fire(
                                        'Wystąpił błąd',
                                        `${response.response}.`,
                                        'error'
                                    )
                                } else {
                                    Swal.fire(
                                        'Usunięto!',
                                        `Pomyślnie usunięto subdomenę ${domain}!`,
                                        'success'
                                    ).then(() => location.reload())
                                }
                            })
                            .fail(async () => {
                                Swal.fire(
                                    'Wystąpił błąd',
                                    `Podczas usuwania subdomeny wystąpił błąd. Skontaktuj się z administratorem.`,
                                    'error'
                                )
                            })
                    }
                })
                break
        }
    }
})

$('#registerCheck').click(function(e) {
    e.preventDefault()
    if (!$('#domainName').val().length > 0) {
        $('#stepOneError').removeClass('d-none')
        $('#stepOneError').text('Nie podałeś żadnej subdomeny.')
    } else {
        let domain = $('#domainName').val()
        $.post('/api/registerCheck', {domain}).done(response => {
            if (response.exists) {
                $('#stepOneError').removeClass('d-none')
                $('#stepOneError').text('Podana subdomena już istnieje.')
            } else {
                $('#collapseStepOne').collapse('hide')
                $('#collapseStepTwo').collapse('show')
                $('#subdomainConfirm').html(`${domain}<i>.wszech.pl</i>`)
                $('#cardOne').removeClass('card-primary')
                $('#cardOne').addClass('card-secondary')
                $('#cardTwo').removeClass('card-secondary')
                $('#cardTwo').addClass('card-primary')
            }
        })
    }
})
$('#stepTwoConfirm').click(function(e) {
    e.preventDefault()
    let recordType = $('#recordType')
    let recordValue = $('#recordValue')
    const stepTwoError = $('#stepTwoError')
    if (recordType.val() === 'none') {
        stepTwoError.removeClass('d-none')
        return stepTwoError.text('Nie wybrałeś typu wpisu.')
    }
    if (recordValue.val().length < 1) {
        stepTwoError.removeClass('d-none')
        return stepTwoError.text('Nie podałeś wartości wpisu.')
    }
    if (recordType.val() === 'A') {
        if (!ipRegex.test($('#recordValue').val())) {
            stepTwoError.removeClass('d-none')
            return stepTwoError.text(
                'Wpis typu A musi mieć wartość będącą adresem IP.'
            )
        }
    }
    $('#collapseStepTwo').collapse('hide')
    $('#collapseStepThree').collapse('show')
    $('#recordConfirm').html(
        `<p>Typ: ${recordType.val()}<br>Wartość: ${recordValue.val()}</p>`
    )
    $('#cardTwo').removeClass('card-primary')
    $('#cardTwo').addClass('card-secondary')
    $('#cardThree').removeClass('card-secondary')
    $('#cardThree').addClass('card-primary')
})
$('#formBackToOne').click(function() {
    $('#collapseStepOne').collapse('show')
    $('#collapseStepTwo').collapse('hide')
    $('#cardTwo').removeClass('card-primary')
    $('#cardTwo').addClass('card-secondary')
    $('#cardOne').removeClass('card-secondary')
    $('#cardOne').addClass('card-primary')
})
$('#formBackToTwo').click(function() {
    $('#collapseStepTwo').collapse('show')
    $('#collapseStepThree').collapse('hide')
    $('#cardThree').removeClass('card-primary')
    $('#cardThree').addClass('card-secondary')
    $('#cardTwo').removeClass('card-secondary')
    $('#cardTwo').addClass('card-primary')
})
$('#subdomainRegistrationFinalSubmit').click(function(e) {
    e.preventDefault()
    if (!$('#domainName').val().length > 0) {
        $('#stepOneError').removeClass('d-none')
        $('#stepOneError').text('Nie podałeś żadnej subdomeny.')
    } else {
        const domain = $('#domainName').val()
        const type = $('#recordType').val()
        const record = $('#recordValue').val()
        const terms = $('#terms').prop('checked') == true
        const proxied = $('#proxy').prop('checked') == true

        if (!terms) {
            $('#stepThreeError').removeClass('d-none')
            $('#stepThreeError').text('Nie zaakcpetowałeś regulaminu.')
            return
        }

        $.post('/api/register', {domain, type, record, terms, proxied}).done(
            response => {
                if (response.error) {
                    $('#stepThreeError').removeClass('d-none')
                    $('#stepThreeError').text(response.response)
                } else {
                    $('#stepThreeError').addClass('d-none')
                    $('#stepThreeSuccess').removeClass('d-none')
                    $('#stepThreeSuccess').html(response.response)
                }
            }
        )
    }
})

$('.btn-manage-dns').click(function() {
    let domain = $(this)
        .data('dname')
        .replace('.wszech.pl', '')
    let ID = $(this).data('did')
    $('#domain-ID').val(ID)
    $('#zoneEditorType').val(domains[domain]['recordType'])
    $('#zoneEditorContent').val(domains[domain]['record'])
    $('#domain-name').val(domain)
    $('#proxy').prop('checked', domains[domain]['proxied'])
    if (
        domains[domain]['recordType'] === 'A' ||
        domains[domain]['recordType'] === 'CNAME'
    )
        document.getElementById('proxyCheck').classList.remove('d-none')
})

$('#domain-update').click(function() {
    let dnsType = $('#zoneEditorType').val()
    let dnsRecord = $('#zoneEditorContent').val()
    let proxied = $('#proxy').prop('checked') ? 1 : 0
    let domainId = $('#domain-ID').val()
    let domainName = $('#domain-name').val()
    Swal.fire({
        title: 'Trwa modyfikowanie subdomeny',
        html: ``,
        type: 'info',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
    })
    $.post('/api/updateDomain', {
        dnsType,
        dnsRecord,
        proxied,
        domainId,
        domainName,
    })
        .done(async data => {
            if (data.error) {
                Swal.fire('Wystąpił błąd', `${data.response}`, 'error')
            } else {
                Swal.fire(
                    'Udało się!',
                    `Pomyślnie zmodyfikowano subdomenę!`,
                    'success'
                ).then(() => location.reload())
            }
        })
        .fail(async () => {
            Swal.fire(
                'Wystąpił błąd',
                `Podczas modyfikacji subdomeny wystąpił błąd. Skontaktuj się z administratorem.`,
                'error'
            )
        })
})

if (document.getElementById('recordType'))
    document.getElementById('recordType').addEventListener('input', e => {
        if (
            e.srcElement.value.toLowerCase() === 'a' ||
            e.srcElement.value.toLowerCase() === 'cname'
        ) {
            document.getElementById('proxyCheck').classList.remove('d-none')
        } else {
            document.getElementById('proxyCheck').classList.add('d-none')
        }
    })

if (document.getElementById('zoneEditorType'))
    document.getElementById('zoneEditorType').addEventListener('input', e => {
        if (
            e.srcElement.value.toLowerCase() === 'a' ||
            e.srcElement.value.toLowerCase() === 'cname'
        ) {
            document.getElementById('proxyCheck').classList.remove('d-none')
        } else {
            document.getElementById('proxyCheck').classList.add('d-none')
        }
    })

document.getElementById('notifications').addEventListener('click', e => {
    $.post('/api/readNotifications', {
        notificationID: 'all',
    })
})
