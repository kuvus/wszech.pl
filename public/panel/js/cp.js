$('.btn-d').click(function() {
    const type = $(this).attr('data-swal') ? $(this).attr('data-swal') : false
    const action = $(this).attr('data-swal') ? $(this).attr('data-stype') : false
    const domain = 'test' // TODO: zmień to
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
                        Swal.fire('Odnowiono!', `Pomyślnie odnowiono subdomenę ${domain}!`, 'success')
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
                        Swal.fire('Usunięto!', `Pomyślnie usunięto subdomenę ${domain}!`, 'success')
                    }
                })
                break
        }
    }
})
