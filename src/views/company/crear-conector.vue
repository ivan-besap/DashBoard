<template>
    <Layout>
      <PageHeader title="Crear Conector" pageTitle="Compañía" />
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
                        <label for="alias" class="form-label">Álias (Opcional)</label>
                        <BFormInput 
                          v-model="charger.alias" 
                          type="text" 
                          class="form-control" 
                          placeholder="Álias" 
                          id="alias"
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="connectorType" class="form-label">Tipo de Conector</label>
                        <BFormSelect 
                          v-model="charger.connectorType" 
                          class="form-control" 
                          id="connectorType" 
                          required
                        >
                          <option value="">Seleccionar tipo de conector</option>
                          <option value="Tipo 1">Tipo 1</option>
                          <option value="Tipo 2">Tipo 2</option>
                          <option value="CCS">CCS</option>
                        </BFormSelect>
                      </div>
                    </BCol>
                   
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="connectorNumber" class="form-label">Número de Conector</label>
                        <BFormInput 
                          v-model="charger.connectorNumber" 
                          type="number" 
                          class="form-control" 
                          placeholder="Número de conector" 
                          id="connectorNumber" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="voltage" class="form-label">Voltaje Máximo (V)</label>
                        <BFormInput 
                          v-model="charger.voltage" 
                          type="number" 
                          class="form-control" 
                          placeholder="Voltaje máximo" 
                          id="voltage" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="power" class="form-label">Potencia Máxima (W)</label>
                        <BFormInput 
                          v-model="charger.power" 
                          type="number" 
                          class="form-control" 
                          placeholder="Potencia máxima" 
                          id="power" 
                          required 
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="current" class="form-label">Corriente Máxima (A)</label>
                        <BFormInput 
                          v-model="charger.current" 
                          type="number" 
                          class="form-control" 
                          placeholder="Corriente máxima" 
                          id="current" 
                          required 
                        />
                      </div>
                    </BCol>
                    
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="station" class="form-label">Cargadores</label>
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
                        <BButton style="background-color: #dfe4ea" type="submit" variant="light" @click="successmsg">
                          Crear Conector
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
  import Swal from "sweetalert2";
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import CardHeader from "@/common/card-header";
  
  export default {
    data() {
      return {
        charger: {
          ocppId: '',
          name: '',
          alias: '',
          connectorType: '',
          connector: '',
          connectorNumber: '',
          voltage: '',
          power: '',
          current: '',
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
    },
    methods: {
      successmsg() {
        Swal.fire({
          title: "Conector creado!",
          text: "Redirigiendo a la página de Conectores...",
          icon: "success",
          timer: 2000, // Tiempo en milisegundos antes de redirigir
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/conector'); // Redirigir a la página de cargadores
          }
        });
      },
      async createCharger() {
        try {
          await axios.post('http://localhost:8080/api/chargers', this.charger);
          this.charger.ocppId = '';
          this.charger.name = '';
          this.charger.alias = '';
          this.charger.connectorType = '';
          this.charger.connector = '';
          this.charger.connectorNumber = '';
          this.charger.voltage = '';
          this.charger.power = '';
          this.charger.current = '';
          this.charger.manufacturer = '';
          this.charger.model = '';
          this.charger.location = '';
          this.charger.station = '';
        } catch (error) {
          console.error("Error creandel cargador:", error);
}
}
}
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>o
  