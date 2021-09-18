import express from 'express';
import markoMiddleware from '@marko/express';
import Entrypoint from './views/www.marko';
import Stripe from 'stripe';
import cors from 'cors';
import User from './model/userModel'
import mongoose from 'mongoose'
// import dotenv from 'dotenv' 
const stripe = new Stripe('sk_test_0PVEGhvryaUeiiRZi7wXkoT800weCuNDAi');


const Assets = require( process.env.RAZZLE_ASSETS_MANIFEST )

const app = express();

// Connecting to server
mongoose.connect("mongodb+srv://joseph:test1234@cluster0.qqbea.mongodb.net/notebook?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex:true, useFindAndModify: true }).then(res=> console.log("connection success")).catch(err => console.log(err.message))
 
  
app
.disable('x-powered-by')
.use( markoMiddleware() ) // Enable res.marko
.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
.use(express.json())

const corsOptions = {
  origin:'*', 
  credentials:true, 
  optionSuccessStatus:200,
}
app.use(cors(corsOptions))

const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', cors(), async (req, res) => {
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
    console.log(error.status)
  }

});

// Authentication
app.post('/login', async(req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.find({email, password})
  
    if(user) res.send(user)
    
  } catch (err) {
    console.log(err.message);
  }
})

app.post('/signup', async(req, res) => {

  try {
    const user = await User.create(req.body)
  
    if(user) res.send(user)
    
  } catch (err) {
    console.log(err.message);  
  }
  
})


// Pages Route Handler
app.get('/*', (req, res) => {
  const scope = {
    title: 'Easybuy',
    Assets,
  }
  res.marko( Entrypoint, scope );
}); 


export default app;
 
