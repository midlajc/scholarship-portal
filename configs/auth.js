module.exports = {
    ensureUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.type === 'user') {
                next()
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    },
    ensureAdminAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.type === 'admin') {
                next()
            } else {
                res.redirect('/admin/login')
            }
        } else {
            res.redirect('/admin/login')
        }
    }
}