const getError = (err, type) => {
    if (type) {
        switch (type) {
            case 'captcha':
                break
        }
    }
    return {error: true, message: err}
}
