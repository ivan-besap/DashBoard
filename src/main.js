import 'aos/dist/aos.css';
import '@/assets/scss/config/corporate/app.scss';
import '@/assets/scss/mermaid.min.css';
import 'bootstrap/dist/js/bootstrap.bundle'

import AOS from 'aos';
import App from './App.vue';
import BootstrapVueNext from 'bootstrap-vue-next';
import VueApexCharts from "vue3-apexcharts";
import VueFeather from 'vue-feather';
import { createApp } from 'vue';
import i18n from './i18n';
import router from "./router";
import store from "./state/store";
import vClickOutside from "click-outside-vue3";
import { vMaska } from "maska"

// FakeBackend authentication
// import { configureFakeBackend } from './helpers/fake-backend';
// configureFakeBackend();


// Firebase authentication
// import { initFirebaseBackend } from './authUtils';

// const firebaseConfig = {
//     apiKey: process.env.VUE_APP_APIKEY,
//     authDomain: process.env.VUE_APP_AUTHDOMAIN,
//     databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
//     projectId: process.env.VUE_APP_PROJECTId,
//     storageBucket: process.env.VUE_APP_STORAGEBUCKET,
//     messagingSenderId: process.env.VUE_APP_MEASUREMENTID
// };

// initFirebaseBackend(firebaseConfig);



AOS.init({
    easing: 'ease-out-back',
    duration: 1000
});

createApp(App)
    .use(store)
    .use(router)
    .use(VueApexCharts)
    .use(BootstrapVueNext)
    .component(VueFeather.type, VueFeather)
    .directive("maska", vMaska)
    .use(i18n)
    .use(vClickOutside).mount('#app');