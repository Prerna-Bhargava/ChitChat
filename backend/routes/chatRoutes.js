const express = require('express');
const { accessChat, fetchChats, createGroupChat,removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect,createGroupChat)
router.route('/groupRemove').put(protect,removeFromGroup)
router.route('/groupUpdate').put(protect,addToGroup)


module.exports = router;