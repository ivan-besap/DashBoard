<template>
  <Layout>
    <PageHeader title="Gestiones Remotas" />
    <BRow>
      <div class="d-flex justify-content-between mb-3">
        <div class="search-container" style="flex: 0 1 250px;">
          <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Estación ..."
          />
        </div>

<!--        <div class="d-flex align-items-center">-->
<!--          <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;-->
<!--          <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>-->
<!--        </div>-->
      </div>
    </BRow>

      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive table-card">
            <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
              <thead class="table-light text-muted">
              <tr>
                <th class="sort" scope="col" @click="onSort('terminalName')">Estación de Carga</th>
                <th class="sort" scope="col" @click="onSort('ocppid')">ID Cargador</th>
                <th class="sort" scope="col" @click="onSort('modelName')">Modelo</th>
                <th class="sort" scope="col" @click="onSort('ubicacionTerminal')">Ubicación</th>
                <th class="sort" scope="col" @click="onSort('estadoCargador')">Estado</th>
                <th class="sort" scope="col">Acciones</th>
                <th class="sort pe-4" scope="col">Status</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <template v-for="(dat, index) of paginatedQuery" :key="index">
                <tr>
                  <td>{{ dat.terminalName }}</td>
                  <td>{{ dat.ocppid }}</td>
                  <td>{{ dat.modelName }}</td>
                  <td>{{ dat.ubicacionTerminal }}</td>
                  <td>
                    <BBadge v-if="dat.estadoCargador === 'ACTIVE'" variant="border border-success" class="border border-success text-success">
                      Conectado
                    </BBadge>
                    <BBadge v-else variant="border border-danger" class="border border-danger text-danger">
                      Sin Conexión
                    </BBadge>
                  </td>
                  <td v-if="permisos.includes(3)">
                    <BButton
                        variant="link"
                        class="btn-sm"
                        @click="confirmReiniciarConector(dat.ocppid)"
                        style="cursor: pointer;"
                    >
                      Reiniciar
                    </BButton>
                    <BButton variant="link" class="btn-sm" @click="toggleCollapse(dat)">
                      <i :class="dat.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                    </BButton>
                  </td>
                  <td class="text-center">
                    <span
                        @click="verificarStatus(dat.ocppid, dat.id)"
                        style="cursor: pointer;"
                        title="Verificar estado"
                    >
                      <i class="mdi mdi-help-circle-outline mdi-24px"></i>
                    </span>
                  </td>
                </tr>
                <tr v-if="dat.expanded">
                  <td colspan="7">
                    <div class="card-body p-0">
                      <table class="table mt-1 mb-0" style="margin-top: -10px">
                        <thead>
                        <tr>
                          <th>Tipo de Conector</th>
                          <th>Alias</th>
<!--                          <th>Potencia</th>-->
<!--                          <th>Potencia en Curso</th>-->
<!--                          <th>Carga en Curso</th>-->
                          <th>Estado de Conector</th>
                          <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(conector, idx) in dat.conectores" :key="idx">
                          <td><img src="@/assets/images/logcarg.svg" width="15px" alt=""> {{ conector.tipoConector.nombre }}</td>
                          <td>{{ conector.alias }}</td>
