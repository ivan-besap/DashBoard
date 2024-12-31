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
              <th class="sort" data-sort="high" scope="col" @click="onSort('estacionDeCarga')">Estación De Carga</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('cargador')">Cargador</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('conector')">Conector</th>
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('inicioCarga')">Inicio de Carga</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('finCarga')">Fin Carga</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('usuario')">Usuario</th>
              <th class="sort" data-sort="low" scope="col" @click="onSort('idCargador')">ID Cargador</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('energia')">Energía</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('tiempo')">Tiempo</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) of resultQuery" :key="index">
              <td>{{ dat.estacionDeCarga }}</td>
              <td class="high">{{ dat.cargador }}</td>
              <td class="market_cap">{{ dat.conector }}</td>
              <td>{{ dat.inicioCarga }}</td>
              <td class="market_cap">{{ dat.finCarga }}</td>
              <td class="pairs">{{ dat.usuario }}</td>
              <td class="low">{{ dat.idCargador }}</td>
              <td class="market_cap">{{ dat.energia }}</td>
              <td class="market_cap">{{ dat.tiempo }}</td>
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
        { estacionDeCarga : "Estación Vitacura" , cargador: "Cargador1", conector: "Uno", inicioCarga: "2024-07-24 08:30:00", usuario: "Usuario1",  idCargador: "STG-EMU-00002",  finCarga: "2024-07-24 09:35:00", energia: "15.98 kWh", tiempo: "01:05:46" },
        { estacionDeCarga : "Estación Las Condes" , cargador: "Cargador2", conector: "Dos", inicioCarga: "2024-07-23 10:20:00", usuario: "Usuario2", idCargador: "STG-EMU-00003", finCarga: "2024-07-23 11:15:00", energia: "13.47 kWh", tiempo: "00:55:00" },
        { estacionDeCarga : "Estación Chorrillos" , cargador: "Cargador3", conector: "Tres", inicioCarga: "2024-07-22 12:00:00", usuario: "Usuario3",  idCargador: "STG-EMU-00004",  finCarga: "2024-07-22 13:05:00", energia: "18.76 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Viña del Mar" , cargador: "Cargador4", conector: "Cuatro", inicioCarga: "2024-07-21 14:15:00", usuario: "Usuario4",  idCargador: "STG-EMU-00005", finCarga: "2024-07-21 15:20:00", energia: "14.56 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Lima" , cargador: "Cargador5", conector: "Cinco", inicioCarga: "2024-07-20 16:30:00", usuario: "Usuario5",  idCargador: "STG-EMU-00006", finCarga: "2024-07-20 17:45:00", energia: "16.23 kWh", tiempo: "01:15:00" },
        { estacionDeCarga : "Estación Trujillo" , cargador: "Cargador6", conector: "Seis", inicioCarga: "2024-07-19 18:45:00", usuario: "Usuario6",  idCargador: "STG-EMU-00007", finCarga: "2024-07-19 19:50:00", energia: "17.89 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Puente Alto" , cargador: "Cargador7", conector: "Siete", inicioCarga: "2024-07-18 20:00:00", usuario: "Usuario7",  idCargador: "STG-EMU-00008", finCarga: "2024-07-18 21:05:00", energia: "19.45 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Concepción" , cargador: "Cargador8", conector: "Ocho", inicioCarga: "2024-07-17 22:15:00", usuario: "Usuario8",  idCargador: "STG-EMU-00009", finCarga: "2024-07-17 23:20:00", energia: "20.12 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Providencia" , cargador: "Cargador9", conector: "Nueve", inicioCarga: "2024-07-16 23:30:00", usuario: "Usuario9", idCargador: "STG-EMU-00010", finCarga: "2024-07-17 00:35:00", energia: "21.56 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Miami" , cargador: "Cargador10",conector: "Diez", inicioCarga: "2024-07-15 01:00:00", usuario: "Usuario10",  idCargador: "STG-EMU-00011", finCarga: "2024-07-15 02:05:00", energia: "22.34 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Central" , cargador: "Cargador11",conector: "Once", inicioCarga: "2024-07-14 03:15:00", usuario: "Usuario11",  idCargador: "STG-EMU-00012", finCarga: "2024-07-14 04:20:00", energia: "23.78 kWh", tiempo: "01:05:00" },
        { estacionDeCarga : "Estación Miramar" , cargador: "Cargador12",conector: "Doce", inicioCarga: "2024-07-13 05:30:00", usuario: "Usuario12", idCargador: "STG-EMU-00013", finCarga: "2024-07-13 06:35:00", energia: "24.56 kWh", tiempo: "01:05:00" },
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
              data.cargador.toLowerCase().includes(search) ||
              data.conector.toLowerCase().includes(search) ||
              data.inicioCarga.toLowerCase().includes(search) ||
              data.finCarga.toLowerCase().includes(search) ||
              data.usuario.toLowerCase().includes(search) ||
              data.idCargador.toLowerCase().includes(search) ||
              data.energia.toLowerCase().includes(search) ||
              data.tiempo.toLowerCase().includes(search)
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
