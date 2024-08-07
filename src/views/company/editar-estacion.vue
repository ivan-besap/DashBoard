<template>
    <Layout>
      <PageHeader title="Editar Estación" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Editar Estación" />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="updateChargingStation">
                  
                  <BRow>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="nombreEstacion" class="form-label">Nombre</label>
                        <BFormInput 
                          v-model="chargingStation.name" 
                          type="text" 
                          class="form-control" 
                          placeholder="Nombre de la estación" 
                          id="nombreEstacion" 
                          required 
                          readonly
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="ubicacion" class="form-label">Ubicación</label>
                        <BFormInput 
                          v-model="chargingStation.location" 
                          type="text" 
                          class="form-control" 
                          placeholder="Ubicación de la estación" 
                          id="ubicacion" 
                          required 
                          readonly
                        />
                      </div>
                    </BCol>
                    
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton style="" type="submit" variant="light" @click="successmsg">
                          Actualizar Estación
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
        chargingStation: {
          name: 'Estación 1', // Datos estáticos para edición
          currentLoad: 0.0,
          location: 'Santiago'
        }
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
          title: "Estacion Actualizada!",
          text: "Redirigiendo a la página de Roles...",
          icon: "success",
          timer: 2000, // Tiempo en milisegundos antes de redirigir
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/stations-company'); // Redirigir a la página de roles
          }
        });
      },
      async updateChargingStation() {
        try {
          // Lógica para actualizar la estación, por ejemplo:
          await axios.put('http://localhost:8080/api/company/current/chargingStations/1', this.chargingStation);
         // alert('Estación de carga actualizada exitosamente');
        } catch (error) {
          console.error("Error actualizando la estación de carga:", error);
          //alert('Error actualizando la estación de carga');
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
  