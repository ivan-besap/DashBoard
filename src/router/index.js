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
  console.log('Inicio de la verificación de autenticación');

   const authRequired = routeTo.matched.some(route => route.meta.authRequired);
 
   if (!authRequired) return next();
 
   const token = localStorage.getItem('jwt');
 
   if (!token) {
    console.log('No se encontró un token de autenticación. Redirigiendo al login');
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
 
    console.log(`Usuario autenticado con tipo de usuario ${userType}`);

     switch (userType) {
       case 'client':
         
         break;
       case 'company':
              
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
    console.log('Inicio de la resolución de rutas');

     for (const route of routeTo.matched) {
       await new Promise((resolve, reject) => {
         if (route.meta && route.meta.beforeResolve) {
           route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
             if (args.length) {
              console.log('Redirigiendo durante la resolución de rutas');
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

  console.log('Finalización de la resolución de rutas');
   document.title = routeTo.meta.title + ' | ' + appConfig.title;
   next();
 });
 
 export default router;
 