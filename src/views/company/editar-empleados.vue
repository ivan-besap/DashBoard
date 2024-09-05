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
<!--                  <BCol md="6">-->
<!--                    <div class="mb-3">-->
<!--                      <label for="password" class="form-label">Contraseña</label>-->
<!--                      <BFormInput -->
<!--                        v-model="employee.password" -->
<!--                        type="password" -->
<!--                        class="form-control" -->
<!--                        placeholder="Contraseña" -->
<!--                        id="password" -->
<!--                        required -->
<!--                      />-->
<!--                    </div>-->
<!--                  </BCol>-->
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="role" class="form-label">Rol</label>
                      <BFormSelect 
                        v-model="employee.role.id"
                        class="form-control" 
                        id="role" 
                        required
                      >
                        <option value="">Seleccione un rol</option>
                        <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                          {{ rol.nombre }}
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="text-end">
                      <BButton style="background-color: #dfe4ea;" type="submit" variant="light">
                        Actualizar Empleado
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

export default {
  data() {
    return {
      employee: {
        nombre: '',  
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        /*password: '',*/
        role: " ",
      },
      roles: []
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  created() {
    this.fetchEmployeeData();  
    this.fetchRoles();  
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await axios.get('http://localhost:8080/api/roles');
        this.roles = response.data; 
      } catch (error) {
        console.error("Error obteniendo los roles:", error);
      }
    },
    async fetchEmployeeData() {
      const employeeId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/accounts/${employeeId}`);
        this.employee = {
          nombre: response.data.nombre || '',
          apellidoPaterno: response.data.apellidoPaterno || '',
          apellidoMaterno: response.data.apellidoMaterno || '',
          email: response.data.email || '',
         /* password: response.data.password || '',  */
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
          /*password: this.employee.password ,*/
          role: this.employee.role.id
        };
        console.log(employeeData)

        await axios.put(
          `http://localhost:8080/api/companies/current/employee/${employeeId}`,
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
        Swal.fire("Error", "No se pudo actualizar el empleado", "error");
      }
    }


  },
};
</script>
