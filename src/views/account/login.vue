<script>


import {
  required,
  email,
  helpers
} from "@vuelidate/validators";
import axios from 'axios';
import Swal from "sweetalert2";

import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";


export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      processing: false,
      showPassword: false,
      rememberMe: false,
    };
  },
  validations: {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Please enter valid email", email),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
    },
  },
  computed: {

  },
  created() {
    this.deleteToken()
    this.loadRememberedData();
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  async signinapi() {
    this.processing = true;
    try {
      const result = await axios.post('http://localhost:8088/auth/login', {
        username: this.email,
        password: this.password
      });

      if (result.data.status === 'errors') {
        this.authError = result.data.data;
        return;
      }

      // Suponiendo que el token se encuentra en result.data.token
      localStorage.setItem('jwt', result.data.token);
      localStorage.setItem('accountType', result.data.accountType);
      localStorage.setItem('isActive', result.data.isActive);

      if (this.rememberMe) {
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

      const accountType = localStorage.getItem('accountType');
      let isActive = localStorage.getItem('isActive') === 'true';  // Convertir a booleano

      // let tipoCuenta = result.data.accountType;
  // if (role === 'CLIENT') {
  //   this.$router.push({ path: '/client/dashboard-client' });
  // }
      if (isActive && accountType === 'COMPANY') {
        this.$router.push({ path: '/company/dashboard-company' }).then(() => {
          if (!localStorage.getItem('reloadedDashboard')) {
            localStorage.setItem('reloadedDashboard', 'true');
            location.reload();
          }
        });
      } else if (!isActive && accountType === 'COMPANY') {
        Swal.fire({
          title: 'Cuenta Inactiva',
          text: 'La cuenta con la que intentas ingresar no está activada. Por favor, contacta al administrador.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else if (isActive && accountType === 'EMPLOYEE') {
        this.$router.push({ path: '/company/profile-company' }).then(() => {
          if (!localStorage.getItem('reloadedProfile')) {
            localStorage.setItem('reloadedProfile', 'true');
            location.reload();
          }
        });
      } else if (!isActive && accountType === 'EMPLOYEE') {
        // Mostrar alerta si el usuario no está activado
        Swal.fire({
          title: 'Cuenta Inactiva',
          text: 'La cuenta con la que intentas ingresar no está activada. Por favor, contacta al administrador.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.authError = 'Inicio de sesión fallido. Porfavor revise sus datos e intente denuevo.';
    } finally {
      this.processing = false;
    }
  },
    loadRememberedData() {
      const savedEmail = localStorage.getItem("email");
      // const savedPassword = localStorage.getItem("password");

      if (savedEmail) {
        this.email = savedEmail;
        this.rememberMe = true;
        // if(savedPassword){
        //   this.password = savedPassword
        // }
      }
    },

    deleteToken(){
      localStorage.removeItem('jwt');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
    },

    // Try to log the user in with the username
    // and password they provided.
    // tryToLogIn() {
    //   this.processing = true;
    //   this.submitted = true;
    //   // stop here if form is invalid
    //   this.$touch;
    //
    //   if (this.$invalid) {
    //     return;
    //   } else {
    //     if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
    //       this.tryingToLogIn = true;
    //       // Reset the authError if it existed.
    //       this.authError = null;
    //       return (
    //         this.logIn({
    //           email: this.email,
    //           password: this.password,
    //         })
    //           // eslint-disable-next-line no-unused-vars
    //           .then((token) => {
    //             this.tryingToLogIn = false;
    //             this.isAuthError = false;
    //             // Redirect to the originally requested page, or to the home page
    //             this.$router.push({
    //               path: '/'
    //             });
    //           })
    //           .catch((error) => {
    //             this.tryingToLogIn = false;
    //             this.authError = error ? error : "";
    //             this.isAuthError = true;
    //             this.processing = false;
    //           })
    //       );
    //     } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
    //       const { email, password } = this;
    //       if (email && password) {
    //         this.login({
    //           email,
    //           password,
    //         });
    //       }
    //     } else if (process.env.VUE_APP_DEFAULT_AUTH === "authapi") {
    //       axios
    //         .post("http://127.0.0.1:8000/api/login", {
    //           email: this.email,
    //           password: this.password,
    //         })
    //         .then((res) => {
    //           return res;
    //         });
    //     }
    //   }
    // },

  },
};
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-jose-bg" id="auth-particles" >
<!--      <div class="bg-overlay"></div>-->

      <div class="shape">

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>

    <div class="auth-page-content">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
<!--              <div>-->
<!--                <router-link to="/" class="d-inline-block auth-logo">-->
<!--                  <img src="@/assets/images/logo-light.png" alt="" height="20" />-->
<!--                </router-link>-->
<!--              </div>-->
<!--              <p class="mt-3 fs-15 fw-medium">
                Premium Admin & Dashboard Template
              </p>-->
            </div>
          </BCol>
        </BRow>

        <BRow class="justify-content-center">
          <BCol md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <img src="@/assets/images/evol.png" width="270px" alt="">
              
                </div>
                <div class="p-2 mt-4">
                  <b-alert v-model="authError" variant="danger" class="mt-3" dismissible>{{ authError }}</b-alert>

                  <div>

                  </div>

<!--                  <form @submit.prevent="tryToLogIn">-->
                    <div class="mb-3">
                      <label for="email" class="form-label">Correo</label>
                      <input type="email" class="form-control" id="email" placeholder="Ingrese correo" v-model="email" />
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>

                  <div class="mb-3">
                    <div class="float-end">
                      <router-link to="/forgot-password" class="text-muted">Olvidaste tu contraseña?</router-link>
                    </div>
                    <label class="form-label" for="password-input">Contraseña</label>
                    <div class="position-relative auth-pass-inputgroup mb-3">
                      <!-- Cambia el tipo de input según si la contraseña es visible -->
                      <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control pe-5"
                             placeholder="Ingrese contraseña" id="password-input" />
                      <!-- Botón para mostrar/ocultar la contraseña -->
                      <BButton variant="link" class="position-absolute end-0 top-0 text-decoration-none text-muted" type="button"
                               id="password-addon" @click="togglePasswordVisibility">
                        <!-- Cambia el icono según si la contraseña es visible -->
                        <i :class="showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                      </BButton>
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>
                  </div>

                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="auth-remember-check"
                        v-model="rememberMe"
                    />
                    <label class="form-check-label" for="auth-remember-check">Recuerdame</label>
                  </div>

                    <div class="mt-4">
                      <BButton variant="success" class="w-100" type="submit" @click="signinapi" :disabled="processing">
                        {{ processing ? "Espere un momento" : "Iniciar Sesión" }}
                      </BButton>
                    </div>

<!--                    <div class="mt-4 text-center">-->
<!--                      <div class="signin-other-title">-->
<!--                        <h5 class="fs-13 mb-4 title">Inicia Sesión Con</h5>-->
<!--                      </div>-->
<!--                      <div>-->
<!--                        <BButton variant="primary" type="button" class="btn btn-primary btn-icon">-->
<!--                          <i class="ri-facebook-fill fs-16"></i>-->
<!--                        </BButton>-->
<!--                        <BButton variant="danger" type="button" class="btn btn-danger btn-icon ms-1">-->
<!--                          <i class="ri-google-fill fs-16"></i>-->
<!--                        </BButton>-->
<!--                        <BButton variant="dark" type="button" class="btn btn-dark btn-icon ms-1">-->
<!--                          <i class="ri-github-fill fs-16"></i>-->
<!--                        </BButton>-->
<!--                        <BButton variant="info" type="button" class="btn btn-info btn-icon ms-1">-->
<!--                          <i class="ri-twitter-fill fs-16"></i>-->
<!--                        </BButton>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </form>-->
                </div>
              </BCardBody>
            </BCard>

            <div class="mt-4 text-center">
              <p class="mb-0">
                No tienes cuenta ?
                <router-link to="/register" class="fw-semibold text-primary
                  text-decoration-underline">
                  Registrate
                </router-link>
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </div>

    <footer class="footer">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} EvolGreen
<!--                <i class="mdi mdi-heart text-danger"></i> by Themesbrand-->
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div>
</template>