<template>
  <Layout>
    <PageHeader title="Reportes de Carga" pageTitle="Compañía" />

    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="d-flex justify-content-between mb-3 align-items-center">
        <div class="d-flex align-items-center">
          <!-- Input de búsqueda -->
          <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar"
              style="margin-right: 15px;"
          />
        </div>
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center me-3">
            <flat-pickr
                v-model="dateRange"
                class="form-control"
                style="width: auto;"
                placeholder="Seleccionar Fecha"
            ></flat-pickr>
            <BButton style="padding: 5px 10px; margin-left: 10px; border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light" @click="clearDateRange">
              <i class="mdi mdi-delete"></i>
            </BButton>
          </div>
          <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
          <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
        </div>
      </div>
      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive table-card">
            <table class="table align-middle table-nowrap" id="customerTable">
              <thead class="table-light text-muted">
                <tr>
                  <th class="sort" scope="col" @click="onSort('fecha')">Fecha</th>
                  <th class="sort" scope="col" @click="onSort('estacionDeCarga')">Estación De Carga</th>
                  <th class="sort" scope="col" @click="onSort('cargador')">Cargador</th>
                  <th class="sort" scope="col" @click="onSort('conector')">Conector</th>
                  <th class="sort" scope="col" @click="onSort('idCargador')">ID Cargador</th>
                  <th class="sort" scope="col" @click="onSort('modelo')">Modelo</th>
                  <th class="sort" scope="col" @click="onSort('tipo')">Tipo</th>
                  <th class="sort" scope="col" @click="onSort('estado')">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="list form-check-all">
                <template v-for="(dat, index) in resultQuery" :key="index">
                  <tr>
                    <td>{{ dat.fecha }}</td>
                    <td>{{ dat.estacionDeCarga }}</td>
                    <td class="high">{{ dat.cargador }}</td>
                    <td class="market_cap">{{ dat.conector }}</td>
                    <td class="low">{{ dat.idCargador }}</td>
                    <td class="market_cap">{{ dat.modelo }}</td>
                    <td class="market_cap">{{ dat.tipo }}</td>
                    <td>
                      <BBadge v-if="dat.estado === 'Disponible'" variant="border border-success" class="border border-success text-success">
                        Disponible
                      </BBadge>
                      <BBadge v-else variant="border border-danger" class="border border-danger text-danger">
                        No Disponible
                      </BBadge>
                    </td>
                    <td>
                      <BButton variant="link" class="btn-sm" @click="toggleCollapse(dat)">
                        <i :class="dat.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                      </BButton>
                    </td>
                  </tr>
                  <tr v-if="dat.expanded">
                    <td colspan="9">
                      <div class="card-body p-0">
                        <table class="table mb-0" style="margin-top: -10px">
                          <thead>
                            <tr>
                              <th>Inicio Carga</th>
                              <th>Fin Carga</th>
                              <th>Tiempo Total</th>
                              <th>Tiempo Cobrado</th>
                              <th>Inicio kWh</th>
                              <th>Fin kWh</th>
                              <th>Total kWh</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ dat.inicioCarga }}</td>
                              <td>{{ dat.finCarga }}</td>
                              <td>{{ dat.tiempoTotal }}</td>
                              <td>{{ dat.tiempoCobrado }}</td>
                              <td>{{ dat.iniciokwh }}</td>
                              <td>{{ dat.finkwh }}</td>
                              <td>{{ dat.totalkwh }}</td>
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
          <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
            <div class="pagination-wrap hstack gap-2">
              <BLink class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="previousPage">
                Anterior
              </BLink>
              <ul class="pagination listjs-pagination mb-0">
                <li :class="{
              active: pageNumber == page,
              disabled: pageNumber == '...',
            }" v-for="pageNumber in displayedPages" :key="pageNumber"
                    @click="goToPage(pageNumber)">
                  <BLink class="page" href="#">{{ pageNumber }}</BLink>
                </li>
              </ul>
              <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="nextPage">
                Siguiente
              </BLink>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import * as XLSX from 'xlsx';
import flatPickr from "vue-flatpickr-component";

