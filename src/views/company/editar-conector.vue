<template>
  <Layout>
    <PageHeader title="Editar Conector" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Conector" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateCharger">
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
                      <BButton style="background-color: #dfe4ea" type="submit" variant="light">
                        Actualizar Conector
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
      charger: {
        alias: 'Álias de prueba',
        connectorType: 'Tipo 1',
        connectorNumber: 1000,
        voltage: 240,
        power: 2000,
        current: 10,
        station: 'Estacion 1'
      },
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async updateCharger() {
      try {
        await axios.put(`http://localhost:8080/api/chargers/${this.charger.id}`, this.charger);
        Swal.fire({
          title: "Conector actualizado!",
          text: "Redirigiendo a la página de Conectores...",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('/company/conector'); // Redirigir a la página de conectores
          }
        });
      } catch (error) {
        console.error("Error actualizando el conector:", error);
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
