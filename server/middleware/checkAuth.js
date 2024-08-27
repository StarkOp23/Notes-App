exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        return res.status(401).send(`
            <html>
            <head>
                <title>404 Page Not Found</title>
            </head>
            <body style="text-align: center;">
                <h1>Access Denied</h1>
                <img src="https://t4.ftcdn.net/jpg/01/35/75/99/360_F_135759975_8jLV7hjXaNd9OAXqQdUQ3dj0LgxXPHqO.jpg" alt="401 Image" />
            </body>
        </html>
            `);

    }
}