<template>
  <Layout>
    <PageHeader title="Cargadores" pageTitle="Compañía" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(42)">
            <router-link class="nav-link menu-link" target="" to="crear-cargador">
              Crear Cargador
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(72)">
            <router-link class="nav-link menu-link" target="" to="mantenimiento-cargador">
              Crear Mantenimiento
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8;  margin-right: 6px;"  variant="light" class="waves-effect waves-light" v-if="permisos.includes(76)">
            <router-link class="nav-link menu-link" target="" to="asignar-mantenimiento">
              Asignar Mantenimiento
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light"  v-if="permisos.includes(73)">
            <router-link class="nav-link menu-link" target="" to="/company/mantenimientos">
              Mantenimientos
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px; ">
          <div class="d-flex justify-content-sm-end" style="height: 35px; margin-bottom: 10px">
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
              <th class="sort" data-sort="high" scope="col" @click="onSort('chargingStationName')">Estación De Carga</th>
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('ocppId')">ID Cargador</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('alias')">Alias</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('modelName')">Modelo</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('enabled')">Estado</th>
              <th class="sort" data-sort="maintenanceDate" scope="col" @click="onSort('maintenanceDate')">Fecha de Mantenimiento</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.terminalName }}</td>
              <td>{{ dat.ocppid }}</td>
              <td class="pairs">{{ dat.alias }}</td>
              <td class="pairs">{{ dat.modelName }}</td>
              <td class="d-flex align-items-center">
                 <span :class="dat.estadoCargador === 'ACTIVE' ? 'badge bg-success' : 'badge bg-secondary'" class="me-2 mt-2 mb-2" style="font-size: 12px">
                  {{ dat.estadoCargador === 'ACTIVE' ? 'Disponible' : 'No Disponible' }}
                </span>
                <BFormCheckbox  v-if="permisos.includes(63)"
                    v-model="dat.estadoCargador"
                    switch
                    :value="'ACTIVE'"
                    :unchecked-value="'INACTIVE'"
                    @change="cambiarActivoCargador(dat.id, dat.estadoCargador)"
                    class="mt-1 mb-2"
                    style="height: 19px; width: 35px"
                >
                </BFormCheckbox>
              </td>
              <td>
                {{
                  dat.mantenimientos && dat.mantenimientos.length > 0
                      ? `${dat.mantenimientos[0].fechaInicial} / ${dat.mantenimientos[0].fechaFinal}`
                      : 'No hay mantenimiento asignado'
                }}
              </td>
              <td>
                <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(43)">
                  <router-link class="nav-link menu-link" :to="`/company/editar-cargador/${dat.id}`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px;  margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)" v-if="permisos.includes(44)">
                  <i class="mdi mdi-delete"></i>
                </BButton>
                <BButton style="padding: 5px 10px;margin-left: 10px" variant="light" class="waves-effect waves-light"  v-if="permisos.includes(77)" >
                  <router-link class="nav-link menu-link" :to="`/company/carga-inteligente`">
                    <i class="mdi mdi-cog"></i>
                  </router-link>
                </BButton>
<!--                <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="sendHeartbeat(dat.ocppid)">-->
<!--                  <i class="mdi mdi-heart"></i>-->
<!--                </BButton>-->
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
    //   return this.data.filter(dat => dat.name.toLowerCase().includes(query));
    // },
    // displayedPosts() {
    //   return this.paginate(this.data);
    // },
    resultQuery() {
      let filteredData = this.filteredCharger;
      return this.paginate(filteredData);
    },
    filteredCharger() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(charger =>
          charger.terminalName.toLowerCase().includes(query) ||
          charger.ocppid.toLowerCase().includes(query) ||
          charger.alias.toLowerCase().includes(query) ||
          charger.modelName.toLowerCase().includes(query)
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
    this.chargesStation();
    this.loadUserData();
  },

  methods: {
    // async sendHeartbeat(ocppid) {
    //   try {
    //     const response = await axios.post('http://localhost:8088/api/ocpp/enviar-heartbeat', null, {
    //       params: {
    //         ocppid: ocppid,
    //         enableAutomatic: true  // Nuevo parámetro para habilitar el envío automático
    //       }
    //     });
    //     if (response.status === 200) {
    //       Swal.fire("Heartbeat Enviado y Envío Automático Activado!", "", "success");
    //     }
    //   } catch (error) {
    //     console.error("Error enviando el Heartbeat", error);
    //     Swal.fire("Error al enviar el Heartbeat", "", "error");
    //   }
    // },
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async cambiarActivoCargador(id, estadoCargador) {
      try {
        const response = await axios.patch('http://localhost:8088/api/chargerStatus/change-active-status', null, {
          params: {
            id: id,
            activeStatus: estadoCargador
          }
        });
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Cargador Actualizado!", "", "success");
        }
      } catch (error) {
        console.error("Error Actualizando Cargador", error);
        Swal.fire("Error al actualizar el cargador", "", "error");
      }
    },
    async chargesStation() {
      try {
        const response = await axios.get('http://localhost:8088/api/chargers');
        this.data = response.data
      } catch (error) {
        console.error("Error obteniendo las estaciones de carga:", error);
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
    confirm(chargerId) {
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
            // Hacer la solicitud PUT al endpoint para "eliminar" el cargador
            const response = await axios.patch(`http://localhost:8088/api/companies/current/chargers/${chargerId}/delete`);
            if (response.status === 200) {
              Swal.fire(
                  "¡Eliminado!",
                  "Tu cargador ha sido eliminado.",
                  "success"
              ).then(() => {
                this.$router.go(0); // Recargar la página actual
              });
            }
          } catch (error) {
            console.error("Error eliminando el cargador:", error);
            Swal.fire("Error", "No se pudo eliminar el cargador.", "error");
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
