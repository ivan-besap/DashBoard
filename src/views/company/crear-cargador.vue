<template>
  <Layout>
    <PageHeader title="Crear Cargador" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;" class="mb-2">
        <div class="contenedor-inic">
          <!-- Botón para Crear Fabricante de Cargador -->
          <BButton v-if="permisos.includes(60)" style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light" >
            <router-link class="nav-link menu-link" target="" to="/company/crear-fabricante-cargador">
              Crear Fabricante de Cargador
            </router-link>
          </BButton>

          <!-- Botón para Crear Modelo de Cargador -->
          <BButton v-if="permisos.includes(61)" style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light" >
            <router-link class="nav-link menu-link" target="" to="/company/crear-modelo-cargador">
              Crear Modelo de Cargador
            </router-link>
          </BButton>
        </div>
      </div>
    </BRow>
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
                          v-model="charger.oCPPid"
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
                      <Multiselect
                          style="border: 1px solid black;"
                          v-model="charger.manufacturerId"
                          :options="manufacturers"
                          label="label"
                          track-by="label"
                          placeholder="Selecciona o ingrese un fabricante"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="modelId" class="form-label">Modelo</label>
                      <Multiselect
                          style="border: 1px solid black;"
                          v-model="charger.modeloId"
                          :options="models"
                          label="label"
                          track-by="label"
                          placeholder="Selecciona o ingrese un modelo"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="stationId" class="form-label">Estación De Carga</label>
                      <Multiselect
                          style="border: 1px solid black;"
                          v-model="charger.terminal"
                          :options="chargingStations"
                          label="label"
                          track-by="label"
                          placeholder="Selecciona o ingrese un terminal"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/cargadores-company')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Crear Cargador
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
import Multiselect from "@vueform/multiselect";

export default {
  data() {
    return {
      manufacturers:[],
      permisos:[],
      chargingStations:[],
      models:[],
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
    Multiselect
    
  },
  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async createCharger() {
      try {
        const response = await axios.post('http://localhost:8080/api/companies/current/chargers', this.charger);
        if (response.status === 200 || response.status === 201) {
          this.charger.oCPPid = '';
          this.charger.nombre = '';
          this.charger.alias = '';
          this.charger.manufacturerId = null;
          this.charger.modeloId = null;
          this.charger.terminal = null;
        }
        Swal.fire("Cargador Creado Exitosamente", "", "success").then(() => {
          this.$router.push('/company/cargadores-company');
        });
      } catch (error) {
        console.error("Error creando el cargador:", error);
        Swal.fire("Error al crear el cargador ", "", "error")
      }
    },
    async chargerManufacturers() {
      try {
        const response = await axios.get('http://localhost:8080/api/manufacturers');
        this.manufacturers = response.data.map(data => ({
          label: data.name,
          value: data.id
        }));
      } catch (error) {
        console.error("Error creando el cargador:", error);
      }
    },
    async chargerModels() {
      try {
        const response = await axios.get('http://localhost:8080/api/models');
        this.models = response.data.map(data => ({
          label: data.name,
          value: data.id
        }));
      } catch (error) {
        console.error("Error creando el cargador:", error);
      }
    },
    async chargingStations2() {
      try {
        const response = await axios.get('http://localhost:8080/api/chargingStations');
        this.chargingStations = response.data.map(data => ({
          label: data.nombreTerminal,
          value: data.id
        }));
      } catch (error) {
        console.error("Error creando el cargador:", error);
      }
    }
  },
  created() {
    this.chargerManufacturers()
    this.chargerModels()
    this.chargingStations2()
    this.loadUserData()
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
