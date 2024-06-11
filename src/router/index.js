import { createRouter, createWebHistory } from "vue-router";

import appConfig from "../../app.config";
import axios from 'axios';
import routes from './routes';
import store from '@/state/store';

const router = createRouter({
  history: createWebHistory(),
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach(async (routeTo, routeFrom, next) => {
  const authRequired = routeTo.matched.some(route => route.meta.authRequired);

  if (!authRequired) return next();

  const token = localStorage.getItem('jwt');

  if (!token) {
    return next({ name: 'login', query: { redirectFrom: routeTo.fullPath } });
  }

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  try {
    const response = await axios.get('http://localhost:8080/user/current');
    const { userType, userData } = response.data;

    localStorage.setItem('userType', userType);
    localStorage.setItem('userData', JSON.stringify(userData));

    store.commit('auth/setUser', userData);
    store.commit('auth/setUserType', userType);

    switch (userType) {
      case 'client':
        // Lógica específica para clientes
        break;
      case 'company':
        // Lógica específica para compañías
        break;
      case 'employee':
        // Lógica específica para empleados
        break;
      default:
        // Manejo de caso por defecto
        break;
    }

    next();
  } catch (error) {
    console.error('Error durante la autenticación:', error);
    next({ name: 'login', query: { redirectFrom: routeTo.fullPath } });
  }
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              next(...args);
              reject(new Error('Redirigido'));
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

export default router;
