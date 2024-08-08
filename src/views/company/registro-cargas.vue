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
                <th class="sort" data-sort="high" scope="col" @click="onSort('fecha')">Fecha</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('estacionDeCarga')">Estación De Carga</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('cargador')">Cargador</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('conector')">Conector</th>
                <th class="sort" data-sort="low" scope="col" @click="onSort('idCargador')">ID Cargador</th>
                <th class="sort" data-sort="current_value" scope="col" @click="onSort('modelo')">Modelo</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('tipo')">Tipo</th>
                <th class="sort" data-sort="pairs" scope="col" @click="onSort('estado')">Estado</th>
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
import Swal from "sweetalert2";
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
      // reportData: [
      //   { inicioCarga: "2024-07-24 08:30:00", usuario: "Usuario1", cargador: "Cargador1", idCargador: "STG-EMU-00002", conector: "Uno", finCarga: "2024-07-24 09:35:00", energia: "15.98 kWh", tiempo: "01:05:46" },
      //   { inicioCarga: "2024-07-23 10:20:00", usuario: "Usuario2", cargador: "Cargador2", idCargador: "STG-EMU-00003", conector: "Dos", finCarga: "2024-07-23 11:15:00", energia: "13.47 kWh", tiempo: "00:55:00" },
      //   { inicioCarga: "2024-07-22 12:00:00", usuario: "Usuario3", cargador: "Cargador3", idCargador: "STG-EMU-00004", conector: "Tres", finCarga: "2024-07-22 13:05:00", energia: "18.76 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-21 14:15:00", usuario: "Usuario4", cargador: "Cargador4", idCargador: "STG-EMU-00005", conector: "Cuatro", finCarga: "2024-07-21 15:20:00", energia: "14.56 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-20 16:30:00", usuario: "Usuario5", cargador: "Cargador5", idCargador: "STG-EMU-00006", conector: "Cinco", finCarga: "2024-07-20 17:45:00", energia: "16.23 kWh", tiempo: "01:15:00" },
      //   { inicioCarga: "2024-07-19 18:45:00", usuario: "Usuario6", cargador: "Cargador6", idCargador: "STG-EMU-00007", conector: "Seis", finCarga: "2024-07-19 19:50:00", energia: "17.89 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-18 20:00:00", usuario: "Usuario7", cargador: "Cargador7", idCargador: "STG-EMU-00008", conector: "Siete", finCarga: "2024-07-18 21:05:00", energia: "19.45 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-17 22:15:00", usuario: "Usuario8", cargador: "Cargador8", idCargador: "STG-EMU-00009", conector: "Ocho", finCarga: "2024-07-17 23:20:00", energia: "20.12 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-16 23:30:00", usuario: "Usuario9", cargador: "Cargador9", idCargador: "STG-EMU-00010", conector: "Nueve", finCarga: "2024-07-17 00:35:00", energia: "21.56 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-15 01:00:00", usuario: "Usuario10", cargador: "Cargador10", idCargador: "STG-EMU-00011", conector: "Diez", finCarga: "2024-07-15 02:05:00", energia: "22.34 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-14 03:15:00", usuario: "Usuario11", cargador: "Cargador11", idCargador: "STG-EMU-00012", conector: "Once", finCarga: "2024-07-14 04:20:00", energia: "23.78 kWh", tiempo: "01:05:00" },
      //   { inicioCarga: "2024-07-13 05:30:00", usuario: "Usuario12", cargador: "Cargador12", idCargador: "STG-EMU-00013", conector: "Doce", finCarga: "2024-07-13 06:35:00", energia: "24.56 kWh", tiempo: "01:05:00" },
      // ],
      data: [
        { fecha: "2024-07-24 08:30:00",  estacionDeCarga : "Estación Vitacura" , cargador: "Cargador1", conector: "Uno", idCargador: "STG-EMU-00002",  modelo: "ABB_Terra 54_Auto Emu 5", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"07-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.19", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-23 10:20:00", estacionDeCarga : "Estación Las Condes" , cargador: "Cargador2", conector: "Dos", idCargador: "STG-EMU-00003", modelo: "Infypower_EXP180K2FT_Auto Emu 8", tipo: "cable", estado: "No Disponible", expanded:false, inicioCarga:"06-08-2024 11:34:38", finCarga: "07-08-2024 14:56:39", tiempoTotal: "00:24:31", tiempoCobrado: "01:25:31", iniciokwh: "0.29", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-22 12:00:00", estacionDeCarga : "Estación Chorrillos" , cargador: "Cargador3", conector: "Tres", idCargador: "STG-EMU-00004",  modelo: "ABB_Terra 54_Auto Emu 6", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"05-07-2024 23:10:01", finCarga: "07-08-2024 14:56:39", tiempoTotal: "02:23:19", tiempoCobrado: "01:25:31", iniciokwh: "0.05", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-21 14:15:00", estacionDeCarga : "Estación Viña del Mar" , cargador: "Cargador4", conector: "Cuatro",idCargador: "STG-EMU-00005", modelo: "ABB_Terra 54_Auto Emu 5", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"04-07-2024 22:21:12", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:10:51", tiempoCobrado: "01:25:31", iniciokwh: "1.07", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-20 16:30:00", estacionDeCarga : "Estación Lima" , cargador: "Cargador5", conector: "Cinco",  idCargador: "STG-EMU-00006", modelo: "ABB_Terra 54_Auto Emu 7", tipo: "cable", estado: "No Disponible", expanded:false, inicioCarga:"12-06-2024 04:12:09", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:08:11", tiempoCobrado: "01:25:31", iniciokwh: "2.08", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-19 18:45:00", estacionDeCarga : "Estación Trujillo" , cargador: "Cargador6", conector: "Seis",  idCargador: "STG-EMU-00007", modelo: "Infypower_EXP180K2FT_Auto Emu 8", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"01-08-2024 00:54:32", finCarga: "07-08-2024 14:56:39", tiempoTotal: "03:22:01", tiempoCobrado: "01:25:31", iniciokwh: "4.09", finkwh: "22.65", totalkwh: "22.56"},
        { fecha: "2024-07-18 20:00:00", estacionDeCarga : "Estación Puente Alto" , cargador: "Cargador7", conector: "Siete",  idCargador: "STG-EMU-00008", modelo: "StarCharge_DH-DC1800SG40-B_Auto Emulador 2", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"07-08-2024 21:42:11", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-17 22:15:00", estacionDeCarga : "Estación Concepción" , cargador: "Cargador8", conector: "Ocho",   idCargador: "STG-EMU-00009", modelo: "ABB_Terra 54_Auto Emu 6", tipo: "cable", estado: "No Disponible", expanded:false, inicioCarga:"21-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-16 23:30:00", estacionDeCarga : "Estación Providencia" , cargador: "Cargador9", conector: "Nueve",  idCargador: "STG-EMU-00010", modelo: "StarCharge_DH-DC1800SG40-B_Auto Emulador 1", tipo: "cable", estado: "No Disponible", expanded:false, inicioCarga:"17-07-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-15 01:00:00", estacionDeCarga : "Estación Miami" , cargador: "Cargador10",conector: "Diez",  idCargador: "STG-EMU-00011", modelo: "Infypower_EXP180K2FT_Auto Emu 8", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"05-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56" },
        { fecha: "2024-07-14 03:15:00", estacionDeCarga : "Estación Central" , cargador: "Cargador11",conector: "Once",   idCargador: "STG-EMU-00012", modelo: "ABB_Terra 54_Auto Emu 6", tipo: "cable", estado: "No Disponible", expanded:false, inicioCarga:"07-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56"},
        { fecha: "2024-07-13 05:30:00", estacionDeCarga : "Estación Miramar" , cargador: "Cargador12",conector: "Doce",   idCargador: "STG-EMU-00013", modelo: "StarCharge_DH-DC1800SG40-B_Auto Emulador 2", tipo: "cable", estado: "Disponible", expanded:false, inicioCarga:"07-08-2024 13:31:08", finCarga: "07-08-2024 14:56:39", tiempoTotal: "01:25:31", tiempoCobrado: "01:25:31", iniciokwh: "0.09", finkwh: "22.65", totalkwh: "22.56" },
      ],
      page: 1,
      perPage: 5,
      pages: [],
    };
  },
  computed: {
    displayedPages() {
      let startPage = Math.max(this.page - 1, 1);
      let endPage = Math.min(startPage + 2, this.pages.length);

      if (endPage - startPage < 2) {
        startPage = Math.max(endPage - 2, 1);
      }

      let pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    filteredData() {
      if (!this.filterDate) return this.data;
      return this.data.filter(item => {
        const date = new Date(item.estacionDeCarga);
        return date.toISOString().startsWith(this.filterDate.toISOString().split('T')[0]);
      });
    },
    // filteredPlans() {
    //   const query = this.searchQuery.toLowerCase();
    //   return this.data.filter(dat => dat.name.toLowerCase().includes(query));
    // },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
              data.fecha.toLowerCase().includes(search) ||
              data.estacionDeCarga.toLowerCase().includes(search) ||
              data.cargador.toLowerCase().includes(search) ||
              data.conector.toLowerCase().includes(search) ||
              data.idCargador.toLowerCase().includes(search) ||
              data.modelo.toLowerCase().includes(search) ||
              data.tipo.toLowerCase().includes(search) ||
              data.estado.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
  },
  watch: {
    posts() {
      this.setPages();
    },
  },
  created() {
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  methods: {
    clearDateRange() {
      this.dateRange = null;
    },
    toggleCollapse(dat) {
      dat.expanded = !dat.expanded;
    },
    exportToCSV() {
      const headers = [
        "Fecha","Estación de Carga","Cargador", "Conector", "ID Cargador", "Modelo", "Tipo", "Estado"
      ];
      const rows = this.filteredData.map(item => [
        item.fecha, item.estacionDeCarga, item.cargador, item.conector, item.idCargador,  item.modelo, item.tipo, item.estado,
      ]);
      const csvContent = "data:text/csv;charset=utf-8," +
          headers.join(",") + "\n" +
          rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "reportes_de_carga.csv");
      document.body.appendChild(link);
      link.click();
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.filteredData, {
        header: ["fecha","estacion de carga","cargador", "conector","idCargador", "modelo", "tipo", "estado"]
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reportes de Carga");
      XLSX.writeFile(wb, "reportes_de_carga.xlsx");
    },
    setPages() {
      let numberOfPages = Math.ceil(this.data.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(data) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return data.slice(from, to);
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
      if (this.page < this.pages.length) {
        this.page++;
      }
    },
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    },
    confirm() {
      Swal.fire({
        title: "Estas seguro de eliminar?",
        text: "No podras revertir la accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Tarifa 1 Eliminada", "", "success");
        }
      });
    }
  }
};
</script>

<style>
</style>
