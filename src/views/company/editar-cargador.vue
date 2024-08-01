<template>
    <Layout>
      <PageHeader title="Editar Cargador" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Editar Cargador" />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="updateCharger">
                  <BRow>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="ocppId" class="form-label">OCPP ID</label>
                        <BFormInput 
                          v-model="charger.ocppId" 
                          type="text" 
                          class="form-control" 
                          placeholder="OCPP ID" 
                          id="ocppId" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="name" class="form-label">Nombre</label>
                        <BFormInput 
                          v-model="charger.name" 
                          type="text" 
                          class="form-control" 
                          placeholder="Nombre del cargador" 
                          id="name" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="alias" class="form-label">Alias</label>
                        <BFormInput 
                          v-model="charger.alias" 
                          type="text" 
                          class="form-control" 
                          placeholder="Alias" 
                          id="alias" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="manufacturer" class="form-label">Fabricante</label>
                        <BFormSelect 
                          v-model="charger.manufacturer" 
                          class="form-control" 
                          id="manufacturer" 
                          required
                        >
                          <option value="">Seleccionar un fabricante</option>
                          <option value="Joint Tech">Joint Tech</option>
                          <option value="Zhengzhou">Zhengzhou</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="model" class="form-label">Modelo</label>
                        <BFormSelect 
                          v-model="charger.model" 
                          class="form-control" 
                          id="model" 
                          required
                        >
                          <option value="">Seleccionar un modelo</option>
                          <option value="Higpowe3000">Higpowe3000</option>
                          <option value="High Power 2000">High Power 2000</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="location" class="form-label">Ubicación</label>
                        <BFormInput 
                          v-model="charger.location" 
                          type="text" 
                          class="form-control" 
                          placeholder="Ubicación" 
                          id="location" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="station" class="form-label">Estación de carga</label>
                        <BFormSelect 
                          v-model="charger.station" 
                          class="form-control" 
                          id="station" 
                          required
                        >
                          <option value="">Seleccionar una estación</option>
                          <option value="Estacion 1">Estacion 1</option>
                          <option value="Estacion 2">Estacion 2</option>
                          <option value="Estacion 3">Estacion 3</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton type="submit" style="background-color: #dfe4ea" variant="light" @click="successmsg">
                          Actualizar Cargador
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
  import Swal from 'sweetalert2';
  export default {
    data() {
      return {
        charger: {
          ocppId: 'OCPP123456',
          name: 'Cargador de Ejemplo',
          alias: 'Cargador 1',
          manufacturer: 'Joint Tech',
          model: 'Higpowe3000',
          location: 'Ubicación Ejemplo',
          station: 'Estacion 1'
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

        async successmsg() {
        Swal.fire({
          title: "Cargador Actualizado!",
          text: "Redirigiendo a la página de Cargadores...",
          icon: "success",
          timer: 2000, // Tiempo en milisegundos antes de redirigir
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/cargadores-company'); // Redirigir a la página de roles
          }
        });
      },
      async updateCharger() {
        try {
          await axios.put(`http://localhost:8080/api/chargers/${this.charger.ocppId}`, this.charger);
        //  alert('Cargador actualizado exitosamente');
        } catch (error) {
          console.error("Error actualizando el cargador:", error);
        //  alert('Error actualizando el cargador');
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
  