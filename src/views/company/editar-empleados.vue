<template>
  <Layout>
    <PageHeader title="Actualizar Empleados" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Empleado" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateEmployee">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="employeeName" class="form-label">Nombre</label>
                      <BFormInput 
                        v-model="employee.nombre" 
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
                      <label for="firstSurname" class="form-label">Apellido Paterno</label>
                      <BFormInput 
                        v-model="employee.apellidoPaterno" 
                        type="text" 
                        class="form-control" 
                        placeholder="Apellido Paterno" 
                        id="apellidoPaterno" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="lastSurname" class="form-label">Apellido Materno</label>
                      <BFormInput 
                        v-model="employee.apellidoMaterno" 
                        type="text" 
                        class="form-control" 
                        placeholder="Apellido Materno" 
                        id="apellidoMaterno" 
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
                            :type="showPassword ? 'text' : 'password'"
                            v-model="employee.password"
                            class="form-control"
                            placeholder="Contraseña"
                            id="password"
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
                      <label for="role" class="form-label">Rol</label>
                      <Multiselect
                        style="border: 1px solid black;"
                        v-model="employee.role.id"
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
                      <BButton variant="light" @click="$router.push('/company/empleados-company')">
                        Volver
                      </BButton>
                      <BButton style="background-color: #dfe4ea;" type="submit" variant="light">
                        Actualizar
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
import axios from 'axios';
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Multiselect from "@vueform/multiselect";

export default {
  data() {
    return {
      employee: {
        nombre: '',  
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        role: " ",
      },
      roles: [],
      showPassword: false,
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    Multiselect
  },
  created() {
    this.fetchEmployeeData();  
    this.fetchRoles();  
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async fetchRoles() {
      try {
        const response = await axios.get('https://app.evolgreen.com/api/roles');
        this.roles = response.data.map(role => ({
          label: role.nombre,
          value: role.id
        }));
      } catch (error) {
        console.error("Error obteniendo los roles:", error);
      }
    },
    async fetchEmployeeData() {
      const employeeId = this.$route.params.id;
      try {
        const response = await axios.get(`https://app.evolgreen.com/api/accounts/${employeeId}`);
        this.employee = {
          nombre: response.data.nombre || '',
          apellidoPaterno: response.data.apellidoPaterno || '',
          apellidoMaterno: response.data.apellidoMaterno || '',
          email: response.data.email || '',
          password: '',
          role: response.data.rol || { id: null },
        };
      } catch (error) {
        console.error("Error obteniendo los datos del empleado:", error);
      }
    },
    async updateEmployee() {
      const employeeId = this.$route.params.id;
      try {
        const employeeData = {
          nombre: this.employee.nombre,
          apellidoPaterno: this.employee.apellidoPaterno,
          apellidoMaterno: this.employee.apellidoMaterno,
          email: this.employee.email,
          role: this.employee.role.id
        };
        console.log(this.employee.password)
        if (this.employee.password.trim() !== '') {
          employeeData.password = this.employee.password;
        }
        console.log(employeeData)

        await axios.put(
          `https://app.evolgreen.com/api/companies/current/employee/${employeeId}`,
          employeeData
        );

        Swal.fire({
          title: "Empleado Actualizado!",
          text: "Redirigiendo a la página de Empleados...",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/empleados-company');
          }
        });

      } catch (error) {
        console.error("Error actualizando el empleado:", error);

        if (error.response && error.response.status === 409) {
          // El email ya existe
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ya existe un usuario con ese correo electrónico."
          });
        } else {
          Swal.fire("Error", "No se pudo actualizar el empleado", "error");
        }
      }
    }


  },
};
</script>
