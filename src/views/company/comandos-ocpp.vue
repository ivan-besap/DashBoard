<template>
  <Layout>
    <PageHeader title="Comandos OCPP" pageTitle="Estaciones de Carga" />
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

        <div class="d-flex align-items-center">
          <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
          <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
        </div>
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
                <th class="sort pe-4" scope="col">HeartBeat</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <template v-for="(dat, index) in resultQuery" :key="index">
                <tr>
                  <td>{{ dat.terminalName }}</td>
                  <td>{{ dat.ocppid }}</td>
                  <td>{{ dat.modelName }}</td>
                  <td>{{ dat.ubicacionTerminal }}</td>
                  <td>
                    <BBadge v-if="dat.estadoCargador === 'ACTIVE'" variant="border border-success" class="border border-success text-success">
                      Disponible
                    </BBadge>
                    <BBadge v-else variant="border border-danger" class="border border-danger text-danger">
                      No Disponible
                    </BBadge>
                  </td>
                  <td>
                    <BButton variant="link" class="btn-sm" @click="reiniciarConector(dat.ocppid)" style="cursor: pointer;">Reiniciar</BButton>
                    <BButton variant="link" class="btn-sm" @click="toggleCollapse(dat)">
                      <i :class="dat.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                    </BButton>
                  </td>
                  <td>
                    <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="sendHeartbeat(dat)">
                      <i class="mdi mdi-heart"></i>
                    </BButton>
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
                          <th>Potencia</th>
                          <th>Potencia en Curso</th>
                          <th>Carga en Curso</th>
                          <th>Estado de Conector</th>
                          <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(conector, idx) in dat.conectores" :key="idx">
                          <td><img src="@/assets/images/logcarg.svg" width="15px" alt=""> {{ conector.tipoConector.nombre }}</td>
                          <td>{{ conector.alias }}</td>
                          <td>{{ conector.potenciaMaxima }} kW</td>
                          <td>{{ conector.potenciaEnCurso }} kW</td> <!-- Potencia en curso -->
                          <td>
                            <BProgress striped animated :value="conector.cargaEnCurso" variant="primary"></BProgress>
                            {{ conector.cargaEnCurso }}% <!-- Carga en curso -->
                          </td>
                          <td>
                            <BBadge v-if="conector.estadoConector === 'CONNECTED'" variant="border border-success" class="border border-success text-success">
                              Activo
                            </BBadge>
                            <BBadge v-else variant="border border-danger" class="border border-danger text-danger">
                              Inactivo
                            </BBadge>
                          </td>
                          <td>
                            <BCol lg="8">
                              <BFormSelect v-model="conector.selectedAction" @change="handleActionChange(conector)" class="form-select rounded-pill mb-3">
                                <BFormSelectOption value="">Seleccione una acción</BFormSelectOption>
                                <BFormSelectOption value="1">Iniciar Carga</BFormSelectOption>
                                <BFormSelectOption value="2">Detener Carga</BFormSelectOption>
                                <BFormSelectOption value="3">Iniciar Carga Remota</BFormSelectOption>
                                <BFormSelectOption value="4">Detener Carga Remota</BFormSelectOption>
                                <BFormSelectOption value="5">Desbloquear Conector</BFormSelectOption>
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
    };
  },
  computed: {
    resultQuery() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      let sortedData = [...this.data];

      // Filtrar por el valor ingresado en el campo de búsqueda (searchQuery)
      if (this.searchQuery) {
        const lowerSearchQuery = this.searchQuery.toLowerCase();
        sortedData = sortedData.filter(item =>
            item.terminalName.toLowerCase().includes(lowerSearchQuery) ||
            item.ubicacionTerminal.toLowerCase().includes(lowerSearchQuery) ||
            item.ocppid.toLowerCase().includes(lowerSearchQuery) ||
            item.modelName.toLowerCase().includes(lowerSearchQuery)
        );
      }

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
    async sendHeartbeat(charger) {
      try {
        const response = await axios.post('https://app.evolgreen.com/api/ocpp/enviar-heartbeat', null, {
          params: {
            ocppid: charger.ocppid,
            enableAutomatic: true,
            vendorId: charger.manufacturerName
          }
        });
        if (response.status === 200) {
          // Establecer la conexión WebSocket después del Heartbeat exitoso
          this.iniciarConexionWebSocket(charger.ocppid);
          Swal.fire("Heartbeat Enviado y Conexión WebSocket Establecida!", "", "success");
        }
      } catch (error) {
        console.error("Error enviando el Heartbeat", error);
        Swal.fire("Error al enviar el Heartbeat", "", "error");
      }
    },


    iniciarConexionWebSocket(ocppid) {
      const wsUrl = `ws://localhost:8088/ocpp/${ocppid}`;
      const protocols = ["ocpp1.6"];

      this.webSocket = new WebSocket(wsUrl, protocols);

      this.webSocket.onopen = () => {
        console.log("WebSocket connection established for frontend with ocppid:", ocppid);
      };

      this.webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.webSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },

    async iniciarCargaRemota(conector) {
      try {
        const chargingProfile = {
          chargingProfileId: 123,
          stackLevel: 0,
          chargingProfilePurpose: "ChargePointMaxProfile",
          chargingProfileKind: "Absolute",
          chargingSchedule: {
            chargingRateUnit: "A",
            chargingSchedulePeriod: [
              { startPeriod: 0, limit: 32.0, numberPhases: 3 },
              { startPeriod: 1800, limit: 16.0, numberPhases: 3 }
            ]
          }
        };

        const response = await axios.post('https://app.evolgreen.com/api/ocpp/iniciar-carga-remota', {
          connectorId: conector.id,
          idTag: "ABC123",
          chargingProfile: chargingProfile
        });

        if (response.status === 200) {
          conector.intervalId = setInterval(() => {
            this.fetchMeterValues(conector.id);
          }, 10000);
          Swal.fire("Carga remota iniciada correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error iniciando la carga remota", error);
        Swal.fire("Error al iniciar la carga remota", "", "error");
      }
    },

    async detenerCargaRemota(conector) {
      try {
        const transactionId = 2; // Puedes actualizar esto según el transactionId específico que quieras detener

        const response = await axios.post('https://app.evolgreen.com/api/ocpp/detener-carga-remota', { transactionId });
        if (response.status === 200) {
          if (conector.intervalId) {
            clearInterval(conector.intervalId);
            conector.intervalId = null;
          }
          conector.potenciaEnCurso = 0;
          conector.cargaEnCurso = 0;
          Swal.fire("Carga remota detenida correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al detener la carga remota", error);
        Swal.fire("Error al detener la carga remota", "", "error");
      }
    },

    async iniciarCarga(conector) {
      try {
        // Detener cualquier intervalo en otros conectores antes de iniciar uno nuevo
        this.data.forEach(charger => {
          charger.conectores.forEach(c => {
            if (c.id !== conector.id && c.intervalId) {
              clearInterval(c.intervalId);
              c.intervalId = null; // Limpiar el ID del intervalo
              // c.cargaEnCurso = 0; // Reiniciar la barra de progreso del conector detenido
            }
          });
        });

        // Iniciar el intervalo para el conector seleccionado
        const response = await axios.post('https://app.evolgreen.com/api/ocpp/iniciar-carga', null, {
          params: {
            connectorId: conector.id // ID del conector real
          }
        });
        if (response.status === 200) {
          // Establecer el intervalo de actualización para este conector específico
          conector.intervalId = setInterval(() => {
            this.fetchMeterValues(conector.id);
          }, 10000); // Llama a `fetchMeterValues` cada 10 segundos para este conector

          Swal.fire("Carga iniciada correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error iniciando la carga", error);
        Swal.fire("Error al iniciar la carga", "", "error");
      }
    },
    async fetchMeterValues(connectorId) {
      const maxValue = 20000; // Valor máximo que representa el 100% de carga

      try {
        // Hacer la petición para obtener los valores del conector específico
        const response = await axios.get('https://app.evolgreen.com/api/ocpp/obtener-ultimo-meter-value-json', {
          params: { connectorId }
        });
        const meterValues = response.data;

        // Verifica que el JSON recibido tenga los datos esperados y actualiza la barra de carga
        if (meterValues && meterValues.meterValue && meterValues.meterValue.length > 0) {
          const receivedConnectorId = meterValues.connectorId; // Obtener el conectorId desde el JSON

          // Solo proceder si el conectorId recibido coincide con el que estamos monitoreando
          if (receivedConnectorId === connectorId) {
            console.log("Conector activado, iniciando carga")
            const sampledValue = meterValues.meterValue[0].sampledValue.find(value => value.measurand === 'Energy.Active.Import.Register');

            if (sampledValue) {
              const currentValue = parseInt(sampledValue.value, 10); // Suponiendo que 'value' es un número entero.

              // Calcula el porcentaje de carga en función del valor máximo definido
              const cargaEnCurso = Math.min(Math.floor((currentValue / maxValue) * 100), 100); // Limita el porcentaje a un máximo de 100

              // Actualiza la carga en curso solo para el conector correspondiente
              this.data.forEach(charger => {
                charger.conectores.forEach(conector => {
                  if (conector.id === connectorId) {
                    conector.cargaEnCurso = cargaEnCurso; // Asigna el porcentaje calculado solo a este conector
                    console.log(`Conector ${connectorId}: Carga en curso: ${cargaEnCurso}%`);
                  }
                });
              });
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener los meter values:", error);
      }
    },
    // iniciarCarga(conector) {
    //   // Si ya hay un intervalo corriendo para este conector, no hagas nada
    //   if (conector.intervalId) return;
    //
    //   // Potencia en curso comienza a 60 kW
    //   conector.potenciaEnCurso = conector.potenciaMaxima - 10;
    //
    //   // Carga en curso comienza en 0 y aumentará hasta el 100%
    //   conector.cargaEnCurso = 0;
    //
    //   // Barra de progreso que incrementa cada 2 segundos
    //   conector.intervalId = setInterval(() => {
    //     if (conector.cargaEnCurso < 100) {
    //       conector.cargaEnCurso += 1;
    //     } else {
    //       clearInterval(conector.intervalId); // Detener cuando llega al 100%
    //       conector.intervalId = null; // Limpiar el ID del intervalo
    //     }
    //   }, 2000); // Incrementa 1% cada 2 segundos
    // },
    async detenerCarga(conector) {
      try {
        // Hacer la solicitud al endpoint del backend para detener la carga
        const response = await axios.post('https://app.evolgreen.com/api/ocpp/detener-carga');
        if (response.status === 200) {
          // Si la solicitud fue exitosa, detener el intervalo y resetear los valores a 0
          if (conector.intervalId) {
            clearInterval(conector.intervalId);
            conector.intervalId = null; // Limpiar el ID del intervalo
          }
          conector.potenciaEnCurso = 0;
          conector.cargaEnCurso = 0;
          Swal.fire("Carga detenida correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al detener la carga", error);
        Swal.fire("Error al detener la carga", "", "error");
      }
    },
    async reiniciarConector(ocppid) {
      const tipoReset = "Hard"
      try {
        // Hacer la solicitud al endpoint del backend para detener la carga
        const response = await axios.post('https://app.evolgreen.com/api/ocpp/reset-cargador', null, {
          params: {
            resetType: tipoReset,
            ocppid: ocppid
          }
        });
        if (response.status === 200) {
          // Si la solicitud fue exitosa, detener el intervalo y resetear los valores a 0
          Swal.fire("Cargador Reiniciado Correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al reiniciar el cargador", error);
        Swal.fire("Error al reiniciar el cargador", "", "error");
      }
    },
    async desbloquearConector(conector) {
      try {
        // Hacer la solicitud al endpoint del backend para detener la carga
        const response = await axios.post('https://app.evolgreen.com/api/ocpp/desbloquear-conector', null, {
          params: {
            connectorId: conector.id // ID del conector real
          }
        });
        if (response.status === 200) {
          Swal.fire("Conector Desbloqueado correctamente!", "", "success");
        }
      } catch (error) {
        console.error("Error al desbloquear el conector", error);
        Swal.fire("Error al desbloquear el conector", "", "error");
      }
    },
    handleActionChange(conector) {
      if (conector.selectedAction === "1") { // Iniciar Carga
        this.iniciarCarga(conector);
      } else if (conector.selectedAction === "2") { // Detener Carga
        this.detenerCarga(conector);
      } else if (conector.selectedAction === "3") { // Iniciar Carga Remota
        this.iniciarCargaRemota(conector);
      } else if (conector.selectedAction === "4") { // Detener Carga Remota
        this.detenerCargaRemota(conector);
      } else if (conector.selectedAction === "5"){
        this.desbloquearConector(conector);
      }
    },
    // handleActionChange(conector) {
    //   if (conector.selectedAction === "1") { // Iniciar Carga
    //     this.iniciarCarga(conector);
    //   } else if (conector.selectedAction === "2") { // Detener Carga
    //     this.detenerCarga(conector);
    //   }
    // },
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
        const response = await axios.get('https://app.evolgreen.com/api/chargers');
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
  },
  mounted() {
    this.chargesStation();
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
