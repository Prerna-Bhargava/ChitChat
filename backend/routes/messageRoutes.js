const express = require('express')
const protect = require('../middlewares/authMiddleware')
const { sendMessage, getAllMessage, getAllNotifications, updateNotifications, deleteMsg } = require('../controllers/msgController')
const router = express.Router()

router.post('/',protect, sendMessage)
router.get('/:chatId',protect, getAllMessage)
router.get('/getAll/:userId',protect, getAllNotifications)
router.put('/updateNoti',protect, updateNotifications)
router.delete('/deleteMsg/:msgId',protect, deleteMsg)

module.exports = router
