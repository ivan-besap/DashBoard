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
                      <BButton variant="light" @click="$router.push('/company/stations-company')">
                        Volver
                      </BButton>
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
import Swal from "sweetalert2";

export default {
  data() {
    return {
      chargingStation: {
        nombreTerminal: '',
        ubicacionTerminal: {
          direccion: ''
        }
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
      // Llama a la función para remover las tildes antes de enviar los datos
      this.chargingStation.ubicacionTerminal.direccion = this.removeAccents(this.chargingStation.ubicacionTerminal.direccion);

      try {
        const response = await axios.post('https://app.evolgreen.com/api/companies/current/chargingStations', this.chargingStation);
        if (response.status === 200 || response.status === 201) {
          this.chargingStation.nombreTerminal = '';
          this.chargingStation.ubicacionTerminal.direccion = ''; // Resetea el campo correctamente
        }
        Swal.fire("Estación Creada Exitosamente", "", "success").then(() => {
          this.$router.push('/company/stations-company');
        });
      } catch (error) {
        console.error("Error creando la estación de carga:", error);
        Swal.fire("Error al crear la estación de carga", "", "error");
      }
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
