<template>
  <Layout>
    <PageHeader title="Reportes de Carga" pageTitle="Compañía" />

    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="mb-3" style="text-align: right;">
        <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
        <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
      </div>

      <!--      <table class="table table-nowrap table-striped-columns mb-0">-->
      <!--        <thead class="table-light">-->
      <!--          <tr>-->
      <!--            <th scope="col">Inicio de Carga</th>-->
      <!--            <th scope="col">Usuario</th>-->
      <!--            <th scope="col">Cargador</th>-->
      <!--            <th scope="col">ID Cargador</th>-->
      <!--            <th scope="col">Conector</th>-->
      <!--            <th scope="col">Fin Carga</th>-->
      <!--            <th scope="col">Energía</th>-->
      <!--            <th scope="col">Tiempo</th>-->
      <!--          </tr>-->
      <!--        </thead>-->
      <!--        <tbody>-->
      <!--          <tr v-for="(item, index) in filteredData" :key="index">-->
      <!--            <td>{{ item.inicioCarga }}</td>-->
      <!--            <td>{{ item.usuario }}</td>-->
      <!--            <td>{{ item.cargador }}</td>-->
      <!--            <td>{{ item.idCargador }}</td>-->
      <!--            <td>{{ item.conector }}</td>-->
      <!--            <td>{{ item.finCarga }}</td>-->
      <!--            <td>{{ item.energia }}</td>-->
      <!--            <td>{{ item.tiempo }}</td>-->
      <!--          </tr>-->
      <!--        </tbody>-->
      <!--      </table>-->
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
              <BLink class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="previousPage">
                Anterior
              </BLink>
              <ul class="pagination listjs-pagination mb-0">
                <li
                    :class="{
          active: pageNumber === page,
          disabled: pageNumber === '...',
        }"
                    v-for="(pageNumber, index) in displayedPages"
                    :key="index"
                    @click="goToPage(pageNumber)"
                >
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

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
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
      return this.paginate(this.filteredData);
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
              data.tipoEvento.toLowerCase().includes(search) ||
              data.resultado.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
  },
  watch: {
    data() {
      this.setPages();
    },
    page() {
      this.updateRoute();
    }
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
    updateRoute() {
      this.$router.push({ query: { page: this.page } });
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
pre {
  white-space: pre-wrap; /* Permite que el contenido se ajuste al tamaño del contenedor */
  word-wrap: break-word; /* Permite el corte de palabras largas */
}
</style>
