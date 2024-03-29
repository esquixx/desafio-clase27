import { generateToken } from '../utils.js'
import { SIGNED_COOKIE_KEY } from '../config/config.js'

export const userRegisterController = async (req, res) => {
    res.redirect('/api/jwt/login')
}

export const failRegisterController = (req, res) => {
    res.render('errors/errorPage', { status: 'error', error: 'Failed Register!' })
}

export const viewRegisterController = (req, res) => {
    res.render('sessions/register')
}

export const userLoginController = (req, res) => {
    const user = req.user
    const access_token = generateToken(user)
    res.cookie(SIGNED_COOKIE_KEY, access_token, { signed: true }).redirect('/products')
}

export const failLoginController = (req, res) => {
    res.render('errors/errorPage', { status: 'error', error: 'Invalid Credentials' })
}

export const viewLoginController = (req, res) => {
    res.render('sessions/login')
}

export const loginGithubController = async (req, res) => {}

export const githubCallbackController = async (req, res) => {
    const access_token = req.authInfo.token
    res.cookie(SIGNED_COOKIE_KEY, access_token, { signed: true }).redirect('/products')
}

export const userLogoutController = (req, res) => {
    res.clearCookie(SIGNED_COOKIE_KEY).redirect('/api/jwt/login')
}

export const errorPageController = (req, res) => {
    res.render('errors/errorPage')
}

export const userCurrentController = (req, res) => {
    const user = req.user
    res.render('sessions/current', { user })
}
