import passport from 'passport'
import appRouter from './router.js'
import { passportCallCurrent } from '../utils.js'
import {
    userRegisterController,
    failRegisterController,
    viewRegisterController,
    userLoginController,
    failLoginController,
    viewLoginController,
    loginGithubController,
    githubCallbackController,
    userLogoutController,
    errorPageController,
    userCurrentController
} from '../controllers/userJWT.controller.js'

export default class JWTRouter extends appRouter {
    init() {
        this.post('/register', ['PUBLIC'], passport.authenticate('register', { session: false, failureRedirect: '/api/jwt/failRegister' }), userRegisterController)

        this.get('/failRegister', ['PUBLIC'], failRegisterController)

        this.get('/register', ['PUBLIC'], viewRegisterController)

        this.post('/login', ['PUBLIC'], passport.authenticate('login', { session: false, failureRedirect: '/api/jwt/failLogin' }), userLoginController)

        this.get('/failLogin', ['PUBLIC'], failLoginController)

        this.get('/login', ['PUBLIC'], viewLoginController)

        this.get('/github', ['PUBLIC'], passport.authenticate("github", { scope: ["user:email"] }), loginGithubController)

        this.get('/githubcallback', ['PUBLIC'], passport.authenticate("github", { session: false }), githubCallbackController)

        this.get('/logout', ['PUBLIC'], userLogoutController)

        this.get('/error', ['PUBLIC'], errorPageController)

        this.get('/current', ['PUBLIC'], passportCallCurrent('current'), userCurrentController)
    }
}