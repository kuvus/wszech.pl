const navbar = $('#top-nav')
const logo = $('#nav-logo')
function navChange() {
    if ($(window).scrollTop() > 0) {
        navbar.addClass('scrolled sticky-top')
        logo.src = '/img/icon.png'
        logo.height = '10px'
    } else {
        navbar.removeClass('scrolled sticky-top')
        logo.src = '/img/logo.png'
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
