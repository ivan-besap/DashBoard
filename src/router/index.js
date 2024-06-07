import { createRouter, createWebHistory } from "vue-router";

import appConfig from "../../app.config";
import axios from 'axios';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

async function getUserData() {
  const endpoints = [
    { url: 'http://localhost:8080/api/clients/logins', role: 'CLIENT' },
    { url: 'http://localhost:8080/api/companies/logins', role: 'COMPANY' },
    { url: 'http://localhost:8080/api/employees/logins', role: 'EMPLOYEE' }
  ];

  for (let endpoint of endpoints) {
    try {
      let response = await axios.get(endpoint.url);
      console.log(`${endpoint.role} logged in:`, response.data);
      localStorage.setItem('userdata', JSON.stringify(response.data));
      localStorage.setItem('userid', response.data.id);
      localStorage.setItem('userrole', endpoint.role);
      return { role: endpoint.role, data: response.data };
    } catch (error) {
      console.log(`${endpoint.role} login failed:`, error);
    }
  }
  return null;
}

router.beforeEach(async (routeTo, routeFrom, next) => {
  const authRequired = routeTo.matched.some(route => route.meta.authRequired);
  const publicPages = ['/login', '/register', '/forgot-password'];

  if (!authRequired && publicPages.includes(routeTo.path)) {
    return next();
  }

  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');
  console.log('Authorization header set:', axios.defaults.headers.common['Authorization']);

  const loggedUser = JSON.parse(localStorage.getItem('userdata'));
  const userRole = localStorage.getItem('userrole');

  if (loggedUser && userRole) {
    redirectToRoleBasedRoute({ role: userRole, data: loggedUser }, routeTo, next);
  } else {
    const userData = await getUserData();
    if (userData) {
      redirectToRoleBasedRoute(userData, routeTo, next);
    } else {
      console.log('No user data, redirecting to login');
      next({ name: 'login', query: { redirectFrom: routeTo.fullPath } });
    }
  }
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              console.log('Redirected during beforeResolve');
              next(...args);
              reject(new Error('Redirected'));
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  } catch (error) {
    return;
  }
  document.title = routeTo.meta.title + ' | ' + appConfig.title;
  next();
});

function redirectToRoleBasedRoute(userData, routeTo, next) {
  const role = userData.role;
  if (role === 'CLIENT' && routeTo.meta.role !== 'CLIENT') {
    if (routeTo.path !== '/dashboard/crypto') {
      console.log('Redirecting to client dashboard');
      return next({ path: '/dashboard/crypto' });
    }
  } else if (role === 'COMPANY' && routeTo.meta.role !== 'COMPANY') {
    if (routeTo.path !== '/dashboard/analytics') {
      console.log('Redirecting to company dashboard');
      return next({ path: '/dashboard/analytics' });
    }
  } else if (role === 'EMPLOYEE' && routeTo.meta.role !== 'EMPLOYEE') {
    if (routeTo.path !== '/dashboard/nft') {
      console.log('Redirecting to employee dashboard');
      return next({ path: '/dashboard/nft' });
    }
  }
  next();
}

export default router;