export default {
  components: {
    flatPickr,
    Layout,
    PageHeader,
  },
  data() {
    return {
      dateRange: null,
      searchQuery: null,
      filterDate: null,
      data: [
        { fecha: "2024-07-24 08:30:00", estacionDeCarga: "Estación Vitacura", cargador: "Cargador1", conector: "Uno", idCargador: "STG-EMU-00002", modelo: "ABB_Terra 54_Auto Emu 5", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "07-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.19", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-23 10:20:00", estacionDeCarga: "Estación Las Condes", cargador: "Cargador2", conector: "Dos", idCargador: "STG-EMU-00003", modelo: "Infypower_EXP180K2FT_Auto Emu 8", tipo: "cable", estado: "No Disponible", expanded: false, inicioCarga: "06-08-2024 11:34:38", finCarga: "07-08-2024 14:56:39", tiempoTotal: "00:24:31", tiempoCobrado: "01:25:31", iniciokwh: "0.29", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-22 12:00:00", estacionDeCarga: "Estación Chorrillos", cargador: "Cargador3", conector: "Tres", idCargador: "STG-EMU-00004", modelo: "ABB_Terra 54_Auto Emu 6", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "05-07-2024 23:10:01", finCarga: "07-08-2024 14:56:39", tiempoTotal: "02:23:19", tiempoCobrado: "01:25:31", iniciokwh: "0.05", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-21 14:15:00", estacionDeCarga: "Estación Viña del Mar", cargador: "Cargador4", conector: "Cuatro", idCargador: "STG-EMU-00005", modelo: "ABB_Terra 54_Auto Emu 5", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "04-07-2024 22:21:12", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:10:51", tiempoCobrado: "01:25:31", iniciokwh: "1.07", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-20 16:30:00", estacionDeCarga: "Estación Lima", cargador: "Cargador5", conector: "Cinco", idCargador: "STG-EMU-00006", modelo: "ABB_Terra 54_Auto Emu 7", tipo: "cable", estado: "No Disponible", expanded: false, inicioCarga: "12-06-2024 04:12:09", finCarga: "07-08-2024 14:56:39", tiempoTotal: "03:45:21", tiempoCobrado: "01:25:31", iniciokwh: "1.24", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-19 18:45:00", estacionDeCarga: "Estación Santiago", cargador: "Cargador6", conector: "Seis", idCargador: "STG-EMU-00007", modelo: "ABB_Terra 54_Auto Emu 8", tipo: "cable", estado: "No Disponible", expanded: false, inicioCarga: "10-06-2024 17:54:11", finCarga: "07-08-2024 14:56:39", tiempoTotal: "00:15:33", tiempoCobrado: "01:25:31", iniciokwh: "0.89", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-18 20:50:00", estacionDeCarga: "Estación La Paz", cargador: "Cargador7", conector: "Siete", idCargador: "STG-EMU-00008", modelo: "ABB_Terra 54_Auto Emu 9", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "07-06-2024 08:43:44", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:40:32", tiempoCobrado: "01:25:31", iniciokwh: "0.01", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-17 22:55:00", estacionDeCarga: "Estación Barranquilla", cargador: "Cargador8", conector: "Ocho", idCargador: "STG-EMU-00009", modelo: "ABB_Terra 54_Auto Emu 10", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "03-06-2024 13:00:17", finCarga: "07-08-2024 14:56:39", tiempoTotal: "00:05:23", tiempoCobrado: "01:25:31", iniciokwh: "0.32", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-16 23:00:00", estacionDeCarga: "Estación Cochabamba", cargador: "Cargador9", conector: "Nueve", idCargador: "STG-EMU-00010", modelo: "ABB_Terra 54_Auto Emu 11", tipo: "cable", estado: "No Disponible", expanded: false, inicioCarga: "01-06-2024 12:32:43", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:30:12", tiempoCobrado: "01:25:31", iniciokwh: "0.53", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-15 23:05:00", estacionDeCarga: "Estación Cartagena", cargador: "Cargador10", conector: "Diez", idCargador: "STG-EMU-00011", modelo: "ABB_Terra 54_Auto Emu 12", tipo: "cable", estado: "Disponible", expanded: false, inicioCarga: "30-05-2024 04:55:19", finCarga: "07-08-2024 14:56:39", tiempoTotal: "00:25:45", tiempoCobrado: "01:25:31", iniciokwh: "0.91", finkwh: "22.65", totalkwh: "22.56" }
      ],
      page: 1,
      itemsPerPage: 5,
      filter: '',
      searchFilter: '',
      sortColumn: '',
      sortOrder: 'asc',
    };
  },
  computed: {
    filteredData() {
      const filtered = this.data.filter((d) => {
        return (
          d.fecha.toLowerCase().includes(this.filterDate?.toLowerCase() || '') &&
          d.estacionDeCarga.toLowerCase().includes(this.searchFilter?.toLowerCase() || '')
        );
      });

      return this.sortData(filtered);
    },
    resultQuery() {
      return this.paginate(this.filteredData);
    },
    pages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    displayedPages() {
      const pages = [];
      for (let i = 1; i <= this.pages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    clearDateRange() {
      this.dateRange = null;
    },
    paginate(data) {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return data.slice(start, end);
    },
    goToPage(pageNumber) {
      if (pageNumber !== '...') {
        this.page = pageNumber;
      }
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    nextPage() {
      if (this.page < this.pages) {
        this.page++;
      }
    },
    exportToCSV() {
      const csvData = this.filteredData.map((d) => ({
        Fecha: d.fecha,
        Estación_De_Carga: d.estacionDeCarga,
        Cargador: d.cargador,
        Conector: d.conector,
        ID_Cargador: d.idCargador,
        Modelo: d.modelo,
        Tipo: d.tipo,
        Estado: d.estado,
        Inicio_Carga: d.inicioCarga,
        Fin_Carga: d.finCarga,
        Tiempo_Total: d.tiempoTotal,
        Tiempo_Cobrado: d.tiempoCobrado,
        Inicio_kWh: d.iniciokwh,
        Fin_kWh: d.finkwh,
        Total_kWh: d.totalkwh,
      }));

      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
      XLSX.writeFile(wb, 'reportes_de_carga.csv');
    },
    exportToExcel() {
      const excelData = this.filteredData.map((d) => ({
        Fecha: d.fecha,
        Estación_De_Carga: d.estacionDeCarga,
        Cargador: d.cargador,
        Conector: d.conector,
        ID_Cargador: d.idCargador,
        Modelo: d.modelo,
        Tipo: d.tipo,
        Estado: d.estado,
        Inicio_Carga: d.inicioCarga,
        Fin_Carga: d.finCarga,
        Tiempo_Total: d.tiempoTotal,
        Tiempo_Cobrado: d.tiempoCobrado,
        Inicio_kWh: d.iniciokwh,
        Fin_kWh: d.finkwh,
        Total_kWh: d.totalkwh,
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
      XLSX.writeFile(wb, 'reportes_de_carga.xlsx');
    },
    onSort(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
    },
    sortData(data) {
      return data.sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];

        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    toggleCollapse(item) {
      item.expanded = !item.expanded;
    },
  },
};
</script>

<style>
.sort:hover {
  cursor: pointer;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
