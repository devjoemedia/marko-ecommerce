import SS from 'markojs-shared-state'
import axios from 'axios' 

window.sharedState = new SS()
 
sharedState.setState('products', [])
sharedState.setState('cart', [])
sharedState.setState('cartCount', 0)
sharedState.setState('loading', false )
sharedState.setState('user', null )

const logedInUser = JSON.parse(localStorage.getItem('user'))
const cart = JSON.parse(localStorage.getItem('cart'))

if(cart) {
    sharedState.setState('cart', cart)
    sharedState.setState('cartCount', cart.length)
} 
if(logedInUser) sharedState.setState('user', logedInUser)

axios.get('https://fakestoreapi.com/products?limit=6')
.then( ({ data }) => sharedState.setState('products', data ) )



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
