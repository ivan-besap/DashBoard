<template>
  <Layout>
    <PageHeader title="Comandos OCPP" pageTitle="Estaciones de Carga" />

    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="mb-3" style="text-align: right;">
        <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
        <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
      </div>

      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive table-card">
            <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
              <thead class="table-light text-muted">
                <tr>
                  <th class="sort" scope="col" @click="onSort('estacionDeCarga')">Estación de Carga</th>
                  <th class="sort" scope="col" @click="onSort('idCargador')">ID Cargador</th>
                  <th class="sort" scope="col" @click="onSort('modelo')">Modelo</th>
                  <th class="sort" scope="col" @click="onSort('ubicacion')">Ubicación</th>
                  <th class="sort" scope="col" @click="onSort('estado')">Estado</th>
                  <th class="sort" scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody class="list form-check-all">
                <template v-for="(dat, index) in resultQuery" :key="index">
                  <tr>
                    <td>{{ dat.estacionDeCarga }}</td>
                    <td>{{ dat.idCargador }}</td>
                    <td>{{ dat.modelo }}</td>
                    <td>{{ dat.ubicacion }}</td>
                    <td>
                      <BBadge v-if="dat.estado === 'Disponible'" variant="border border-success" class="border border-success text-success">
                        Disponible
                      </BBadge>
                      <BBadge v-else variant="border border-danger" class="border border-danger text-danger">
                        No Disponible
                      </BBadge>
                    </td>
                    <td>
                      <BButton variant="link" class="btn-sm" @click="reiniciarItem(dat)">
                        Reiniciar
                      </BButton>
                      <BButton variant="link" class="btn-sm" @click="toggleCollapse(dat)">
                        <i :class="dat.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                      </BButton>
                    </td>
                  </tr>
                  <tr v-if="dat.expanded">
                    <td colspan="7">
                      <div class="card-body p-0">
                        <!-- Nueva Tabla con Información del Conector -->
                        <table class="table mt-1 mb-0" style="margin-top: -10px">
                          <thead>
                            <tr>
                              <th>Tipo de Conector</th>
                              <th>Alias</th>
                              <th>Potencia</th>
                              <th>Potencia en Curso</th>
                              <th>Carga en Curso</th>
                              <th>Estado de Conector</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(conector, idx) in dat.conectores" :key="idx">
                              <td> <img src="@/assets/images/logcarg.svg" width="15px" alt=""> {{ conector.tipoConector }}</td>
                              <td>{{ conector.alias }}</td>
                              <td>{{ conector.potencia }}</td>
                              <td>{{ conector.potenciaEnCurso }}</td>
                              <td>{{ conector.cargaEnCurso }}</td>
                              <td>{{ conector.estadoConector }}</td>
                              <td>
                                <BCol lg="8">
                                  <BFormSelect v-model="exManualSelected" class="form-select rounded-pill mb-3"
                                    aria-label="Default select example">
                                    <BFormSelectOption :value="null">Seleccione una acción</BFormSelectOption>
                                    <BFormSelectOption value="1">Iniciar Carga</BFormSelectOption>
                                    <BFormSelectOption value="2">Detener Carga</BFormSelectOption>
                                    <BFormSelectOption value="3">Habilitar Carga</BFormSelectOption>
                                    <BFormSelectOption value="4">Deshabilitar Carga</BFormSelectOption>
                                    <BFormSelectOption value="5">Desbloquear</BFormSelectOption>
                                  </BFormSelect>
                                </BCol>
                              </td>
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
                }" v-for="pageNumber in displayedPages" :key="pageNumber" @click="goToPage(pageNumber)">
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

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      exManualSelected: null,
      data: [
        {
          estacionDeCarga: "Estación Vitacura",
          idCargador: "STG-EMU-00002",
          modelo: "ABB_Terra 54_Auto Emu 5",
          ubicacion: "Vitacura",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 1", potencia: "80 kW", potenciaEnCurso: "30 kW", cargaEnCurso: "20 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 1 - J1772", alias: "Alias 2", potencia: "30 kW", potenciaEnCurso: "1.91 kW", cargaEnCurso: "25 kWh", estadoConector: "Inactivo" },
          ]
        },
        {
          estacionDeCarga: "Estación Las Condes",
          idCargador: "STG-EMU-00003",
          modelo: "ABB_Terra 54",
          ubicacion: "Las Condes",
          estado: "No Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 3", potencia: "80 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 4", potencia: "30 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
          ]
        },
        {
          estacionDeCarga: "Estación Providencia",
          idCargador: "STG-EMU-00004",
          modelo: "ABB_Terra 54",
          ubicacion: "Providencia",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 5", potencia: "80 kW", potenciaEnCurso: "60 kW", cargaEnCurso: "50 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 1 - J1772", alias: "Alias 6", potencia: "30 kW", potenciaEnCurso: "10 kW", cargaEnCurso: "15 kWh", estadoConector: "Activo" },
          ]
        },
        {
          estacionDeCarga: "Estación La Reina",
          idCargador: "STG-EMU-00005",
          modelo: "ABB_Terra 54",
          ubicacion: "La Reina",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 7", potencia: "80 kW", potenciaEnCurso: "70 kW", cargaEnCurso: "60 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 8", potencia: "30 kW", potenciaEnCurso: "15 kW", cargaEnCurso: "20 kWh", estadoConector: "Activo" },
          ]
        },
        {
          estacionDeCarga: "Estación Ñuñoa",
          idCargador: "STG-EMU-00006",
          modelo: "ABB_Terra 54",
          ubicacion: "Ñuñoa",
          estado: "No Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 9", potencia: "80 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 10", potencia: "30 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
          ]
        },
        {
          estacionDeCarga: "Estación Peñalolén",
          idCargador: "STG-EMU-00007",
          modelo: "ABB_Terra 54",
          ubicacion: "Peñalolén",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 11", potencia: "80 kW", potenciaEnCurso: "40 kW", cargaEnCurso: "35 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 1 - J1772", alias: "Alias 12", potencia: "30 kW", potenciaEnCurso: "15 kW", cargaEnCurso: "25 kWh", estadoConector: "Activo" },
          ]
        },
        {
          estacionDeCarga: "Estación Santiago Centro",
          idCargador: "STG-EMU-00008",
          modelo: "ABB_Terra 54",
          ubicacion: "Santiago Centro",
          estado: "No Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 13", potencia: "80 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 14", potencia: "30 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
          ]
        },
        {
          estacionDeCarga: "Estación Maipú",
          idCargador: "STG-EMU-00009",
          modelo: "ABB_Terra 54",
          ubicacion: "Maipú",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 15", potencia: "80 kW", potenciaEnCurso: "20 kW", cargaEnCurso: "15 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 1 - J1772", alias: "Alias 16", potencia: "30 kW", potenciaEnCurso: "10 kW", cargaEnCurso: "20 kWh", estadoConector: "Activo" },
          ]
        },
        {
          estacionDeCarga: "Estación Pudahuel",
          idCargador: "STG-EMU-00010",
          modelo: "ABB_Terra 54",
          ubicacion: "Pudahuel",
          estado: "No Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 17", potencia: "80 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 18", potencia: "30 kW", potenciaEnCurso: "0 kW", cargaEnCurso: "0 kWh", estadoConector: "Inactivo" },
          ]
        },
        {
          estacionDeCarga: "Estación La Florida",
          idCargador: "STG-EMU-00011",
          modelo: "ABB_Terra 54",
          ubicacion: "La Florida",
          estado: "Disponible",
          expanded: false,
          conectores: [
            { tipoConector: "CHAdeMO", alias: "Alias 19", potencia: "80 kW", potenciaEnCurso: "50 kW", cargaEnCurso: "40 kWh", estadoConector: "Activo" },
            { tipoConector: "Tipo 2 - Mennekes", alias: "Alias 20", potencia: "30 kW", potenciaEnCurso: "20 kW", cargaEnCurso: "25 kWh", estadoConector: "Activo" },
          ]
        },
        // Agrega más datos aquí si es necesario
      ],
      page: 1,
      itemsPerPage: 5,
      sortBy: null,
      sortDesc: false,
    };
  },
  computed: {
    resultQuery() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      let sortedData = [...this.data];

      if (this.sortBy) {
        sortedData.sort((a, b) => {
          const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
          return this.sortDesc ? -result : result;
        });
      }

      return sortedData.slice(start, end);
    },
    pages() {
      return Math.ceil(this.data.length / this.itemsPerPage);
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
  },
  methods: {
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
    toggleCollapse(item) {
      item.expanded = !item.expanded;
    },
    exportToCSV() {
      // Lógica para exportar a CSV
    },
    exportToExcel() {
      // Lógica para exportar a Excel
    },
  
  },
};
</script>
