var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const stripeController = require('../controllers/stripeController');

dotenv.config();
const app = express();
const port = 4242;
// Middleware pour parser le JSON dans le body
app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res)  {
    res.render('stripe', { title: 'Paiement de la réservation', api_secret_key: process.env.PRIVATE_STRIPE_API_KEY, api_publishable_key: process.env.PUBLIC_STRIPE_API_KEY });
});

router.post('/create-payment-intent', (stripeController.postIntentPayment));

module.exports = router;
