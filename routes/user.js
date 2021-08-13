
const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController');
const checkController = require('../controllers/checkController');


/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 *          properites:
 *              id:
 *                  type: string
 *                  description: the auto generated id for the user
 *              first_name:
 *                  type: string
 *                  description: user's first name
 *              last_name:
 *                  type: string
 *                  description: user's last name
 *              email:
 *                  type: string
 *                  description: user's email
 *              password:
 *                  type: string
 *                  description: user's password
 *              token:
 *                  type: string
 *                  desctiption: JWT token
 *              verified:
 *                  type: boolean
 *                  description: true when user verifies his email
 *          example:
 *              id: d5fea7
 *              first_name: john
 *              last_name: doe
 *              email: john_doe@example.com
 *              password: 12345
 *              verified: true
 *              token: asd548a88w98sds4d798
 * 
 */


/**
 * /register
 *  post:
 *      summary: Register new user
 *      responses:
 *          201:
 *              description: Created
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          
 *       
 */
router.post("/register", userController.register);

router.post("/login", userController.login);

router.get('/send', userController.send);

router.get('/verify', userController.verify);


module.exports = router;