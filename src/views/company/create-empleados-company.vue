<template>
    <Layout>
      <PageHeader title="Crear Empleados" pagetitle="Forms" />
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
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton type="submit" variant="primary">
                          Crear Empleado
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
  import "flatpickr/dist/flatpickr.css";
  import "@vueform/multiselect/themes/default.css";
  
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import CardHeader from "@/common/card-header";
  
  export default {
    data() {
      return {
        employee: {
          name: '',
          firstSurname: '',
          lastSurname: '',
          email: '',
          password: ''
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
      async createEmployee() {
        try {
          await axios.post('http://localhost:8080/api/companies/employee', this.employee);
          alert('Empleado creado exitosamente');
          this.employee.name = '';
          this.employee.firstSurname = '';
          this.employee.lastSurname = '';
          this.employee.email = '';
          this.employee.password = '';
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
  