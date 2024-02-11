const express = require('express')
const userController = require('../Controllers/userController')
const authController = require('../Controllers/authController')

const Router = express.Router()
Router.post('signup', authController.signup)

Router.route('/').get(userController.allUsers)
// router.route('/update').patch(userController.update)
module.exports = Router