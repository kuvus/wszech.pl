function parallaxImg(img, imgParent) {
    const speed = img.data('speed')
    const imgY = imgParent.offset().top
    const winY = $(this).scrollTop()
    const winH = $(this).height()
    const parentH = imgParent.innerHeight()

    const winBottom = winY + winH

    if (winBottom > imgY && winY < imgY + parentH) {
        const imgBottom = (winBottom - imgY) * speed
        const imgTop = winH + parentH
        var imgPercent = (imgBottom / imgTop) * 100 + (50 - speed * 50)
    }
    img.css({
        top: imgPercent + '%',
        transform: 'translate(-50%, -' + imgPercent + '%)',
    })
}
$('.img-parallax').each(function() {
    const img = $(this)
    const imgParent = $(this).parent()

    parallaxImg(img, imgParent)

    $(document).on({
        scroll: function() {
            parallaxImg(img, imgParent)
        },
        ready: function() {
            parallaxImg(img, imgParent)
        },
    })
})
