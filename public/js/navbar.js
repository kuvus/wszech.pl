const navbar = document.getElementById('top-nav')
let scrollTop = 0

function navChange(scrollTop) {
    if (scrollTop > 0) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.remove('scrolled')
    }
}

window.addEventListener('scroll', async () => {
    scrollTop = window.scrollY
    if (scrollActive === true) {
        await sleep(500)
        await navChange(scrollTop)
    } else await navChange(scrollTop)
})
