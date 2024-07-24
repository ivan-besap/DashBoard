<template>
  <Layout>
    <PageHeader title="Crear Cargador" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Cargador" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createCharger">
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
                      <label for="station" class="form-label">Estaciones de carga</label>
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
                      <BButton type="submit" variant="primary">
                        Crear Cargador
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
                <BRow>
                  <BCol lg="6">
                    <BCard no-body>
                      <BCardBody>
                        <BCardTitle>Ubicación</BCardTitle>
                        <GoogleMap 
                          api-key="AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE" 
                          :center="{ lat: 2, lng: 2 }" 
                          :zoom="5"
                          style="height: 300px"
                        ></GoogleMap>
                      </BCardBody>
                    </BCard>
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
import { GoogleMap } from "vue3-google-map";

export default {
  data() {
    return {
      charger: {
        ocppId: '',
        name: '',
        alias: '',
        manufacturer: '',
        model: '',
        location: '',
        station: ''
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
    GoogleMap
  },
  methods: {
    async createCharger() {
      try {
        await axios.post('http://localhost:8080/api/chargers', this.charger);
        alert('Cargador creado exitosamente');
        this.charger.ocppId = '';
        this.charger.name = '';
        this.charger.alias = '';
        this.charger.manufacturer = '';
        this.charger.model = '';
        this.charger.location = '';
        this.charger.station = '';
      } catch (error) {
        console.error("Error creando el cargador:", error);
        alert('Error creando el cargador');
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
