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
                <th class="sort" data-sort="high" scope="col" @click="onSort('cargador')">Cargador</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('conector')">Conector</th>
                <th class="sort" data-sort="low" scope="col" @click="onSort('idCargador')">ID Cargador</th>
                <th class="sort" data-sort="current_value" scope="col" @click="onSort('tipoEvento')">Tipo de evento</th>
                <th class="sort" data-sort="market_cap" scope="col" @click="onSort('resultado')">Resultado</th>
                <th scope="col">Acciones</th>
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
                  <td class="market_cap">{{ dat.tipoEvento }}</td>
                  <td class="market_cap">{{ dat.resultado }}</td>
                  <td>
                    <b-button variant="" @click="showModal(dat.log)"><i class="mdi mdi-magnify"></i>
                      Ver Log</b-button>
                  </td>
                  <td>
                    <BButton variant="" class="btn-sm" @click="toggleCollapse(dat)">
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
                          <th>Data extra</th>
                          <th>Data relevante</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td v-html="dat.dataExtra"></td>
                          <td v-html="dat.dataRelevante"></td>
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
    <b-modal v-model="isModalVisible" hide-footer title="Ver Log" class="v-modal-custom">
      <pre>{{ modalContent }}</pre>
    </b-modal>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
// import flatPickr from "vue-flatpickr-component";

export default {
  components: {
    /*flatPickr,*/
    Layout,
    PageHeader,
  },
  data() {
    return {
      dateRange: null,
      modalContent: '',
      isModalVisible: false,
      searchQuery: null,
      filterDate: null,
      data: [
        {
          fecha: "2024-07-24 08:30:00",
          estacionDeCarga: "Estación Vitacura",
          cargador: "Cargador1",
          conector: "Uno",
          idCargador: "STG-EMU-00002",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00002<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-24 08:30:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00002",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Vitacura"
    }`
        },
        {
          fecha: "2024-07-23 10:20:00",
          estacionDeCarga: "Estación Las Condes",
          cargador: "Cargador2",
          conector: "Dos",
          idCargador: "STG-EMU-00003",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00003<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-23 10:20:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00003",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Las Condes"
    }`
        },
        {
          fecha: "2024-07-22 12:00:00",
          estacionDeCarga: "Estación Chorrillos",
          cargador: "Cargador3",
          conector: "Tres",
          idCargador: "STG-EMU-00004",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00004<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-22 12:00:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00004",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Chorrillos"
    }`
        },
        {
          fecha: "2024-07-21 14:15:00",
          estacionDeCarga: "Estación Viña del Mar",
          cargador: "Cargador4",
          conector: "Cuatro",
          idCargador: "STG-EMU-00005",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00005<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-21 14:15:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00005",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Viña del Mar"
    }`
        },
        {
          fecha: "2024-07-20 16:30:00",
          estacionDeCarga: "Estación Lima",
          cargador: "Cargador5",
          conector: "Cinco",
          idCargador: "STG-EMU-00006",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00006<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-20 16:30:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00006",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Lima"
    }`
        },
        {
          fecha: "2024-07-19 18:45:00",
          estacionDeCarga: "Estación Trujillo",
          cargador: "Cargador6",
          conector: "Seis",
          idCargador: "STG-EMU-00007",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00007<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-19 18:45:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00007",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Trujillo"
    }`
        },
        {
          fecha: "2024-07-18 20:00:00",
          estacionDeCarga: "Estación Puente Alto",
          cargador: "Cargador7",
          conector: "Siete",
          idCargador: "STG-EMU-00008",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00008<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-18 20:00:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00008",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Puente Alto"
    }`
        },
        {
          fecha: "2024-07-17 22:15:00",
          estacionDeCarga: "Estación Concepción",
          cargador: "Cargador8",
          conector: "Ocho",
          idCargador: "STG-EMU-00009",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00009<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-17 22:15:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00009",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Concepción"
    }`
        },
        {
          fecha: "2024-07-16 23:30:00",
          estacionDeCarga: "Estación Providencia",
          cargador: "Cargador9",
          conector: "Nueve",
          idCargador: "STG-EMU-00010",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00010<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-16 23:30:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00010",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Providencia"
    }`
        },
        {
          fecha: "2024-07-15 01:00:00",
          estacionDeCarga: "Estación Miami",
          cargador: "Cargador10",
          conector: "Diez",
          idCargador: "STG-EMU-00011",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00011<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-15 01:00:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00011",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Miami"
    }`
        },
        {
          fecha: "2024-07-14 03:15:00",
          estacionDeCarga: "Estación Central",
          cargador: "Cargador11",
          conector: "Once",
          idCargador: "STG-EMU-00012",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00012<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-14 03:15:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00012",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Central"
    }`
        },
        {
          fecha: "2024-07-13 05:30:00",
          estacionDeCarga: "Estación Miramar",
          cargador: "Cargador12",
          conector: "Doce",
          idCargador: "STG-EMU-00013",
          tipoEvento: "Notificación",
          resultado: "Aceptada",
          expanded: false,
          dataExtra: "Charger Identity Key=STG-EMU-00013<br>Connector Identity Key= 1",
          dataRelevante: "Connector Identity Key=1<br>Status=Preparing Error Code=[NoError]",
          log: `{
      "date": "2024-07-13 05:30:00",
      "event_type": "notification",
      "connector_identity_key": 1,
      "station_identity_key": "STG-EMU-00013",
      "alias": "Demo",
      "station_model": "M3B",
      "station_manufacturer": "WEEYU",
      "error_code": "NoError",
      "vendor_error": "",
      "vendor_id": "",
      "info": "",
      "status": "Preparing",
      "station_address": "Estación Miramar"
    }`
        }
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
              data.idCargador.toLowerCase().includes(search)
          );
        });
      }
      if (this.dateRange) {
        // Convertir la fecha a string en formato YYYY-MM-DD
        const selectedDate = this.dateRange

        filteredData = filteredData.filter((data) => {
          return data.fecha.toLowerCase().includes(selectedDate);
        });
      }

      return this.paginate(filteredData);
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
    showModal(log) {
      this.modalContent = JSON.stringify(JSON.parse(log), null, 2); // Formatear el JSON para una mejor visualización
      this.isModalVisible = true;
    },
    toggleCollapse(dat) {
      dat.expanded = !dat.expanded;
    },
    exportToCSV() {
      const headers = [
        "Fecha","Estación de Carga","Cargador", "Conector", "ID Cargador", "Tipo De Evento", "Resultado"
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
        header: ["fecha","estacion de carga","cargador", "conector","idCargador", "tipo de evento", "resultado"]
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reportes de Carga");
      XLSX.writeFile(wb, "reportes_de_carga.xlsx");
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
pre {
  white-space: pre-wrap; /* Permite que el contenido se ajuste al tamaño del contenedor */
  word-wrap: break-word; /* Permite el corte de palabras largas */
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
