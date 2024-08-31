const express = require('express');
const Menu = require('../models/Menu');
const router = express.Router();

const menuController = require('../controllers/menuControllers')

const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
 

// get all menu items
router.get('/', menuController.getAllMenuItems);

// post a menu item
router.post('/', verifyToken, verifyAdmin, menuController.postMenuItem);

// delete a menu item
router.delete('/:id',verifyToken, verifyAdmin, menuController.deleteMenu);

// get a single menu item
router.get('/:id', menuController.singleMenuItem);

// update a menu item
router.patch('/:id',verifyToken, verifyAdmin, menuController.updateMenuItem);

 
module.exports = router;