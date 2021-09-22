import express from 'express';
import markoMiddleware from '@marko/express';
import Entrypoint from './views/www.marko';
import Stripe from 'stripe';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import User from './model/userModel'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 


// Stripe config
const stripe = new Stripe(process.env.STRIPE_SECRET);

dotenv.config()

const Assets = require( process.env.RAZZLE_ASSETS_MANIFEST )

const app = express(); 
app.use(cookieParser())

// Connecting to server 
mongoose.connect(process.env.MONGO_URI,{ 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true, 
  useFindAndModify: true 
})
.then(res=> console.log("connection success"))
.catch(err => console.log(err.message))
 
  
app
.disable('x-powered-by')
.use( markoMiddleware() ) // Enable res.marko
.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
.use(express.json())

app.use(cors({origin: 'http://localhost:3000'}))

const HOST_URL = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: HOST_URL +'/checkout/success',
      cancel_url: HOST_URL +'/cart',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Easy-Buy-Mall',
            },
            unit_amount: parseInt(req.body.price * 100),
          },
          quantity: 1,
        },
      ],
      
    });
  
    res.status(200).json({ url: session.url });
    
  } catch (err) {
    res.status(500).json({ error: err })
  }
  
});

// Authentication
app.post('/login', async(req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    const validUser = await user.validatePassword(password, user.password)

    if(!validUser) res.status(403).json({ message: "invalid email or password" })
  
    // Create token
    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_TOKEN,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // set cookies with token
     res.cookie('jwt', token, { httpOnly: true });

    // return new user
    res.status(200).json({ 
      message: "success!",
      user: {
        id: user._id, 
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt
      }
    });
    
  } catch (err) {
    console.log(err.message);  
  }
})

app.post('/signup', async(req, res) => {
  try {
    const { email, password, name, confirmPassword } = req.body;

    const oldUser  = await User.findOne({ email });

    if(oldUser) {
      res.status(409).json({ message: "user already exist!" })
    }

    const user = await User.create({ name, email, password, confirmPassword } )
  
    // Create token
    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_TOKEN,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // set cookies with token
     res.cookie('jwt', token, { httpOnly: true });

    // return new user
    res.status(201).json({ 
      message: "user creatd!",
      user: {
        id: user._id, 
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt
      }
    });
    
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
 
