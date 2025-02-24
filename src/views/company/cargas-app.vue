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
          <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
            <thead class="table-light text-muted">
            <tr>
              <th class="sort" scope="col" @click="onSort('estacionDeCarga')">Estación de Carga</th>
              <th class="sort pe-4" scope="col" @click="onSort('conector')">Conector</th>
              <th class="sort" scope="col" @click="onSort('inicioCarga')">Inicio de Carga</th>
              <th class="sort" scope="col" @click="onSort('finCarga')">Fin Carga</th>
              <th class="sort" scope="col" @click="onSort('usuario')">Usuario</th>
              <th class="sort" scope="col" @click="onSort('idCargador')">ID Cargador</th>
              <th class="sort" scope="col" @click="onSort('energia')">Energía</th>
              <th class="sort pe-4" scope="col" @click="onSort('costo')">Costo</th>
              <th class="sort" scope="col" @click="onSort('tiempo')">Tiempo</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.estacionDeCarga }}</td>
              <td>{{ dat.conector }}</td>
              <td>{{ formatDate(dat.inicioCarga) }}</td>
              <td>{{ formatDate(dat.finCarga) }}</td>
              <td>{{ dat.usuario }}</td>
              <td>{{ dat.idCargador }}</td>
              <td>{{ dat.energia }} kWh</td>
              <td>${{ dat.costo }} </td>
              <td>{{ dat.tiempo }}</td>
            </tr>
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
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import * as XLSX from 'xlsx';
import flatPickr from "vue-flatpickr-component";
import axios from 'axios';

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
      page: 1,
      perPage: 5,
      pages: [],
      data: []
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
              data.conector.toLowerCase().includes(search) ||
              data.inicioCarga.toLowerCase().includes(search) ||
              data.finCarga.toLowerCase().includes(search) ||
              data.usuario.toLowerCase().includes(search) ||
              data.idCargador.toLowerCase().includes(search) ||
              data.energia.toLowerCase().includes(search) ||
              data.tiempo.toLowerCase().includes(search) ||
              data.costo.toString().toLowerCase().includes(search)
          );
        });
      }

      if (this.dateRange) {
        // Separar las fechas del rango
        const [startDate, endDate] = this.dateRange.split(' to ');

        filteredData = filteredData.filter((data) => {
          return data.inicioCarga >= startDate && data.inicioCarga <= endDate;
        });
      }

      return this.paginate(filteredData);
    },
  },
  watch: {
    posts() {
      this.setPages();
    },
  },
  created() {
    this.fetchReportes();
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  methods: {
    async fetchReportes() {
      try {
        const response = await axios.get('http://localhost:8088/api/reportes-cargas')
        if (response.status === 200) {
          this.data = response.data; // Asigna los reportes cargados a la data
          this.setPages(); // Configura la paginación
        } else {
          console.error('Error al cargar los reportes:', response.data);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    },
    formatDate(value) {
      if (!value) return '';

      const [datePart, timePart] = value.split('T'); // Divide en "YYYY-MM-DD" y "HH:mm:ss.511174"
      const time = timePart ? timePart.split('.')[0] : '00:00:00'; // Toma solo "HH:mm:ss"

      return `${datePart} ${time}`; // Combina la fecha y la hora
    },
    updateSearchQuery() {
    },
    clearDateRange() {
      this.dateRange = null;
    },
    exportToCSV() {
      const headers = [
        "Estación de Carga", "Conector", "Inicio de Carga","Fin Carga", "Usuario",  "ID Cargador",   "Energía", "Tiempo"
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
        header: ["estacion de carga", "conector","inicioCarga",  "finCarga", "usuario", "idCargador", "energia", "tiempo"]
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
    }
  }
};
</script>

<style scoped>
.flex-shrink-0 {
  display: none;
}

.tama-dark {
  font-size: 15px;
}

.pagination .active .page {
  background-color: #20dcb5; /* Elige el color que prefieras */
  border-color: #20dcb5; /* Elige el color del borde */
  color: white; /* Color del texto */
}
.pagination .page {
  background-color: #ffffff; /* Elige el color que prefieras */
  border-color: #e8e8e8; /* Elige el color del borde */
  color: #303034; /* Color del texto */
}

.pagination-next {
  color: #575762; /* Color del texto */
}

.pagination-prev {
  color: #575762; /* Color del texto */
}
</style>