<!--                          <td>{{ conector.potenciaMaxima }} kW</td>-->
<!--                          <td>{{ conector.potenciaEnCurso }} kW</td> &lt;!&ndash; Potencia en curso &ndash;&gt;-->
<!--                          <td>-->
<!--                            <BProgress striped animated :value="conector.cargaEnCurso" variant="primary"></BProgress>-->
<!--                            {{ conector.cargaEnCurso }}% &lt;!&ndash; Carga en curso &ndash;&gt;-->
<!--                          </td>-->
                          <td>
                            <BBadge
                                v-if="conector.estadoConector === 'CONNECTED'"
                                variant="border border-success"
                                class="border border-success text-success">
                              Activo
                            </BBadge>

                            <BBadge
                                v-else-if="conector.estadoConector === 'OCCUPIED'"
                                variant="border border-primary"
                                class="border border-primary text-primary">
                              Cargando
                            </BBadge>

                            <BBadge
                                v-else-if="conector.estadoConector === 'SUSPENDED'"
                                variant="border border-warning"
                                class="border border-warning text-warning">
                              Suspendido
                            </BBadge>

                            <BBadge
                                v-else-if="conector.estadoConector === 'FINISHING'"
                                variant="border border-info"
                                class="border border-info text-info">
                              Finalizando
                            </BBadge>

                            <BBadge
                                v-else
                                variant="border border-danger"
                                class="border border-danger text-danger">
                              Inactivo
                            </BBadge>
                          </td>
                          <td>
                            <BCol lg="8">
                              <BFormSelect
                                  v-model="conector.selectedAction"
                                  @change="handleActionChange(dat.ocppid, conector)"
                                  class="form-select rounded-pill mb-3"
                              >
                                <BFormSelectOption value="">Seleccione una acción</BFormSelectOption>
                                <BFormSelectOption value="1" v-if="permisos.includes(4)">Iniciar Carga Remota</BFormSelectOption>
                                <BFormSelectOption value="2" v-if="permisos.includes(5)">Detener Carga Remota</BFormSelectOption>
                                <BFormSelectOption value="3" v-if="permisos.includes(6)">Desbloquear Conector</BFormSelectOption>
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
          <div class="d-flex justify-content-end mt-4" v-if="resultQuery.length >= 1">
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
<!--    </div>-->
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      searchQuery: '',
      exManualSelected: null,
      data: [],
      page: 1,
      itemsPerPage: 5,
      sortBy: null,
      sortDesc: false,
      intervalId: null,
      permisos:[]
    };
  },
  computed: {
    resultQuery() {
      let filteredData = [...this.data];

      // Filtrar por el valor ingresado en el campo de búsqueda (searchQuery)
      if (this.searchQuery) {
        const lowerSearchQuery = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter(item =>
            (item.terminalName?.toLowerCase().includes(lowerSearchQuery) || '') ||
            (item.ubicacionTerminal?.toLowerCase().includes(lowerSearchQuery) || '') ||
            (item.ocppid?.toLowerCase().includes(lowerSearchQuery) || '') ||
            (item.modelName?.toLowerCase().includes(lowerSearchQuery) || '')
        );
      }

      if (this.sortBy) {
        filteredData.sort((a, b) => {
          const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
          return this.sortDesc ? -result : result;
        });
      }

      return filteredData;
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
  },
  watch: {
    searchQuery() {
      this.page = 1;
    }
  },
  methods: {

    handleActionChange(ocppid, conector) {
      if (conector.selectedAction === "1") {
        this.iniciarCargaRemota(ocppid, conector);
      } else if (conector.selectedAction === "2") {
        this.detenerCargaRemota(ocppid, conector);
      } else if (conector.selectedAction === "3") {
        this.desbloquearConector(ocppid, conector);
      }
    },
    async iniciarCargaRemota(ocppid, conector) {
      try {
        // Obtener la idTag autorizada
        const idTagResponse = await axios.get('http://localhost:8088/api/obtener-idTag', {
          params: { chargePointId: ocppid }
        });

        const idTag = idTagResponse.data;
        console.log("idTag obtenida:", idTag);

        // Iniciar la carga remota con la idTag obtenida
        const response = await axios.post(
            'http://localhost:8088/api/iniciar-carga-remota',
            {
              connectorId: conector.nconector,
              idTag: idTag
            },
            {
              params: { chargePointId: ocppid }
            }
        );

        if (response.status === 200 || response.status === 201) {
          Swal.fire("Carga remota iniciada exitosamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al iniciar la carga remota:", error);
        Swal.fire("Error al iniciar la carga remota", error.message, "error");
      }
    },

    async detenerCargaRemota(ocppid, conector) {
      try {
        // 1. Llamar al endpoint para obtener el transactionId
        const obtenerTransaccionResponse = await axios.get(
            'http://localhost:8088/api/obtener-transaccion',
            {
              params: {
                ocppId: ocppid,
                numeroConector: conector.nconector
              }
            }
        );

        const transactionId = obtenerTransaccionResponse.data;
        console.log("TransactionId obtenido:", transactionId);

        // 2. Llamar al endpoint para detener la carga remota
        const detenerCargaResponse = await axios.post(
            'http://localhost:8088/api/detener-carga-remota',
            {
              transactionId: transactionId
            },
            {
              params: {
                chargePointId: ocppid
              }
            }
        );

        if (detenerCargaResponse.status === 200 || detenerCargaResponse.status === 201) {
          Swal.fire("Carga remota detenida exitosamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al detener la carga remota:", error);
        Swal.fire("Error al detener la carga remota", error.message, "error");
      }
    },

    async desbloquearConector(ocppid, conector) {
      try {
        const response = await axios.post(
            'http://localhost:8088/api/unlock-connector',
            {
              connectorId: conector.nconector
            },
            {
              params: {
                chargePointId: ocppid
              }
            }
        );
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Conector desbloqueado exitosamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al desbloquear el conector:", error);
        Swal.fire("Error al desbloquear el conector", error.message, "error");
      }
    },

    async confirmReiniciarConector(ocppid) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres reiniciar el cargador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, reiniciar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
    });

      if (result.isConfirmed) {
        // Si el usuario confirma, ejecuta la acción de reinicio
        this.reiniciarConector(ocppid);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si el usuario cancela, muestra un mensaje opcional o simplemente cierra
        Swal.fire("Cancelado", "El reinicio fue cancelado", "info");
      }
    },

    async reiniciarConector(ocppid) {
      try {
        const response = await axios.post(
            'http://localhost:8088/api/reset-cargador',
            {
              type: "Hard"
            },
            {
              params: {
                chargePointId: ocppid
              }
            }
        );
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Reinicio de cargador exitoso!", "", "success");
        }
      } catch (error) {
        console.error("Error al reiniciar el cargador:", error);
        Swal.fire("Error al reiniciar el cargador", error.message, "error");
      }
    },
    async verificarStatus(ocppid, chargerId) {
      try {
        const response = await axios.post(
            'http://localhost:8088/api/trigger-heartbeat',
            { requestedMessage: "Heartbeat" },
            { params: { chargePointId: ocppid } }
        );

        if (response.status === 200 || response.status === 201) {
          Swal.fire("Heartbeat enviado con éxito!", "", "success");

          await axios.patch(
              'http://localhost:8088/api/chargerStatus/change-active-status',
              null,
              {
                params: { id: chargerId, activeStatus: 'ACTIVE' },
              }
          );

          Swal.fire("Estado del cargador actualizado a ACTIVE!", "", "success");
          await this.chargesStation();
        }
      } catch (error) {
        console.error("Error al verificar el estado del cargador:", error);

        await axios.patch(
            'http://localhost:8088/api/chargerStatus/change-active-status',
            null,
            {
              params: { id: chargerId, activeStatus: 'INACTIVE' },
            }
        );

        Swal.fire("Estado del cargador actualizado a INACTIVE!", "", "warning");
        await this.chargesStation();
      }
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
    toggleCollapse(item) {
      item.expanded = !item.expanded;
    },
    exportToCSV() {
      // Lógica para exportar a CSV
    },
    exportToExcel() {
      // Lógica para exportar a Excel
    },
    getRandomNumber(max) {
      return Math.floor(Math.random() * max);
    },
    async chargesStation() {
      try {
        const response = await axios.get('http://localhost:8088/api/chargers');
        this.data = response.data
            .map(charger => {
          charger.conectores = charger.conectores.map(conector => {
              conector.potenciaEnCurso = 0; // kW
              conector.cargaEnCurso = 0; // %
            return conector;
          })
        .sort((a, b) => a.id - b.id);
          return charger;
        });
      } catch (error) {
        console.error("Error obteniendo las estaciones de carga:", error);
      }
    },
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
  },
  mounted() {
    this.chargesStation();
    this.loadUserData();
    // this.intervalId = setInterval(this.fetchMeterValues, 10000);
  },
};
</script>

<style scoped>
.pagination .active .page {
  background-color: #20dcb5;
  border-color: #20dcb5;
  color: white;
}
.pagination .page {
  background-color: #ffffff;
  border-color: #e8e8e8;
  color: #303034;
}

.pagination-next {
  color: #575762;
}

.pagination-prev {
  color: #575762;
}
</style>
