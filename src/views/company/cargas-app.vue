<template>
  <Layout>
    <PageHeader title="Reportes de Carga App" />
    
    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="d-flex justify-content-between mb-3 align-items-center">
        <div class="d-flex align-items-center">
          <!-- Input de búsqueda -->
          <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Reporte ..."
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
<!--          <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;-->
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
            <tr v-for="(dat, index) of paginatedQuery" :key="index">
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
      itemsPerPage: 5,
      data: []
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.resultQuery.length / this.itemsPerPage);
    },
    paginatedQuery() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.resultQuery.slice(start, end);
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
      let filteredData = [...this.data];

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return (
              data.estacionDeCarga.toLowerCase().includes(search) ||
              data.conector.toLowerCase().includes(search) ||
              data.usuario.toLowerCase().includes(search) ||
              data.idCargador.toLowerCase().includes(search) ||
              data.energia.toLowerCase().includes(search) ||
              data.costo.toString().toLowerCase().includes(search)
          );
        });
      }

      if (this.dateRange) {
        // Verificamos si dateRange es un string y contiene "to"
        if (typeof this.dateRange === 'string' && this.dateRange.includes(' to ')) {
          const [startDateStr, endDateStr] = this.dateRange.split(' to ');

          // Convertimos los strings a Date
          const startDate = new Date(`${startDateStr}T00:00:00.000Z`);
          const endDate = new Date(`${endDateStr}T23:59:59.999Z`);

          filteredData = filteredData.filter((data) => {
            const inicioCarga = new Date(data.inicioCarga);
            return inicioCarga >= startDate && inicioCarga <= endDate;
          });
        }
        // Si no contiene "to", entonces es una sola fecha
        else if (typeof this.dateRange === 'string') {
          const startDate = new Date(`${this.dateRange}T00:00:00.000Z`);
          const endDate = new Date(`${this.dateRange}T23:59:59.999Z`);

          filteredData = filteredData.filter((data) => {
            const inicioCarga = new Date(data.inicioCarga);
            return inicioCarga >= startDate && inicioCarga <= endDate;
          });
        }
      }


      if (this.sortBy) {
        filteredData.sort((a, b) => {
          const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
          return this.sortDesc ? -result : result;
        });
      }

      return filteredData;
    },
  },
  watch: {
    searchQuery() {
      this.page = 1;
    }
  },
  created() {
    this.fetchReportes();
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
    // exportToCSV() {
    //   const headers = [
    //     "Estación de Carga", "Conector", "Inicio de Carga","Fin Carga", "Usuario",  "ID Cargador",   "Energía", "Tiempo"
    //   ];
    //   const rows = this.filteredData.map(item => [
    //     item.estacionDeCarga, item.cargador, item.conector, item.inicioCarga, item.finCarga, item.usuario,  item.idCargador,  item.energia, item.tiempo
    //   ]);
    //   const csvContent = "data:text/csv;charset=utf-8," +
    //     headers.join(",") + "\n" +
    //     rows.map(e => e.join(",")).join("\n");
    //
    //   const encodedUri = encodeURI(csvContent);
    //   const link = document.createElement("a");
    //   link.setAttribute("href", encodedUri);
    //   link.setAttribute("download", "reportes_de_carga.csv");
    //   document.body.appendChild(link);
    //   link.click();
    // },
    exportToExcel() {
      // Definimos los encabezados en el mismo orden en que aparecen en la tabla
      const headers = [
        "Estación de Carga",
        "Conector",
        "Inicio de Carga",
        "Fin de Carga",
        "Usuario",
        "ID Cargador",
        "Energía (kWh)",
        "Costo ($)",
        "Tiempo"
      ];

      // Ordenamos los datos en el mismo orden de las columnas de la tabla
      const rows = this.resultQuery.map(item => {
        return {
          "Estación de Carga": item.estacionDeCarga,
          "Conector": item.conector,
          "Inicio de Carga": this.formatDate(item.inicioCarga),
          "Fin de Carga": this.formatDate(item.finCarga),
          "Usuario": item.usuario,
          "ID Cargador": item.idCargador,
          "Energía (kWh)": item.energia + " kWh",
          "Costo ($)": "$" + item.costo,
          "Tiempo": item.tiempo
        };
      });

      // Creamos la hoja de Excel y agregamos los encabezados y datos
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });

      // Ajustamos el ancho de las columnas para una mejor visualización
      const columnWidths = [
        { wch: 20 },  // Estación de Carga
        { wch: 15 },  // Conector
        { wch: 25 },  // Inicio de Carga
        { wch: 25 },  // Fin de Carga
        { wch: 20 },  // Usuario
        { wch: 15 },  // ID Cargador
        { wch: 15 },  // Energía (kWh)
        { wch: 15 },  // Costo ($)
        { wch: 15 }   // Tiempo
      ];
      worksheet["!cols"] = columnWidths;

      // Creamos el libro de Excel
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes de Carga");

      // Exportamos el archivo
      XLSX.writeFile(workbook, "reportes_de_carga.xlsx");
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
