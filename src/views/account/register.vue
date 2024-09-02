<script>
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from 'axios';
import Swal from "sweetalert2";

export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      user: {
        nombreEmpresa: "",
        rut: "",
        telefono: "",
        email: "",
        password: "",
        confirm_password: "",
      },
    };
  },
  validations: {
    user: {
      nombreEmpresa: {
        required: helpers.withMessage("Ingrese un nombre de la compañía", required),
      },
      email: {
        required: helpers.withMessage("Ingrese un email de la compañía", required),
        email: helpers.withMessage("Ingrese un email válido", email),
      },
      rut: {
        required: helpers.withMessage("Ingrese un rut de la compañía", required),
      },
      telefono: {
        required: helpers.withMessage("Ingrese un teléfono de la compañía", required),
      },
      password: {
        required: helpers.withMessage("Ingrese contraseña", required),
      },
      confirm_password: {
        required: helpers.withMessage("Ingrese contraseña", required),
        sameAsPassword: helpers.withMessage("Las contraseñas no coinciden", sameAs('password')),
      },
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    async submitForm() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/auth/register', this.user);
        if (response.data.status === 'errors') {
          this.authError = response.data.data;
          return;
        } else {
          Swal.fire("Cuenta compañía creada!", "", "success");
          this.$router.push({ path: '/login' });
        }
      } catch (error) {
        console.error('Error during registration:', error);
        this.authError = 'Registro fallido. Por favor revise sus datos e intente de nuevo.';
      }
    }

    // Try to register the user in with the email, username
    // and password they provided.
    // async tryToRegisterIn() {
    //   this.submitted = true;
    //   // stop here if form is invalid
    //   this.v$.$touch();
    //   const result = await axios.post('https://api-node.themesbrand.website/auth/signup', {
    //     email: this.user.email,
    //     password: this.user.password,
    //     confirm_password: this.user.confirm_password
    //   });
    //   if (result.data.status == 'errors') {
    //     this.isRegisterError = true;
    //     return this.regError = result.data.message;
    //   }
    //   // localStorage.setItem('jwt', result.data.token);
    //   // this.$router.push({
    //   //   path: '/'
    //   // });
    //
    // },
  },
};
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position" style="background-color: #222c27" id="auth-particles">
      <div></div>

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
<!--                  <img src="@/assets/images/logo-light.png" alt="" height="20">-->
<!--                </router-link>-->
<!--              </div>-->
<!--              <p class="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>-->
            </div>
          </BCol>
        </BRow>

        <BRow class="justify-content-center">
          <BCol md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">

              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <img src="@/assets/images/evol.png" width="270px" alt="">
              
                 
                  <p class="text-muted">Crea tu cuenta en EvolGreen</p>
                </div>
                <div class="p-2 mt-4">
                  <div class="mb-3" :class="{ 'has-error': v$.user.nombreEmpresa.$invalid && v$.user.nombreEmpresa.$dirty }">
                    <label for="businessName" class="form-label">Nombre Compañía <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="user.nombreEmpresa" id="businessName" placeholder="Ingrese nombre" @blur="v$.user.nombreEmpresa.$touch()">
                    <span v-if="v$.user.nombreEmpresa.$invalid && v$.user.nombreEmpresa.$dirty" class="text-danger">{{ v$.user.nombreEmpresa.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-3" :class="{ 'has-error': v$.user.rut.$invalid && v$.user.rut.$dirty }">
                    <label for="rut" class="form-label">Número de registro único <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="user.rut" id="rut" placeholder="Ingrese Rut" @blur="v$.user.rut.$touch()">
                    <span v-if="v$.user.rut.$invalid && v$.user.rut.$dirty" class="text-danger">{{ v$.user.rut.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-3" :class="{ 'has-error': v$.user.telefono.$invalid && v$.user.telefono.$dirty }">
                    <label for="phoneCompany" class="form-label">Número Teléfono <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" v-model="user.telefono" id="phoneCompany" placeholder="Ingrese Teléfono" @blur="v$.user.telefono.$touch()">
                    <span v-if="v$.user.telefono.$invalid && v$.user.telefono.$dirty" class="text-danger">{{ v$.user.telefono.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-3" :class="{ 'has-error': v$.user.email.$invalid && v$.user.email.$dirty }">
                    <label for="emailCompany" class="form-label">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" v-model="user.email" id="emailCompany" placeholder="Ingrese email" @blur="v$.user.email.$touch()">
                    <span v-if="v$.user.email.$invalid && v$.user.email.$dirty" class="text-danger">{{ v$.user.email.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-2" :class="{ 'has-error': v$.user.password.$invalid && v$.user.password.$dirty }">
                    <label for="password" class="form-label">Contraseña <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" v-model="user.password" id="password" placeholder="Ingrese contraseña" @blur="v$.user.password.$touch()">
                    <span v-if="v$.user.password.$invalid && v$.user.password.$dirty" class="text-danger">{{ v$.user.password.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-2" :class="{ 'has-error': v$.user.confirm_password.$invalid && v$.user.confirm_password.$dirty }">
                    <label for="confirm_password" class="form-label">Confirmar Contraseña <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" v-model="user.confirm_password" id="confirm_password" placeholder="Ingrese contraseña" @blur="v$.user.confirm_password.$touch()">
                    <span v-if="v$.user.confirm_password.$invalid && v$.user.confirm_password.$dirty" class="text-danger">{{ v$.user.confirm_password.$errors[0].$message }}</span>
                  </div>
                  <div class="mb-4">
                    <p class="mb-0 fs-12 text-muted fst-italic">Al registrarse en EvolGreen acepta <BLink href="#" class="text-primary text-decoration-underline fst-normal fw-medium">Terminos de uso</BLink></p>
                  </div>
                  <div class="mt-4">
                    <BButton variant="success" class="w-100" type="submit" @click="submitForm">Registrarse</BButton>
                  </div>
                </div>
              </BCardBody>
            </BCard>

            <div class="mt-4 text-center">
              <p class="mb-0">Ya tienes una cuenta ? <router-link to="/login"
                  class="fw-semibold text-primary text-decoration-underline"> Iniciar Sesión </router-link>
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </div>

<!--    <footer class="footer">-->
<!--      <BContainer>-->
<!--        <BRow>-->
<!--          <BCol lg="12">-->
<!--            <div class="text-center">-->
<!--              <p class="mb-0 text-muted">&copy; {{ new Date().getFullYear() }} Velzon. Crafted with <i-->
<!--                  class="mdi mdi-heart text-danger"></i> by Themesbrand</p>-->
<!--            </div>-->
<!--          </BCol>-->
<!--        </BRow>-->
<!--      </BContainer>-->
<!--    </footer>-->
  </div>
</template>
<style scoped>
.has-error input {
  border-color: red;
}
.text-danger {
  color: red;
}
</style>