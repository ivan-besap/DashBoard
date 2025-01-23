<template>
    <Layout>
      <PageHeader title="Conectores" pageTitle="Compañía" />
    
      <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="/company/create-empleados-company">Detalle de Terminal</a>
      </BButton>-->

      <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light" v-if="permisos.includes(48)">
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
              placeholder="Buscar por nombre de Cargador..."
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
              <tr v-for="(dat, index) in resultQuery" :key="index">
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
                  <span :class="dat.estadoConector === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'" class="me-2 mt-2 mb-2" style="font-size: 12px">
                    {{ dat.estadoConector === 'CONNECTED' ? 'Conectado' : 'Desconectado' }}
                  </span>
                  <BFormCheckbox  v-if="permisos.includes(64)"
                      v-model="dat.estadoConector"
                      switch
                      :value="'CONNECTED'"
                      :unchecked-value="'DISCONNECTED'"
                      @change="cambiarEstadoConector(dat.id, dat.estadoConector)"
                      class="mt-1 mb-2"
                      style="height: 19px; width: 35px"
                  >
                  </BFormCheckbox>
                </td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(49)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-conector/${dat.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px;  margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)" v-if="permisos.includes(50)">
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
        pages: [],
        permisos:[]
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
      // filteredPlans() {
      //   const query = this.searchQuery.toLowerCase();
      //   return this.data.filter(dat => dat.alias.toLowerCase().includes(query));
      // },
      // displayedPosts() {
      //   return this.paginate(this.data);
      // },
      resultQuery() {
        let filteredData = this.filteredConnector;
        return this.paginate(filteredData);
      },
      filteredConnector() {
        const query = this.searchQuery.toLowerCase();
        return this.data.filter(connector =>
            connector.alias.toLowerCase().includes(query) ||
            connector.tipoConector.nombre.toLowerCase().includes(query) ||
            connector.idCargador.toLowerCase().includes(query) ||
            connector.tarifa.nombreTarifa.toLowerCase().includes(query)
        );
      }
   },
    watch: {
      data() {
        this.setPages();
      },
      searchQuery() {
        this.setPages();
      }
    },
    created() {
      this.setPages();
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
            Swal.fire("Estado del Conector Actualizado!", "", "success");
          }
        } catch (error) {
          console.error("Error actualizando el estado del conector", error);
          Swal.fire("Error al actualizar el estado del conector", "", "error");
        }
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
  