<template>
  <Layout>
    <PageHeader title="Crear Usuario Empresa" pagetitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Usuario" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createEmployee">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="employeeName" class="form-label">Nombre</label>
                      <BFormInput 
                        v-model="employee.name" 
                        type="text" 
                        class="form-control" 
                        placeholder="Nombre del empleado" 
                        id="employeeName" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="firstSurname" class="form-label">Rut</label>
                      <BFormInput
                          v-model="employee.rut"
                          type="text"
                          class="form-control"
                          placeholder="Rut"
                          id="rut"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="firstSurname" class="form-label">Apellido Paterno</label>
                      <BFormInput 
                        v-model="employee.firstSurname" 
                        type="text" 
                        class="form-control" 
                        placeholder="Apellido Paterno" 
                        id="firstSurname" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="lastSurname" class="form-label">Apellido Materno</label>
                      <BFormInput 
                        v-model="employee.lastSurname" 
                        type="text" 
                        class="form-control" 
                        placeholder="Apellido Materno" 
                        id="lastSurname" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="email" class="form-label">Correo Electrónico</label>
                      <BFormInput 
                        v-model="employee.email" 
                        type="email" 
                        class="form-control" 
                        placeholder="Correo Electrónico" 
                        id="email" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="password" class="form-label">Contraseña</label>
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <BFormInput
                            v-model="employee.password"
                            :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Contraseña"
                        id="password"
                        required
                        />
                        <BButton variant="link" class="position-absolute end-0 top-0 text-decoration-none text-muted" type="button"
                                 @click="togglePasswordVisibility">
                          <i :class="showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                        </BButton>
                      </div>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="password" class="form-label">Teléfono</label>
                      <BFormInput
                          v-model="employee.telefono"
                          type="number"
                          class="form-control"
                          placeholder="Telefono"
                          id="telefono"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="role" class="form-label">Rol</label>
                      <Multiselect
                          style="border: 1px solid black;"
                          v-model="employee.role"
                          :options="roles"
                          label="label"
                          track-by="label"
                          placeholder="Selecciona o ingrese un rol"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('https://app.evolgreen.com:8088/api/company/empleados-company')">
                        Volver
                      </BButton>
                      <BButton type="submit" variant="light">
                        Crear
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
              </BForm>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>

import "flatpickr/dist/flatpickr.css";
import "@vueform/multiselect/themes/default.css";
import Swal from "sweetalert2";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import axios from "axios";
import Multiselect from "@vueform/multiselect";

export default {
  data() {
    return {
      employee: {
        name: '',
        firstSurname: '',
        lastSurname: '',
        email: '',
        password: '',
        plan: '',
        role: '',
        telefono:'',
        rut:''
      },
      showPassword: false,
      roles: [],
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
      },
      date: null,
      date1: null,
      date3: null,
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    Multiselect
  },
  created() {
    this.fetchRoles(); 
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Alternar entre mostrar y ocultar la contraseña
    },
    successmsg() {
      Swal.fire({
        title: "Empleado creado!",
        text: "Redirigiendo a la página de Empleados...",
        icon: "success",
        timer: 2000, // Tiempo en milisegundos antes de redirigir
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('https://app.evolgreen.com:8088/api/company/empleados-company'); // Redirigir a la página de planes
        }
      });
    },
    async fetchRoles() {
      try {
        const response = await axios.get('https://app.evolgreen.com:8088/api/roles');
        this.roles = response.data.map(role => ({
          label: role.nombre,
          value: role.id
        }));
      } catch (error) {
        console.log(this.roles);
        console.error("Error obteniendo los roles:", error);
      }
    },
    async createEmployee() {
      try {
        const newEmployee = {
          nombre: this.employee.name,
          apellidoPaterno: this.employee.firstSurname,
          apellidoMaterno: this.employee.lastSurname,
          email: this.employee.email,
          password: this.employee.password,
          role: this.employee.role,
          telefono: this.employee.telefono,
          rut: this.employee.rut
        };

        const response = await axios.post('https://app.evolgreen.com:8088/api/companies/current/employee', newEmployee);
        this.successmsg();
        console.log("Empleado creado exitosamente:", response.data);
      } catch (error) {
        console.error("Error creando el empleado:", error);
        if (error.response && error.response.status === 409) { // Código 409 para conflicto (email ya registrado)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ya existe un usuario con ese correo electrónico."
          });
        } else if (error.response && error.response.status === 404) { // Código 404 para empresa o rol no encontrado
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Empresa o rol no encontrado."
          });
        } else {
          // Error genérico
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear el empleado. Inténtelo nuevamente."
          });
        }
      }
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
