<template>
  <Layout>
    <PageHeader title="Lista Estaciones" pageTitle="Estaciones de Carga" />
    <BRow>
      <div class="d-flex justify-content-between mb-3">
        <div class="search-container" style="flex: 0 1 250px;">
          <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Estación ..."
          />
        </div>

        <div class="d-flex align-items-center">
          <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
          <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
        </div>
      </div>
    </BRow>

    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
            <thead class="table-light text-muted">
            <tr>
              <th class="sort" scope="col" @click="onSort('terminalName')">Estación de Carga</th>
              <th class="sort" scope="col" @click="onSort('ubicacionTerminal')">Ubicación</th>
              <th></th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <template v-for="(dat, index) in resultQuery" :key="index">
              <tr>
                <td>{{ dat.nombreTerminal }}</td>
                <td>{{ dat.ubicacionTerminal.direccion }}</td>
                <td>
                  <BButton variant="link" class="btn-sm" @click="toggleCollapse(dat)">
                    <i :class="dat.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                  </BButton>
                </td>
              </tr>
              <tr v-if="dat.expanded">
                <td colspan="7">
                  <div class="card-body p-0">
                    <table class="table mt-1 mb-0" style="margin-top: -10px">
                      <thead>
                      <tr>
                        <th>Nombre Cargador</th>
                        <th>Alias Cargador</th>
                        <th>OcppID</th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="(charger, index) in dat.cargadores" :key="index">
                        <tr>
                          <td>{{ charger.nombre }}</td>
                          <td>{{ charger.alias }}</td>
                          <td>{{ charger.ocppid}}</td>
                          <td>
                            <BButton variant="link" class="btn-sm" @click="toggleCollapseCharger(charger)">
                              <i :class="charger.expanded2 ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                            </BButton>
                          </td>
                        </tr>
                        <tr v-if="charger.expanded2">
                          <td colspan="7">
                            <div class="card-body p-0">
                              <table class="table mt-1 mb-0" style="margin-top: -10px">
                                <thead>
                                <tr>
                                  <th>Tipo Conector</th>
                                  <th>Alias Conector</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(conector, idx) in charger.conectores" :key="idx">
                                  <td><img src="@/assets/images/logcarg.svg" width="15px" alt=""> {{ conector.tipoConector.nombre }}</td>
                                  <td>{{ conector.alias }}</td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2">
            <BLink class="page-item pagination-prev" :disabled="page <= 1" @click.prevent.stop="previousPage">
              Anterior
            </BLink>
            <ul class="pagination listjs-pagination mb-0">
              <li :class="{
                  active: pageNumber == page,
                  disabled: pageNumber == '...',
                          }" v-for="pageNumber in displayedPages" :key="pageNumber">
                <BLink class="page" href="#" @click.prevent.stop="goToPage(pageNumber)">
                  {{ pageNumber }}
                </BLink>
              </li>
            </ul>
            <BLink class="page-item pagination-next" :disabled="page >= pages.length" @click.prevent.stop="nextPage">
              Siguiente
            </BLink>
          </div>
        </div>
      </BCardBody>
    </BCard>
    <!--    </div>-->
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      searchQuery: '',
      exManualSelected: null,
      estaciones: [],
      page: 1,
      itemsPerPage: 5,
      sortBy: null,
      sortDesc: false,
      intervalId: null,
    };
  },
  computed: {
    resultQuery() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      let sortedData = [...this.estaciones];

      // Filtrar por el valor ingresado en el campo de búsqueda (searchQuery)
      if (this.searchQuery) {
        const lowerSearchQuery = this.searchQuery.toLowerCase();
        sortedData = sortedData.filter(item =>
            item.nombreTerminal.toLowerCase().includes(lowerSearchQuery) ||
            item.ubicacionTerminal.direccion.toLowerCase().includes(lowerSearchQuery)
        );
      }

      if (this.sortBy) {
        sortedData.sort((a, b) => {
          const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
          return this.sortDesc ? -result : result;
        });
      }

      return sortedData.slice(start, end);
    },
    pages() {
      return Math.ceil(this.estaciones.length / this.itemsPerPage);
    },
    displayedPages() {
      const totalPages = this.pages;
      const currentPage = this.page;
      const delta = 2;
      const range = [];
      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }
      if (currentPage - delta > 2) {
        range.unshift("...");
      }
      if (currentPage + delta < totalPages - 1) {
        range.push("...");
      }
      range.unshift(1);
      if (totalPages > 1) {
        range.push(totalPages);
      }
      return range;
    },
  },
  methods: {
    iniciarCarga(conector) {
      // Si ya hay un intervalo corriendo para este conector, no hagas nada
      if (conector.intervalId) return;

      // Potencia en curso comienza a 60 kW
      conector.potenciaEnCurso = conector.potenciaMaxima - 10;

      // Carga en curso comienza en 0 y aumentará hasta el 100%
      conector.cargaEnCurso = 0;

      // Barra de progreso que incrementa cada 2 segundos
      conector.intervalId = setInterval(() => {
        if (conector.cargaEnCurso < 100) {
          conector.cargaEnCurso += 1;
        } else {
          clearInterval(conector.intervalId); // Detener cuando llega al 100%
          conector.intervalId = null; // Limpiar el ID del intervalo
        }
      }, 2000); // Incrementa 1% cada 2 segundos
    },
    detenerCarga(conector) {
      // Detener la carga y la barra de progreso
      if (conector.intervalId) {
        clearInterval(conector.intervalId);
        conector.intervalId = null; // Limpiar el ID del intervalo
      }
      conector.potenciaEnCurso = 0;
      conector.cargaEnCurso = 0;
    },
    handleActionChange(conector) {
      if (conector.selectedAction === "1") { // Iniciar Carga
        this.iniciarCarga(conector);
      } else if (conector.selectedAction === "2") { // Detener Carga
        this.detenerCarga(conector);
      }
    },
    goToPage(pageNumber) {
      if (pageNumber === "...") return;
      this.page = pageNumber;
    },
    nextPage() {
      if (this.page < this.pages) {
        this.page++;
      }
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    onSort(sortKey) {
      if (this.sortBy === sortKey) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = sortKey;
        this.sortDesc = false;
      }
    },
    toggleCollapse(item) {
      item.expanded = !item.expanded;
    },
    toggleCollapseCharger(item) {
      item.expanded2 = !item.expanded2;
    },
    exportToCSV() {
      // Lógica para exportar a CSV
    },
    exportToExcel() {
      // Lógica para exportar a Excel
    },
    getRandomNumber(max) {
      return Math.floor(Math.random() * max);
    },
    async ChargingStation() {
      try {
        const response = await axios.get('https://app.evolgreen.com/api/chargingStations');
        this.estaciones = response.data.map(station => {
          // Agregamos 'expanded' a cada estación
          station.expanded = false;

          // Agregamos 'expanded2' a cada cargador dentro de cada estación
          station.cargadores = station.cargadores.map(charger => {
            charger.expanded2 = false;
            return charger;
          });
          return station;
        });
      } catch (error) {
        console.error("Error obteniendo las estaciones de carga:", error);
      }
    },
  },
  mounted() {
    this.ChargingStation();
  },
};
</script>

<style scoped>
.pagination .active .page {
  background-color: #20dcb5;
  border-color: #20dcb5;
  color: white;
}
.pagination .page {
  background-color: #ffffff;
  border-color: #e8e8e8;
  color: #303034;
}

.pagination-next {
  color: #575762;
}

.pagination-prev {
  color: #575762;
}
</style>
