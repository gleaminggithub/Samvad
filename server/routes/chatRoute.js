const express = require('express');
const router = express.Router();
const { accessChat , fetchChat , createGroupChat ,fetchGroups,exitGroup,addSelf} = require('../controllers/chatController');

// Define the routes
router.post('/',accessChat);
router.get('/fetchChat/:id', fetchChat);
router.post('/createGroup',createGroupChat);
router.get('/fetchGroups', fetchGroups);
router.post('/exitGroup',exitGroup);
router.put('/addSelf', addSelf);
module.exports = router;
