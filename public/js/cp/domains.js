$('.btn-remove').click(function() {
    let domain = this.id.split('-')[2];
    // swal({
    //     html: true,
    //     title: `Usuwanie subdomeny ${domain}`,
    //     text: `Czy na pewno chcesz usunąć domenę <b>${this.id}</b>?<br>Jeśli tak, przepisz jej nazwę w polu niżej.`,
    //     content: {
    //         element: 'p',
    //         attributes: {
    //
    //         }
    //     },
    //     icon: "warning",
    //     buttons: {
    //         cancel: {
    //             text: "Anuluj",
    //             visible: true,
    //             className: "btn btn-success",
    //             closeModal: true
    //         },
    //         confirm: {
    //             text: "Usuń",
    //             value: true,
    //             visible: true,
    //             className: "btn btn-danger",
    //             closeModal: false
    //         }
    //     }
    // });
    Swal.fire({
        title: `Czy na pewno chcesz to zrobić?`,
        html: `Czy na pewno chcesz usunąć subdomenę <b>${domain}</b>?<br><b>Pamiętaj! Nie można tego cofnąć!</b>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tak, usuń!',
        cancelButtonText: 'Anuluj'
    }).then((result) => {
        if (result.value) {
            Swal.fire(
                'Usunięto!',
                'Twoja subdomena wkrótce zostanie usunięta!',
                'success'
            )
        }
    })
});