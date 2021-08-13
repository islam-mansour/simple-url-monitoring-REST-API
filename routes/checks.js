
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

const checkController = require('../controllers/checkController');

/**
 * @swagger
 * components:
 *  schemas:
 *      Check:
 *          type: object
 *          required:
 *              - name
 *              - url
 *          properites:
 *              id:
 *                  type: string
 *                  description: the auto generated id for the check
 *              name:
 *                  type: string
 *                  description: name of the check
 *              url:
 *                  type: string
 *                  description: url that will be monitored
 *              protocal:
 *                  type: string
 *                  description: the protocel will be used
 *              path:
 *                  type: string
 *                  description: the specific path to check on the url
 *              port:
 *                  type: string
 *                  desctiption: the port to hit on when calling the url
 *              webhock:
 *                  type: string
 *                  description: url to send notification for when url goes up/down
 *              timeout:
 *                  type: number
 *                  description: the timeout of the polling request 
 *              interval:
 *                  type: number
 *                  description: The time interval for polling requests
 *              theshold:
 *                  type: number
 *                  descrioption: he threshold of failed requests that will create an alert
 *              authentication:
 *                  type: object
 *                  description: An HTTP authentication header, with the Basic scheme, to be sent with the polling request
 *              httpHeaders:
 *                  type: array
 *                  description: A list of key/value pairs custom HTTP headers to be sent with the polling request
 *          example:
 *              id: d5fea7
 *              name: example
 *              url: www.example.com
 *              protocal: https
 *              port: 345
 *              webhock: https://hooks.example.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
 *              timeout: 5
 *              interval: 5
 *              threshold: 3
 *              authentication: {user: john, pass: 1234}
 *              httpHeaders: [{content-type application/json}]
 * 
 */


router.get('/', checkController.getAll);

router.get('/:id', checkController.getOne);

router.post('/', checkController.register);

router.put('/:id', checkController.update);

router.delete('/:id', checkController.delete);


module.exports = router;