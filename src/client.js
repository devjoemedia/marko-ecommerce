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
