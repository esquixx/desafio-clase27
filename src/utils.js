import multer from 'multer'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { PRIVATE_KEY } from './config/config.js'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
export const uploader = multer({ storage })

export const createHash = password => 
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => 
    bcrypt.compareSync(password, user.password)

// JWT
export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy,  { session: false }, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.redirect('/jwt/login')
            }
            req.user = user
            next()
        }) (req, res, next)
    }
}  

export const passportCallCurrent = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                if (info && info.message === 'Token is not present') {
                    return res.status(401).json({ status: 'error',  error: 'Token is not present' })
                } else if (info && info.message === 'User with an active session does not exist') {
                    return res.status(401).json({ status: 'error', error: 'User with an active session does not exist' })
                } else {
                    return res.status(401).json({ status: 'error', error: 'Unauthorized' })
                }
            }
            req.user = user
            next()
        }) (req, res, next)
    }
} 



/* 
export const passportCall = strategy => async (req, res, next) => {
    try {
        const user = await passport.authenticate(strategy, { session: false })(req, res, next)
        if (!user) throw new Error('User not found')
        
        req.user = user
        next()
    } catch (error) {
        console.error('Passport authentication error:', error)
        return res.redirect('/api/jwt/login')
    }
} 

export const passportCallCurrent = strategy => async (req, res, next) => {
    try {
        const user = await passport.authenticate(strategy, { session: false })(req, res, next)
        if (!user) throw new Error('User not found')
        
        req.user = user
        next()
    } catch (error) {
        console.error('Passport authentication error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token expired' })
        }

        return res.status(401).json({ status: 'error', error: 'Unauthorized' })
    }
}  */