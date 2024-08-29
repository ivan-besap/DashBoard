<template>
  <Layout>
    <PageHeader title="Editar Conector" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Conector" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateConnector">
                <BRow>


                  <BCol md="6">
                    <div class="mb-3">
                      <label for="alias" class="form-label">Álias (Opcional)</label>
                      <BFormInput
                          v-model="connector.alias"
                          type="text"
                          class="form-control"
                          placeholder="Álias"
                          id="alias"
                      />
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="connectorNumber" class="form-label">Número de Conector</label>
                      <BFormInput
                          v-model="connector.nconector"
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
                          v-model="connector.voltajeMaximo"
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
                          v-model="connector.potenciaMaxima"
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
                          v-model="connector.corrienteMaxima"
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
                      <label for="charger" class="form-label">Cargador</label>
                      <BFormSelect
                          v-model="connector.cargador"
                          class="form-control"
                          id="charger"
                          required
                      >
                        <option value="">Seleccionar un Cargador</option>
                        <option v-for="charger in chargers" :key="charger.id" :value="charger.id">
                          {{ charger.nombre }} <!-- Usar el nombre del cargador aquí -->
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="connectorType" class="form-label">Tipo de Conector</label>
                      <BFormSelect
                          v-model="connector.tipoConector"
                          class="form-control"
                          id="connectorType"
                          required
                      >
                        <option value="">Seleccionar un Tipo de Conector</option>
                        <option v-for="type in connectorTypes" :key="type" :value="type">
                          {{ type }}
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="charger" class="form-label">Terminal</label>
                      <BFormSelect
                          v-model="connector.terminal"
                          class="form-control"
                          id="charger"
                          required
                      >
                        <option value="">Seleccionar un Cargador</option>
                        <option v-for="station in chargingStations" :key="station.id" :value="station.id">
                          {{ station.nombreTerminal }} <!-- Usar el nombre del cargador aquí -->
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/conector')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
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
      chargers:[],
      connectorTypes: [],
      chargingStations: [],
      connector: {
        alias: '',
        voltajeMaximo:'',
        potenciaMaxima:'',
        corrienteMaxima:'',
        nconector:'',
        cargador:'',
        tipoConector: '',
        terminal:''
      },
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async loadConnector() {
      const connectorId = this.$route.params.id;  // Obtén el ID del conector desde la URL
      try {
        const response = await axios.get(`http://localhost:8080/api/connectors/${connectorId}`);
        this.connector = response.data;
      } catch (error) {
        console.error("Error cargando el conector:", error);
        Swal.fire("Error al cargar el conector", "", "error");
      }
    },
    async updateConnector() {
      try {
        const dataParaEnviar = {
          alias: this.connector.alias,
          tipoConector: this.connector.tipoConector,
          nConector: this.connector.nconector, // Cambié 'nconector' a 'nConector'
          voltajeMaximo: this.connector.voltajeMaximo,
          potenciaMaxima: this.connector.potenciaMaxima,
          corrienteMaxima: this.connector.corrienteMaxima,
          cargador: this.connector.cargador,
          terminal: this.connector.terminal
        };
        const response = await axios.put(`http://localhost:8080/api/companies/current/connectors/${this.connector.id}`, dataParaEnviar);
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Conector Actualizado Exitosamente", "", "success").then(() => {
            this.$router.push('/company/conector');
          });
        }
      } catch (error) {
        console.error("Error actualizando el conector:", error);
        Swal.fire("Error al actualizar el conector", "", "error");
      }
    },
    async charges() {
      try {
        const response = await axios.get('http://localhost:8080/api/chargers');
        this.chargers = response.data;
      } catch (error) {
        console.error("Error obteniendo los cargadores:", error);
      }
    },
    async loadConnectorTypes() {
      try {
        const response = await axios.get('http://localhost:8080/api/connector-types');
        this.connectorTypes = response.data;
      } catch (error) {
        console.error("Error obteniendo los tipos de conector:", error);
      }
    },
    async chargingStation() {
      try {
        const response = await axios.get('http://localhost:8080/api/chargingStations');
        this.chargingStations = response.data
      } catch (error) {
        console.error("Error obteniendo las estaciones de carga:", error);
      }
    },
  },
  created() {
    this.charges();
    this.loadConnector();
    this.loadConnectorTypes();
    this.chargingStation();
  },
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
