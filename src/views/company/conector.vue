<template>
    <Layout>
      <PageHeader title="Conectores" />
    
      <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="/company/create-empleados-company">Detalle de Terminal</a>
      </BButton>-->

      <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light" v-if="permisos.includes(58)">
            <router-link class="nav-link menu-link" target="" to="/company/crear-conector">
              Crear Conector
            </router-link>
          </BButton>
<!--          <BButton style="border: 1px solid #d8d8d8; margin-left: 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(62)">-->
<!--            <router-link class="nav-link menu-link" target="" to="/company/crear-tipo-conector">-->
<!--              Crear Tipo de Conector-->
<!--            </router-link>-->
<!--          </BButton>-->
        </div>
        <div class="contenedor-finac" style="width: 246px; margin-bottom: 10px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 48px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Conector ..."
            />
          </div>
        </div>
      </div>
    </BRow>
      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive table-card">
            <table class="table align-middle table-nowrap" id="customerTable">
              <thead class="table-light text-muted">
              <tr>
                <th class="sort" data-sort="current_value" scope="col" @click="onSort('estacion')">Estación De Carga</th>
                <th class="sort" data-sort="current_value" scope="col" @click="onSort('alias')">Alias</th>
                <th class="sort pe-4" data-sort="pairs" scope="col" @click="onSort('tipoConector')">Tipo Conector</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('chargerOcppId')">Cargador</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('chargerOcppId')">Nombre Tarifa</th>
                <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('chargerOcppId')">Costo Tarifa</th>
<!--                <th class="sort pe-4" data-sort="" scope="col" @click="onSort('connectorNumber')">Número Conector</th>-->
<!--                <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('currentMax')">Corriente Máxima</th>-->
<!--                <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('powerMax')">Potencia Máxima</th>-->
<!--                <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('voltageMax')">Voltaje Máximo</th>-->
                <th class="sort " data-sort="high" scope="col" @click="onSort('connectorStatus')">Estado</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <tr v-for="(dat, index) of paginatedQuery" :key="index">
                <td>{{ dat.nombreTerminal }}</td>
                <td>{{ dat.alias }}</td>
<!--                <td class="pairs">{{ dat.connectorType }}</td>-->
                <td>{{ dat.tipoConector.nombre }}</td>
                <td>{{ dat.idCargador }}</td>
                <td>
                  <span v-if="dat.tarifa">{{ dat.tarifa.nombreTarifa }}</span>
                  <span v-else>No tiene tarifa asignada</span>
                </td>
                <td>
                  <span v-if="dat.tarifa">{{ dat.tarifa.precioTarifa }}</span>
                  <span v-else>No tiene tarifa asignada</span>
                </td>
<!--                <td>{{ dat.nconector }}</td>-->
<!--                <td>{{ dat.corrienteMaxima }}</td>-->
<!--                <td>{{ dat.potenciaMaxima }}</td>-->
<!--                <td>{{ dat.voltajeMaximo }}</td>-->
                <td class="d-flex align-items-center">
                  <span
                      :class="{
                                'badge bg-success': dat.estadoConector === 'CONNECTED',
                                'badge bg-danger': dat.estadoConector === 'DISCONNECTED',
                                'badge bg-primary text-white': dat.estadoConector === 'OCCUPIED',
                                'badge bg-secondary text-white': dat.estadoConector === 'SUSPENDED',
                                'badge bg-info': dat.estadoConector === 'FINISHING'
                              }"
                      class="me-2 mt-2 mb-2"
                      style="font-size: 12px"
                  >
                    {{
                      dat.estadoConector === 'CONNECTED' ? 'Conectado' :
                      dat.estadoConector === 'OCCUPIED' ? 'Cargando' :
                      dat.estadoConector === 'DISCONNECTED' ? 'Desconectado' :
                      dat.estadoConector === 'SUSPENDED' ? 'Suspendido' :
                      dat.estadoConector === 'FINISHING' ? 'Finalizando' :
                      'Estado desconocido'
                    }}
                  </span>
