import SS from 'markojs-shared-state'
import axios from 'axios'

window.sharedState = new SS()

const initialState = {
    products:[],
    cart:[],
    loading: false,
}




axios.get('https://fakestoreapi.com/products?limit=6')
.then(data=> {
    
    const stateData = sharedState.getState('stateInfo')
    
    stateData.products = data.data 
}) 

sharedState.setState('stateInfo', initialState)

import App from './views/App.marko';
import Home from './views/pages/Home';
import Product from './views/pages/Product';
import Login from './views/pages/Login';
import Signup from './views/pages/Signup';
import Cart from './views/pages/Cart';
import NotFound from './views/pages/404'; 

export const Routes = [ 
    { name: 'home', path: '/', component: Home },
    { name: 'product', path: '/products/:id', component: Product },
    { name: 'signup', path: '/signup', component: Signup },
    { name: 'login', path: '/login', component: Login },
    { name: 'cart', path: '/cart', component: Cart },
    { name: '404', path: '/not-found', component: NotFound },
] 

App.renderSync({ Routes }).prependTo( document.querySelector('#app'));
