<template>
  <Layout>
    <PageHeader title="Editar Cargador" pageTitle="Compañía" />
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
                          v-model="charger.ocppid"
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
                      <label for="nombre" class="form-label">Nombre</label>
                      <BFormInput
                          v-model="charger.nombre"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del cargador"
                          id="nombre"
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
                      <label for="manufacturerId" class="form-label">Fabricante</label>
                      <BFormSelect
                          v-model="charger.manufacturerId"
                          class="form-control"
                          id="manufacturerId"
                          required
                      >
                        <option value="">Seleccionar un fabricante</option>
                        <option v-for="manufacturer in manufacturers" :key="manufacturer.id" :value="manufacturer.id">
                          {{ manufacturer.name }}
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="modelId" class="form-label">Modelo</label>
                      <BFormSelect
                          v-model="charger.modelId"
                          class="form-control"
                          id="modelId"
                          required
                      >
                        <option value="">Seleccionar un modelo</option>
                        <option v-for="model in models" :key="model.id" :value="model.id">
                          {{ model.name }}
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="stationId" class="form-label">Estación de carga</label>
                      <BFormSelect
                          v-model="charger.terminalId"
                          class="form-control"
                          id="stationId"
                          required
                      >
                        <option value="">Seleccionar una estación</option>
                        <option v-for="station in chargingStations" :key="station.id" :value="station.id">
                          {{ station.nombreTerminal }}
                        </option>
                      </BFormSelect>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/cargadores-company')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
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
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";

export default {
  data() {
    return {
      manufacturers: [],
      chargingStations: [],
      models: [],
      charger: {
        oCPPid: '',
        nombre: '',
        alias: '',
        manufacturerId: '',
        modeloId: '',
        terminal: ''
      },
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async loadCharger() {
      const chargerId = this.$route.params.id; // Obtén el ID desde la URL
      try {
        const response = await axios.get(`http://localhost:8080/api/chargers/${chargerId}`);
        this.charger = response.data;
      } catch (error) {
        console.error("Error cargando el cargador:", error);
      }
    },
    async updateCharger() {
      try {
        const dataParaEnviar = {
          oCPPid: this.charger.ocppid,        // Asegúrate de que los nombres de las propiedades coincidan
          nombre: this.charger.nombre,
          alias: this.charger.alias,
          manufacturerId: this.charger.manufacturerId,
          modeloId: this.charger.modelId,     // Cambié 'modelId' a 'modeloId' para coincidir con el nombre esperado
          terminal: this.charger.terminalId   // Cambié 'terminalId' a 'terminal' para coincidir con el nombre esperado
        };
        const response = await axios.put(`http://localhost:8080/api/companies/current/chargers/${this.charger.id}`, dataParaEnviar);
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Cargador Actualizado Exitosamente", "", "success").then(() => {
            this.$router.push('/company/cargadores-company');
          });
        }
      } catch (error) {
        console.error("Error actualizando el cargador:", error);
        Swal.fire("Error al actualizar el cargador", "", "error");
      }
    },
    async chargerManufacturers() {
      try {
        const response = await axios.get('http://localhost:8080/api/manufacturers');
        this.manufacturers = response.data;
      } catch (error) {
        console.error("Error cargando los fabricantes:", error);
      }
    },
    async chargerModels() {
      try {
        const response = await axios.get('http://localhost:8080/api/models');
        this.models = response.data;
      } catch (error) {
        console.error("Error cargando los modelos:", error);
      }
    },
    async chargingStations2() {
      try {
        const response = await axios.get('http://localhost:8080/api/chargingStations');
        this.chargingStations = response.data;
      } catch (error) {
        console.error("Error cargando las estaciones de carga:", error);
      }
    },
  },
  created() {
    this.chargerManufacturers();
    this.chargerModels();
    this.chargingStations2();
    this.loadCharger(); // Carga los datos del cargador
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
