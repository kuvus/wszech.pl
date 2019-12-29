const navbar = $('#top-nav')
const logo = $('#nav-logo')
function navChange() {
    if ($(window).scrollTop() > 0) {
        navbar.addClass('scrolled sticky-top')
        logo.src = '/img/icon.png'
        logo.height = '10px'
        // document.getElementById('header-logo').src = 'img/header-logo-sticky.png'
    } else {
        navbar.removeClass('scrolled sticky-top')
        logo.src = '/img/logo.png'
        // document.getElementById('header-logo').src = 'img/header-logo.png'
    }
}
$(window).on('scroll', async function() {
    if (scrollActive === true) {
        await sleep(500)
        await navChange()
    } else {
        await navChange()
    }
})
