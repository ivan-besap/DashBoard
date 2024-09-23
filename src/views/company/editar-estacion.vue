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
                          v-model="chargingStation.nombreTerminal"
                          type="text" 
                          class="form-control" 
                          placeholder="Nombre de la estación" 
                          id="nombreEstacion" 
                          required
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="ubicacion" class="form-label">Ubicación</label>
                        <BFormInput
                            v-model="chargingStation.ubicacionTerminal.direccion"
                            type="text"
                          class="form-control" 
                          placeholder="Ubicación de la estación" 
                          id="ubicacion" 
                          required
                        />
                      </div>
                    </BCol>

                    <BCol lg="12">
                      <div class="d-flex justify-content-between">
                        <BButton variant="light" @click="$router.push('https://app.evolgreen.com:8088/api/company/stations-company')">
                          Volver
                        </BButton>
                        <BButton style="" type="submit" variant="light">
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
          nombreTerminal: '',
          ubicacionTerminal: {
            direccion:''
          }
        },
        stationId: this.$route.params.id,  // Captura el ID de la estación de la URL
      };
    },
    components: {
      Layout,
      PageHeader,
      CardHeader,
    },
    methods: {
      async loadChargingStation() {
        try {
          const response = await axios.get(`https://app.evolgreen.com:8088/api/chargingStations/${this.stationId}`);
          this.chargingStation = response.data;
        } catch (error) {
          console.error("Error cargando la estación de carga:", error);
        }
      },
      async updateChargingStation() {
        try {
          await axios.put(`https://app.evolgreen.com:8088/api/companies/current/chargingStations/${this.stationId}`, this.chargingStation);
          Swal.fire("Estacion Actualizada!", "", "success").then(() => {
            this.$router.push('https://app.evolgreen.com:8088/api/company/stations-company');
          });
        } catch (error) {
          console.error("Error actualizando la estación de carga:", error);
          Swal.fire("Error actualizando la estación de carga", "", "error");
        }
      }
    },
    created() {
      this.loadChargingStation();  // Carga los datos de la estación cuando se monta el componente
    }
  };
  </script>
  
  <style>
  .flex-shrink-0 {
    display: none;
  }
  </style>
  