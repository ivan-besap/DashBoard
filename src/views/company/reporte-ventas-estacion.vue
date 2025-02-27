<template>
  <Layout>
    <PageHeader title="Reportes de Ventas Por Estación" />

    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="d-flex justify-content-between mb-3 align-items-center">
        <div class="d-flex align-items-center">
          <!-- Input de búsqueda -->
          <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar ventas ..."
              style="margin-right: 15px;"
          />
        </div>
        <div class="d-flex align-items-center" style="gap: 15px;">
          <!-- Año -->
          <div class="d-flex align-items-center" style="gap: 5px;">
            <label for="selectedAno" class="form-label" style="margin-bottom: 0; font-weight: bold;">Año:</label>
            <Multiselect
                v-model="selectedAno"
                :options="anosDisponibles"
                label="label"
                track-by="value"
                placeholder="Selecciona un año"
                :close-on-select="true"
                :searchable="true"
                style="min-width: 130px; max-width: 200px; min-height: 45px; font-size: 16px;"
            />
          </div>

          <!-- Mes -->
          <div class="d-flex align-items-center" style="gap: 5px;">
            <label for="selectedMes" class="form-label" style="margin-bottom: 0; font-weight: bold;">Mes:</label>
            <Multiselect
                v-model="selectedMes"
                :options="mesesDisponibles"
                label="label"
                track-by="value"
                placeholder="Selecciona un mes"
                :close-on-select="true"
                :searchable="true"
                style="min-width: 170px; max-width: 200px; min-height: 45px; font-size: 16px;"
            />
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
                <th scope="col">Estación De Carga</th>
                <th scope="col">Año</th>
                <th scope="col">Mes</th>
                <th scope="col">Ingreso</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <tr v-for="(dat, index) of paginatedQuery" :key="index">
                <td class="high">{{ dat.estacion }}</td>
                <td>{{ dat.ano }}</td>
                <td>{{ mapMesATexto(dat.mes) }}</td>
                <td class="high">{{ dat.ingreso.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right"><strong>Total Ingresos:</strong></td>
                <td><strong>{{ totalIngresos }}</strong></td>
              </tr>
              <tr>
                <td colspan="3" class="text-right"><strong>Total Ingresos de todas las estaciones:</strong></td>
                <td><strong>{{ totalIngresosGlobal }}</strong></td>
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
import axios from 'axios';
import Multiselect from "@vueform/multiselect";


export default {
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  data() {
    const fechaActual = new Date();
    return {
      selectedAno: fechaActual.getFullYear(), // Año actual por defecto
      selectedMes: fechaActual.getMonth() + 1, // Mes actual por defecto
      anosDisponibles: [], // Se llenará dinámicamente
      mesesDisponibles: [
        { value: 1, label: "Enero" },
        { value: 2, label: "Febrero" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Abril" },
        { value: 5, label: "Mayo" },
        { value: 6, label: "Junio" },
        { value: 7, label: "Julio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Septiembre" },
        { value: 10, label: "Octubre" },
        { value: 11, label: "Noviembre" },
        { value: 12, label: "Diciembre" }
      ],
      dateRange:null,
      searchQuery: '',
      filterDate: null,
      reportes:[],
      page: 1,
      perPage: 5,
      itemsPerPage: 5,
    };
  },
  computed: {
    // totalVentas() {
    //   return this.resultQuery.reduce((total, item) => {
    //     const ventasNumber = parseFloat(item.ventas.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));
    //     return total + ventasNumber;
    //   }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // },
    // totalVentasGlobal() {
    //   return this.data.reduce((total, item) => {
    //     const ventasNumber = parseFloat(item.ventas.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));
    //     return total + ventasNumber;
    //   }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // },
    totalIngresos() {
      return this.resultQuery.reduce((total, item) => {
        return total + item.ingreso;
      }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    },
    totalIngresosGlobal() {
      return this.reportes.reduce((total, item) => {
        return total + item.ingreso;
      }, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    },
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
      if (!this.filterDate) return this.reportes;
      return this.reportes.filter(item => {
        const date = new Date(item.estacion);
        return date.toISOString().startsWith(this.filterDate.toISOString().split('T')[0]);
      });
    },
    displayedPosts() {
      return this.paginate(this.reportes);
    },
    resultQuery() {
      let filteredData = [...this.reportes];

      // Filtro de búsqueda
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return data.estacion.toLowerCase().includes(search);
        });
      }

      // Filtro por año y mes
      filteredData = filteredData.filter((data) => {
        return (
            data.ano === this.selectedAno &&
            data.mes === this.selectedMes
        );
      });

      return filteredData;
    }
  },
  watch: {
    selectedAno() {
      this.page = 1; // Reinicia la paginación al cambiar el filtro
    },
    selectedMes() {
      this.page = 1; // Reinicia la paginación al cambiar el filtro
    },
    searchQuery() {
      this.page = 1;
    }
  },
  created() {
    this.obtenerDatosReportes()
    this.obtenerDatosReportes();
    this.llenarAnosDisponibles();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  methods: {
    filtrarPorAnoMes() {
      // Filtrar los reportes por año y mes seleccionados
      this.resultQuery = this.reportes.filter((reporte) => {
        return (
            reporte.ano === this.selectedAno &&
            reporte.mes === this.selectedMes
        );
      });
    },
    llenarAnosDisponibles() {
      const anoActual = new Date().getFullYear();
      for (let i = anoActual; i >= 2020; i--) {
        this.anosDisponibles.push(i);
      }
    },
    mapMesATexto(mes) {
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      return meses[mes - 1] || "Mes desconocido";
    },
    async obtenerDatosReportes() {
      try {
        const response = await axios.get('http://localhost:8088/api/datos-reportes');
        this.reportes = response.data;
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    },
    updateSearchQuery() {
    },
    clearDateRange() {
      this.dateRange = null;
    },
    // exportToCSV() {
    //   const headers = [
    //     "Estación de Carga","Cargador", "Conector", "Inicio de Carga","Fin Carga", "Usuario",  "ID Cargador",   "Energía", "Tiempo"
    //   ];
    //   const rows = this.filteredData.map(item => [
    //     item.estacionDeCarga, item.cargador, item.conector, item.inicioCarga, item.finCarga, item.usuario,  item.idCargador,  item.energia, item.tiempo
    //   ]);
    //   const csvContent = "data:text/csv;charset=utf-8," +
    //       headers.join(",") + "\n" +
    //       rows.map(e => e.join(",")).join("\n");
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
        "Estación De Carga",
        "Año",
        "Mes",
        "Ingreso"
      ];

      // Ordenamos los datos en el mismo orden de las columnas de la tabla
      const rows = this.resultQuery.map(item => {
        return {
          "Estación De Carga": item.estacion,
          "Año": item.ano,
          "Mes": this.mapMesATexto(item.mes),  // Convertimos el mes a texto
          "Ingreso": item.ingreso.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        };
      });

      // Calculamos el total de ingresos
      const totalIngresos = this.resultQuery.reduce((total, item) => total + item.ingreso, 0);

      // Agregamos la fila de total al final de la tabla
      rows.push({
        "Estación De Carga": "Total Ingresos:",
        "Año": "",
        "Mes": "",
        "Ingreso": totalIngresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
      });

      // Creamos la hoja de Excel y agregamos los encabezados y datos
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });

      // Ajustamos el ancho de las columnas para una mejor visualización
      const columnWidths = [
        { wch: 25 },  // Estación De Carga
        { wch: 10 },  // Año
        { wch: 15 },  // Mes
        { wch: 20 }   // Ingreso
      ];
      worksheet["!cols"] = columnWidths;

      // Aplicamos estilos para alinear el total a la derecha en la columna de Ingreso
      const lastRow = rows.length + 1; // La última fila (total)
      const totalCell = `D${lastRow}`; // Celda donde está el total de ingresos
      worksheet[totalCell].s = {
        font: { bold: true },      // Negrita
        alignment: { horizontal: "right" }  // Alineado a la derecha
      };

      // Creamos el libro de Excel
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes de Ventas");

      // Exportamos el archivo
      XLSX.writeFile(workbook, "reportes_de_ventas.xlsx");
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
