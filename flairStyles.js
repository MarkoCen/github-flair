(function (themes) {

    themes.default = {
        flair: {
            'box-sizing': 'border-box',
            'line-height': 'normal',
            display: 'flex',
            'align-items': 'center',
            width: '290px',
            height: '95px',
            color: '#555',
            position: 'relative',
            border: '2px solid #d1d5da',
            'border-radius': '3px',
            padding: '5px 10px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        },
        avatar: {
            'text-align': 'center',
            width: '75px',
            height: '75px',
            'margin-left': '5px'
        },
        avatarImg: {
            width: '100%',
            height: '100%',
            'border-radius': '50%'
        },
        githubCorner: {
            fill: '#d1d5da',
            color: '#fff',
            position: 'absolute',
            top: 0,
            right: 0,
            border: 0
        },
        info: {
            width: '160px',
            'text-align': 'right',
            'font-size': '14px'
        },
        name: {
            'font-weight': 'bold',
            'font-size': '16px'
        },
        textLink: {
            color: '#555'
        },
        star: {
            icon: '&#9733;',
            color: 'yellow'
        },
        gist: {
            icon: '&#9998;',
            color: 'black'
        },
        repo: {
            icon: '&#9776;',
            color: 'black'
        }
    }

})(window.flairThemes = {});