<template>
  <Layout>
    <PageHeader title="Asignar Tarifas" pageTitle="items" />

    <BRow>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchStations"
              placeholder="Buscar estación..."
              v-model="connectorSearchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <div class="table-responsive" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col">
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        @click="toggleSelectAllConnectors"
                        :checked="allConnectorsSelected"
                        style="border-radius: 10px"
                    >
                    <label class="form-check-label"></label>
                  </div>
                </th>
                <th scope="col">Estación</th>
                <th scope="col">Cargador</th>
                <th scope="col">Conector</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="conector in filteredConnectors" :key="conector.id" @click="toggleConnectorSelection(conector)">
                <td>
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'check' + conector.id"
                        v-model="selectedConnectors"
                        :value="conector"
                        @click.stop
                        style="border-radius: 10px"
                    />
                    <label class="form-check-label" :for="'check' + conector.id"></label>
                  </div>
                </td>
                <td>{{ conector.nombreTerminal }}</td>
                <td>{{ conector.idCargador }}</td>
                <td>{{ conector.alias }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BCol>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchList"
              placeholder="Buscar tarifa..."
              v-model="searchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <BCardBody class="border-end" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th></th>
                <th scope="col">Nombre</th>
                <th scope="col">Costo</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(tarifa, index) in resultQuery" :key="index" @click="selectPlan(tarifa)">
                <td>
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        :value="tarifa"
                        v-model="selectedTarifa"
                        :id="'tarifa' + tarifa.id"
                        @click.stop
                    />
                    <label class="form-check-label" :for="'tarifa' + tarifa.id"></label>
                  </div>
                </td>
                <td>{{ tarifa.nombreTarifa }}</td>
                <td>{{ tarifa.precioTarifa }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-if="selectedTarifa && selectedConnectors.length > 0" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
            <div>
              <h5>Tarifa Seleccionada</h5>
              <p class="mb-1"><strong>Nombre:</strong> {{ selectedTarifa.nombreTarifa }}</p>
              <p><strong>Costo:</strong> {{ selectedTarifa.precioTarifa }}</p>
            </div>
            <div class="ms-auto me-3">
              <BButton variant="light" @click="assignPlan">Asignar Tarifa</BButton>
            </div>
          </div>
        </BCardBody>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      searchQuery: '',
      connectorSearchQuery: '',
      selectedTarifa: null,
      selectedConnectors: [],
      connectors: [],
      tarifas: [],
      allConnectorsSelected: false,
    };
  },

  computed: {
    resultQuery() {
      return this.tarifas.filter((tarifa) => {
        return tarifa.nombreTarifa.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    filteredConnectors() {
      return this.connectors.filter(conector =>
          conector.nombreTerminal.toLowerCase().includes(this.connectorSearchQuery.toLowerCase())
      );
    },
  },

  methods: {
    fetchTarifas() {
      axios.get("https://app.evolgreen.com:8080/api/fees")
          .then(response => {
            this.tarifas = response.data;
          })
          .catch(error => {
            console.error("Error al obtener tarifas:", error);
          });
    },

    fetchConnectors() {
      axios.get("https://app.evolgreen.com:8080/api/connectors")
          .then(response => {
            this.connectors = response.data;
          })
          .catch(error => {
            console.error("Error al obtener conectores:", error);
          });
    },

    toggleConnectorSelection(conector) {
      const index = this.selectedConnectors.findIndex(c => c.id === conector.id);
      if (index > -1) {
        this.selectedConnectors.splice(index, 1);  // Deselect if already selected
      } else {
        this.selectedConnectors.push(conector);    // Select if not selected
      }
    },
    selectPlan(plan) {
      this.selectedTarifa = plan;
    },

    toggleSelectAllConnectors() {
      if (this.allConnectorsSelected) {
        this.selectedConnectors = [];
      } else {
        this.selectedConnectors = [...this.connectors];
      }
      this.allConnectorsSelected = !this.allConnectorsSelected;
    },

    assignPlan() {
      if (this.selectedTarifa && this.selectedConnectors.length > 0) {
        // Mapeamos cada conector seleccionado y realizamos una solicitud PATCH
        const requests = this.selectedConnectors.map(conector => {
          return axios.patch(`https://app.evolgreen.com:8080/api/connectors/${conector.id}/assign-fee`, null, {
            params: {
              tarifaId: this.selectedTarifa.id
            }
          });
        });

        // Ejecutar todas las solicitudes en paralelo
        Promise.all(requests)
            .then(() => {
              Swal.fire("Tarifa asignada exitosamente!", "", "success");
              this.selectedConnectors = []; // Resetea los conectores seleccionados después de asignar
            })
            .catch(error => {
              console.error("Error al asignar tarifa:", error);
              Swal.fire("Error al asignar tarifa", "No se pudo asignar la tarifa", "error");
            });
      } else {
        Swal.fire("Error", "Seleccione una tarifa y al menos un conector antes de asignar", "warning");
      }
    }
  },

  created() {
    this.fetchTarifas();
    this.fetchConnectors();
  },
};
</script>

<style scoped>
.search-box {
  position: relative;
}

.search-box .form-control {
  padding-left: 40px;
}

.search-box .search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}
</style>
