<template>
    <Layout>
      <PageHeader title="Actualizar Empleados" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Crear Empleado" />
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
                        <BFormInput 
                          v-model="employee.password" 
                          type="password" 
                          class="form-control" 
                          placeholder="Contraseña" 
                          id="password" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="plan" class="form-label">Plan</label>
                        <BFormSelect 
                          v-model="employee.plan" 
                          class="form-control" 
                          id="plan" 
                          required
                        >
                          <option value="">Seleccionar un plan</option>
                          <option value="PLAN A BÁSICO">PLAN A BÁSICO</option>
                          <option value="PLAN B INTERMEDIO">PLAN B INTERMEDIO</option>
                          <option value="PLAN C AVANZADO">PLAN C AVANZADO</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="role" class="form-label">Rol</label>
                        <BFormSelect 
                          v-model="employee.role" 
                          class="form-control" 
                          id="role" 
                          required
                        >
                          <option value="">Seleccionar un rol</option>
                          <option value="Administrador">Administrador</option>
                          <option value="Electrobombero">Electrobombero</option>
                          <option value="Gerente de Marketing">Gerente de Marketing</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton type="submit" variant="primary"  @click="successmsg">
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
  
  import "flatpickr/dist/flatpickr.css";
  import "@vueform/multiselect/themes/default.css";
  import Swal from "sweetalert2";
  
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import CardHeader from "@/common/card-header";
  
  export default {
    data() {
      return {
        employee: {
          name: 'González',
          firstSurname: '',
          lastSurname: '',
          email: 'gonzalez@example.com',
          password: '',
          plan: 'PLAN A BÁSICO',
          role: 'Administrador'
        },
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
    },
    methods: {
  
      successmsg() {
        Swal.fire({
          title: "Empleado Actualizado!",
          text: "Redirigiendo a la página de Empleados...",
          icon: "success",
          timer: 2000, // Tiempo en milisegundos antes de redirigir
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/empleados-company'); // Redirigir a la página de empleados
          }
        });
      },
      async createEmployee() {
        try {
           // Simula una llamada de API exitosa
           setTimeout(() => {
              this.successmsg();
              this.$router.push('/company/empleados-company');
            }, 1000); // Retraso de 1 segundo para simular la llamada
        } catch (error) {
          console.error("Error creando el empleado:", error);
          alert('Error creando el empleado');
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
  