<template>
    <Layout>
      <PageHeader title="Crear Conector" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Crear Conector" />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="createConnector">
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
                          v-model="connector.nConector"
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
                        <Multiselect
                            style="border: 1px solid black;"
                            v-model="connector.cargador"
                            :options="filteredChargers"
                            label="label"
                            track-by="value"
                            placeholder="Selecciona un cargador"
                            :close-on-select="true"
                            :searchable="true"
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="connectorType" class="form-label">Tipo de Conector</label>
                        <Multiselect
                            style="border: 1px solid black;"
                            v-model="connector.tipoConector"
                            :options="connectorTypes"
                            label="label"
                            track-by="label"
                            placeholder="Selecciona o ingrese un tipo de conector"
                            :close-on-select="true"
                            :searchable="true"
                            :create-option="true"
                        />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="station" class="form-label">Estación de Carga</label>
                        <Multiselect
                            style="border: 1px solid black;"
                            v-model="connector.terminal"
                            :options="filteredStations"
                            label="label"
                            track-by="value"
                            placeholder="Selecciona una estación"
                            :close-on-select="true"
                            :searchable="true"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="d-flex justify-content-between">
                        <BButton variant="light" @click="$router.push('/company/conector')">
                          Volver
                        </BButton>
                        <BButton style="" type="submit" variant="light">
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
  import Multiselect from "@vueform/multiselect";
  
  export default {
    data() {
      return {
        chargers: [], // Lista completa de cargadores
        filteredChargers: [], // Cargadores filtrados según la estación seleccionada

        chargingStations: [], // Lista completa de estaciones
        filteredStations: [],
        connectorTypes: [],
        connector: {
          alias: '',
          voltajeMaximo:'',
          potenciaMaxima:'',
          corrienteMaxima:'',
          nConector:'',
          cargador:'',
          tipoConector: '',
          terminal:''
        },
        config: {
          wrap: true, // set wrap to true only when using 'input-group'
          altFormat: "M j, Y",
          altInput: true,
          dateFormat: "d M, Y",
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
      async createConnector() {
        try {
          const conector = {
            ...this.connector,
            tipoConector: { id: this.connector.tipoConector }, // Enviar el objeto con el id
          };
          const response = await axios.post('http://localhost:8088/api/companies/current/connectors', conector);
          if (response.status === 200 || response.status === 201) {
            Swal.fire("Conector Creado Exitosamente", "", "success").then(() => {
              this.$router.push('/company/conector');
            });
          }
        } catch (error) {
          console.error("Error creando el conector:", error);
          Swal.fire("Error al crear el conector ", "", "error")
        }
      },
      async charges() {
        try {
          const response = await axios.get('http://localhost:8088/api/chargers');
          this.chargers = response.data.map(data => ({
            label: data.nombre,
            value: data.id,
            terminalId: data.terminalId
          }));
        } catch (error) {
          console.error("Error obteniendo las estaciones de carga:", error);
        }
      },
      async loadConnectorTypes() {
        try {
          const response = await axios.get('http://localhost:8088/api/connector-types');
          this.connectorTypes = response.data.map(data => ({
            label: data.nombre,
            value: data.id,
          }));
        } catch (error) {
          console.error("Error obteniendo los tipos de conector:", error);
        }
      },
      async chargingStation() {
        try {
          const response = await axios.get('http://localhost:8088/api/chargingStations');
          this.chargingStations = response.data.map(data => ({
            label: data.nombreTerminal,
            value: data.id,
            cargadores: data.cargadores
          }));
        } catch (error) {
          console.error("Error obteniendo las estaciones de carga:", error);
        }
      },
      async loadData() {
        await this.charges(); // Cargar cargadores
        await this.chargingStation(); // Cargar estaciones de carga
        await this.loadConnectorTypes(); // Cargar tipos de conectores

        // Ahora que los datos ya están cargados, asignamos las listas filtradas
        this.filteredChargers = [...this.chargers];
        this.filteredStations = [...this.chargingStations];
      }
    },
    created() {
      this.loadData();
    },
    watch: {
      // Cuando cambia el cargador seleccionado
      "connector.cargador"(newCharger) {
        if (!newCharger) {
          this.filteredStations = this.chargingStations; // Si no hay cargador, mostrar todas las estaciones
          return;
        }


        // Extraer el objeto real si es un Proxy
        const charger = this.chargers.find(c => c.value === (newCharger.value || newCharger));


        if (charger && charger.terminalId) {
          this.filteredStations = this.chargingStations.filter(station => station.value === charger.terminalId);
        } else {
          this.filteredStations = this.chargingStations;
        }
      },

      // Cuando cambia la estación seleccionada
      "connector.terminal"(newTerminal) {

        if (!newTerminal) {
          this.filteredChargers = this.chargers; // Si no hay estación, mostrar todos los cargadores
          return;
        }

        // Extraer el objeto real si es un Proxy
        const station = this.chargingStations.find(st => st.value === (newTerminal.value || newTerminal));


        if (station && station.cargadores) {
          // Filtrar cargadores que pertenezcan a la estación seleccionada
          this.filteredChargers = this.chargers.filter(c => station.cargadores.some(sC => sC.id === c.value));
        } else {
          this.filteredChargers = this.chargers; // Si no se encuentra, mostrar todos
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
  