<template>
  <Layout>
    <PageHeader title="Reportes de Ventas Por Estación" pageTitle="Compañía" />

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
                <th class="sort" data-sort="high" scope="col" @click="onSort('fecha')">Fecha</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('estacionDeCarga')">Estación De Carga</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('ventas')">Ventas</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <tr v-for="(dat, index) of resultQuery" :key="index">
                <td>{{ dat.fecha }}</td>
                <td class="high">{{ dat.estacionDeCarga }}</td>
                <td class="high">{{ dat.ventas }}</td>
              </tr>
              <tr>
                <td colspan="2" class="text-right"><strong>Total Ventas:</strong></td>
                <td><strong>{{ totalVentas }}</strong></td>
              </tr>
              <tr>
                <td colspan="2" class="text-right"><strong>Total Ventas de todas las estaciones:</strong></td>
                <td><strong>{{ totalVentasGlobal }}</strong></td>
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
        { fecha: "2024-07-24 08:30:00", estacionDeCarga : "Estación Vitacura" , ventas: "$540.000"},
        { fecha: "2024-07-23 10:20:00", estacionDeCarga : "Estación Las Condes", ventas: "$125.000"  },
        { fecha: "2024-07-22 12:00:00", estacionDeCarga : "Estación Chorrillos", ventas: "$212.000" },
        { fecha: "2024-07-21 14:15:00", estacionDeCarga : "Estación Viña del Mar", ventas: "$43.000" },
        { fecha: "2024-07-20 16:30:00", estacionDeCarga : "Estación Lima", ventas: "$1.210.000"  },
        { fecha: "2024-07-19 18:45:00", estacionDeCarga : "Estación Trujillo", ventas: "$3.534.000" },
        { fecha: "2024-07-18 20:00:00", estacionDeCarga : "Estación Puente Alto", ventas: "$432.000" },
        { fecha: "2024-07-17 22:15:00", estacionDeCarga : "Estación Concepción", ventas: "$231.000"  },
        { fecha: "2024-07-16 23:30:00", estacionDeCarga : "Estación Providencia", ventas: "$167.000" },
        { fecha: "2024-07-15 01:00:00", estacionDeCarga : "Estación Miami", ventas: "$769.000" },
        { fecha: "2024-07-14 03:15:00", estacionDeCarga : "Estación Central", ventas: "$843.000" },
        { fecha: "2024-07-13 05:30:00", estacionDeCarga : "Estación Miramar", ventas: "$443.000" },
      ],
      page: 1,
      perPage: 5,
      pages: [],
    };
  },
  computed: {
    totalVentas() {
      return this.resultQuery.reduce((total, item) => {
        const ventasNumber = parseFloat(item.ventas.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));
        return total + ventasNumber;
      }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    },
    totalVentasGlobal() {
      return this.data.reduce((total, item) => {
        const ventasNumber = parseFloat(item.ventas.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));
        return total + ventasNumber;
      }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    },
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
              data.ventas.toLowerCase().includes(search)
          );
        });
      }

      if (this.dateRange) {
        // Separar las fechas del rango
        const [startDate, endDate] = this.dateRange.split(' to ');

        filteredData = filteredData.filter((data) => {
          return data.fecha >= startDate && data.fecha <= endDate;
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
