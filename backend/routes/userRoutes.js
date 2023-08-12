const express = require('express')
const {registerUser,authUser,getallUsers}  = require('../controllers/userControllers')
const protect = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/',registerUser)
router.post('/login',authUser)
router.get('/',protect, getallUsers)

module.exports = router
