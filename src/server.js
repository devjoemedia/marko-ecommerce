import express from 'express';
import markoMiddleware from '@marko/express';
import Entrypoint from './views/www.marko';
import Stripe from 'stripe';
const stripe = new Stripe('stripe_testkey');
const Assets = require( process.env.RAZZLE_ASSETS_MANIFEST )

const app = express();

 
  
app
.disable('x-powered-by')
.use( markoMiddleware() ) // Enable res.marko
.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
.use(express.json())


const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: YOUR_DOMAIN +'/login',
    cancel_url: YOUR_DOMAIN +'/signup',
  });

  res.redirect(303, session.url);

    
  } catch (error) {
    console.log(error)
  }

});
// Pages Route Handler
app.get('/*', (req, res) => {
  const scope = {
    title: 'Easybuy',
    Assets,
  }
  res.marko( Entrypoint, scope );
}); 


export default app;
 
