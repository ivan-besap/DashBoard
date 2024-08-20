<template>
  <Layout>
    <PageHeader title="Cargas por Terminal" pageTitle="Compañía" />
    
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
                placeholder="Seleccionar Periodo"
                :config="{ mode: 'range', dateFormat: 'Y-m-d' }"
                @input="updateSearchQuery"
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
              <th class="sort" data-sort="high" scope="col" @click="onSort('estacionDeCarga')">Estación De Carga</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('carga')">Cargas</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('energia')">Energía</th>
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('tiempo')">Tiempo</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('costo')">Costo</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('inicioCarga')">Inicio Carga</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('finCarga')">Fin Carga</th>

            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) of resultQuery" :key="index">
              <td>{{ dat.estacionDeCarga }}</td>
              <td class="high">{{ dat.carga }}</td>
              <td class="market_cap">{{ dat.energia }}</td>
              <td class="market_cap">{{ dat.tiempo }}</td>
              <td class="market_cap">{{ dat.costo }}</td>
              <td class="market_cap">{{ dat.inicioCarga }}</td>
              <td class="market_cap">{{ dat.finCarga }}</td>
            </tr>
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
      dateRange:null,
      searchQuery: '',
      filterDate: null,
      data: [
        { estacionDeCarga: "Estación Vitacura", carga: 144, energia: "15.98 kWh", tiempo: "01:05:46", costo: "1234 CLP", inicioCarga: "2024-07-24 08:30:00", finCarga: "2024-07-24 09:35:46" },
        { estacionDeCarga: "Estación Las Condes", carga: 232, energia: "13.47 kWh", tiempo: "00:55:26", costo: "2345 CLP", inicioCarga: "2024-07-23 10:20:00", finCarga: "2024-07-23 11:15:26" },
        { estacionDeCarga: "Estación Chorrillos", carga: 3112, energia: "18.76 kWh", tiempo: "01:05:41", costo: "3456 CLP", inicioCarga: "2024-07-22 12:00:00", finCarga: "2024-07-22 13:05:41" },
        { estacionDeCarga: "Estación Viña del Mar", carga: 7, energia: "14.56 kWh", tiempo: "01:05:57", costo: "4567 CLP", inicioCarga: "2024-07-21 14:15:00", finCarga: "2024-07-21 15:20:57" },
        { estacionDeCarga: "Estación Lima", carga: 87, energia: "16.23 kWh", tiempo: "12:15:00", costo: "5678 CLP", inicioCarga: "2024-07-20 16:30:00", finCarga: "2024-07-21 04:45:00" },
        { estacionDeCarga: "Estación Trujillo", carga: 10, energia: "17.89 kWh", tiempo: "05:20:12", costo: "6789 CLP", inicioCarga: "2024-07-19 18:45:00", finCarga: "2024-07-20 00:05:12" },
        { estacionDeCarga: "Estación Puente Alto", carga: 7, energia: "19.45 kWh", tiempo: "01:32:26", costo: "7890 CLP", inicioCarga: "2024-07-18 20:00:00", finCarga: "2024-07-18 21:32:26" },
        { estacionDeCarga: "Estación Concepción", carga: 8, energia: "20.12 kWh", tiempo: "02:17:19", costo: "8901 CLP", inicioCarga: "2024-07-17 22:15:00", finCarga: "2024-07-18 00:32:19" },
        { estacionDeCarga: "Estación Providencia", carga: 9, energia: "21.56 kWh", tiempo: "04:44:14", costo: "9012 CLP", inicioCarga: "2024-07-16 23:30:00", finCarga: "2024-07-17 04:14:14" },
        { estacionDeCarga: "Estación Miami", carga: 10, energia: "22.34 kWh", tiempo: "03:58:09", costo: "10123 CLP", inicioCarga: "2024-07-15 01:00:00", finCarga: "2024-07-15 04:58:09" },
        { estacionDeCarga: "Estación Central", carga: 11, energia: "23.78 kWh", tiempo: "02:54:01", costo: "11234 CLP", inicioCarga: "2024-07-14 03:15:00", finCarga: "2024-07-14 06:09:01" },
        { estacionDeCarga: "Estación Miramar", carga: 12, energia: "24.56 kWh", tiempo: "20:10:34", costo: "12345 CLP", inicioCarga: "2024-07-13 05:30:00", finCarga: "2024-07-14 01:40:34" },
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
      let filteredData = this.data;

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return (
              data.estacionDeCarga.toLowerCase().includes(search) ||
              data.carga.toString().toLowerCase().includes(search) ||
              data.energia.toLowerCase().includes(search) ||
              data.tiempo.toLowerCase().includes(search) ||
              data.costo.toLowerCase().includes(search)
          );
        });
      }

      if (this.dateRange) {
        const [startDate, endDate] = this.dateRange.split(' to ');

        filteredData = filteredData.filter((data) => {
          return data.inicioCarga >= startDate && data.inicioCarga <= endDate;
        });
      }

      // Ahora aplicamos la paginación a los datos filtrados
      return this.paginate(filteredData);
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
    updateSearchQuery() {
    },
    clearDateRange() {
      this.dateRange = null;
    },
    exportToCSV() {
      const headers = [
        "Estación de Carga","Cargador", "Conector", "Inicio de Carga","Fin Carga", "Usuario",  "ID Cargador",   "Energía", "Tiempo"
      ];
      const rows = this.filteredData.map(item => [
        item.estacionDeCarga, item.cargador, item.conector, item.inicioCarga, item.finCarga, item.usuario,  item.idCargador,  item.energia, item.tiempo
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
        header: ["estacion de carga","cargador", "conector","inicioCarga",  "finCarga", "usuario", "idCargador", "energia", "tiempo"]
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
.flex-shrink-0 {
  display: none;
}

.tama-dark {
  font-size: 15px;
}
</style>
