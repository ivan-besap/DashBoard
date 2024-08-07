<template>
  <Layout>
    <PageHeader title="Crear Estación" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Estación" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createChargingStation">
                
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
                      />
                    </div>
                  </BCol>
                  
                  <BCol lg="12">
                    <div class="text-end">
                      <BButton style="" type="submit" variant="light">
                        Crear Estación
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
      chargingStation: {
        name: '',
        currentLoad: 0.0,
        location: ''
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
    async createChargingStation() {
      try {
        await axios.post('http://localhost:8080/api/company/current/chargingStations', this.chargingStation);
        alert('Estación de carga creada exitosamente');
        this.chargingStation.name = '';
        this.chargingStation.currentLoad = 0.0;
        this.chargingStation.location = '';
      } catch (error) {
        console.error("Error creando la estación de carga:", error);
        alert('Error creando la estación de carga');
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