<!--                  <BFormCheckbox-->
<!--                      v-if="permisos.includes(64)"-->
<!--                      switch-->
<!--                      :checked="dat.estadoConector !== 'DISCONNECTED'"-->
<!--                      @change="cambiarEstadoConector(dat.id, $event ? 'CONNECTED' : 'DISCONNECTED')"-->
<!--                      class="mt-1 mb-2"-->
<!--                      style="height: 19px; width: 35px"-->
<!--                  >-->
<!--                  </BFormCheckbox>-->
                </td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(59)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-conector/${dat.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px;  margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)" v-if="permisos.includes(60)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                </td>
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
    </Layout>
  </template>
    
  <script>
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import Swal from "sweetalert2";
  import axios from "axios";
  export default {
    components: {
      Layout,
      PageHeader,
    },
    data() {
      return {
        searchQuery: '',
        data: [],
        page: 1,
        perPage: 5,
        itemsPerPage: 5,
        permisos:[]
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
      resultQuery() {
        let filteredData = this.filteredConnector;
        return filteredData;
      },
      filteredConnector() {
        const query = this.searchQuery.toLowerCase();

        // Mapa de traducciones para el estado del conector
        const estadoConectorMap = {
          'CONNECTED': 'conectado',
          'OCCUPIED': 'cargando',
          'DISCONNECTED': 'desconectado',
          'SUSPENDED': 'suspendido',
          'FINISHING': 'finalizando'
        };

        return this.data.filter(connector => {
          // Obtener el estado traducido o el original en minúscula
          const estadoEnEspanol = estadoConectorMap[connector.estadoConector] || connector.estadoConector.toLowerCase();

          // Realizar la búsqueda considerando el estado traducido
          return (
              connector.alias.toLowerCase().includes(query) ||
              connector.nombreTerminal.toLowerCase().includes(query) ||
              connector.tipoConector.nombre.toLowerCase().includes(query) ||
              connector.idCargador.toLowerCase().includes(query) ||
              connector.tarifa.nombreTarifa.toLowerCase().includes(query) ||
              connector.tarifa.precioTarifa.toString().toLowerCase().includes(query) ||
              estadoEnEspanol.includes(query)  // Búsqueda en el estado traducido
          );
        });
      }

    },
    watch: {
      searchQuery() {
        this.page = 1;
      }
    },
    created() {
      this.connectors();
      this.loadUserData();
    },
    filters: {
      trimWords(value) {
        return value.split(" ").splice(0, 20).join(" ") + "...";
      },
    },

    methods: {
      loadUserData() {
        const userDataString = localStorage.getItem('userData');
        this.userData = JSON.parse(userDataString);
        this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
      },
      async connectors() {
        try {
          const response = await axios.get('http://localhost:8088/api/connectors');
          this.data = response.data
        } catch (error) {
          console.error("Error obteniendo las estaciones de carga:", error);
        }
      },
      async cambiarEstadoConector(id, estadoConector) {
        try {
          const response = await axios.patch('http://localhost:8088/api/connectorStatus/change-active-status', null, {
            params: {
              id: id,
              activeStatus: estadoConector
            }
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire({
              title: "Estado del Conector Actualizado!",
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => {
              location.reload();
            });
          }
        } catch (error) {
          console.error("Error actualizando el estado del conector", error);
          Swal.fire("Error al actualizar el estado del conector", "", "error");
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
      confirm(connectorId) {
        Swal.fire({
          title: "¿Estás seguro de eliminar?",
          text: "¡No podrás revertir la acción!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Sí, eliminar!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Hacer la solicitud PUT al endpoint para "eliminar" el conector
              const response = await axios.patch(`http://localhost:8088/api/companies/current/connectors/${connectorId}/delete`);
              if (response.status === 200 || response.status === 201) {
                Swal.fire(
                    "¡Eliminado!",
                    "Tu conector ha sido eliminado.",
                    "success"
                ).then(() => {
                  this.$router.go(0); // Recargar la página actual
                });
              }
            } catch (error) {
              console.error("Error eliminando el conector:", error);
              Swal.fire("Error", "No se pudo eliminar el conector.", "error");
            }
          }
        });
      }
    },
  };
  </script>
  
<style scoped>
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
  