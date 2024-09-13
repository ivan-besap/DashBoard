<template>
  <Layout>
    <PageHeader title="Errores por conector" pageTitle="Compañía" />

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
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('idCargador')">ID cargador</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('estacionCarga')">Estación De Carga</th>
                <th class="sort pe-4" data-sort="market_cap" scope="col" @click="onSort('conector')">Conector</th>
                <th class="sort pe-4" data-sort="market_cap" scope="col" @click="onSort('aliasCargador')">Alias cargador</th>
                <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('codigo')">Código</th>
                <th class="sort pe-4" data-sort="market_cap" scope="col" @click="onSort('codigoFabricante')">Código Fabricante</th>
                <th class="sort pe-4" data-sort="current_value" scope="col" @click="onSort('idFabricante')">ID Fabricante</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('infoError')">Info Error</th>


              </tr>
              </thead>
              <tbody class="list form-check-all">
              <tr v-for="(dat, index) of resultQuery" :key="index">
                <td>{{ dat.fecha }}</td>
                <td class="high">{{ dat.idCargador }}</td>
                <td class="market_cap">{{ dat.estacionCarga }}</td>
                <td class="market_cap">{{ dat.conector }}</td>
                <td class="market_cap">{{ dat.aliasCargador }}</td>
                <td class="market_cap">{{ dat.codigo }}</td>
                <td class="market_cap">{{ dat.codigoFabricante }}</td>
                <td class="market_cap">{{ dat.idFabricante }}</td>
                <td class="market_cap">{{ dat.infoError }}</td>
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
        { fecha: "2024-07-24 08:30:00", idCargador: "STG-EMU-00001", estacionCarga: "Estación Vitacura", conector: "Tipo 1", aliasCargador: "Vitacura-1", codigo: "COD1234", codigoFabricante: "FAB5678", idFabricante: "FAB001", infoError: "Sin errores" },
        { fecha: "2024-07-23 10:20:00", idCargador: "STG-EMU-00002", estacionCarga: "Estación Las Condes", conector: "Tipo 2", aliasCargador: "LasCond-2", codigo: "COD2345", codigoFabricante: "FAB6789", idFabricante: "FAB002", infoError: "Sin errores" },
        { fecha: "2024-07-22 12:00:00", idCargador: "STG-EMU-00003", estacionCarga: "Estación Chorrillos", conector: "Tipo 3", aliasCargador: "Chorrillos-3", codigo: "COD3456", codigoFabricante: "FAB7890", idFabricante: "FAB003", infoError: "Error de conexión" },
        { fecha: "2024-07-21 14:15:00", idCargador: "STG-EMU-00004", estacionCarga: "Estación Viña del Mar", conector: "Tipo 1", aliasCargador: "Vina-1", codigo: "COD4567", codigoFabricante: "FAB8901", idFabricante: "FAB004", infoError: "Sin errores" },
        { fecha: "2024-07-20 16:30:00", idCargador: "STG-EMU-00005", estacionCarga: "Estación Lima", conector: "Tipo 2", aliasCargador: "Lima-2", codigo: "COD5678", codigoFabricante: "FAB9012", idFabricante: "FAB005", infoError: "Error de voltaje" },
        { fecha: "2024-07-19 18:45:00", idCargador: "STG-EMU-00006", estacionCarga: "Estación Trujillo", conector: "Tipo 3", aliasCargador: "Trujillo-3", codigo: "COD6789", codigoFabricante: "FAB0123", idFabricante: "FAB006", infoError: "Sin errores" },
        { fecha: "2024-07-18 20:00:00", idCargador: "STG-EMU-00007", estacionCarga: "Estación Puente Alto", conector: "Tipo 1", aliasCargador: "PuenteAlto-1", codigo: "COD7890", codigoFabricante: "FAB1234", idFabricante: "FAB007", infoError: "Error de comunicación" },
        { fecha: "2024-07-17 22:15:00", idCargador: "STG-EMU-00008", estacionCarga: "Estación Concepción", conector: "Tipo 2", aliasCargador: "Concepcion-2", codigo: "COD8901", codigoFabricante: "FAB2345", idFabricante: "FAB008", infoError: "Sin errores" },
        { fecha: "2024-07-16 23:30:00", idCargador: "STG-EMU-00009", estacionCarga: "Estación Providencia", conector: "Tipo 3", aliasCargador: "Providencia-3", codigo: "COD9012", codigoFabricante: "FAB3456", idFabricante: "FAB009", infoError: "Error de hardware" },
        { fecha: "2024-07-15 01:00:00", idCargador: "STG-EMU-00010", estacionCarga: "Estación Miami", conector: "Tipo 1", aliasCargador: "Miami-1", codigo: "COD0123", codigoFabricante: "FAB4567", idFabricante: "FAB010", infoError: "Sin errores" },
        { fecha: "2024-07-14 03:15:00", idCargador: "STG-EMU-00011", estacionCarga: "Estación Central", conector: "Tipo 2", aliasCargador: "Central-2", codigo: "COD1234", codigoFabricante: "FAB5678", idFabricante: "FAB011", infoError: "Error de software" },
        { fecha: "2024-07-13 05:30:00", idCargador: "STG-EMU-00012", estacionCarga: "Estación Miramar", conector: "Tipo 3", aliasCargador: "Miramar-3", codigo: "COD2345", codigoFabricante: "FAB6789", idFabricante: "FAB012", infoError: "Sin errores" },
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
              data.fecha.toLowerCase().includes(search) ||
              data.idCargador.toLowerCase().includes(search) ||
              data.estacionCarga.toLowerCase().includes(search) ||
              data.conector.toLowerCase().includes(search) ||
              data.aliasCargador.toLowerCase().includes(search) ||
              data.codigo.toLowerCase().includes(search) ||
              data.codigoFabricante.toLowerCase().includes(search) ||
              data.idFabricante.toLowerCase().includes(search) ||
              data.infoError.toLowerCase().includes(search)
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
