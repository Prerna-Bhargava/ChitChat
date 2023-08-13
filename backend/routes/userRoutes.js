const express = require('express')
const {registerUser,authUser,getallUsers, isAuthenticated}  = require('../controllers/userControllers')
const protect = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/',registerUser)
router.post('/login',authUser)
router.get('/',protect, getallUsers)
router.get('/:token',isAuthenticated)

module.exports = router
