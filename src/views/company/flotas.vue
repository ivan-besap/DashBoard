<template>
  <Layout>
    <PageHeader title="Flotas" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8; margin-right: 5px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(79)">
            <router-link class="nav-link menu-link" to="/company/create-flota">
              Crear Flota
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8; margin-right: 5px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(15)">
            <router-link class="nav-link menu-link" to="/company/vehiculos">
              Vehículos
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(82)">
            <router-link class="nav-link menu-link" to="/company/asignar-vehiculos">
              Asignar Vehículos
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px; width: 246px;">
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Buscar Flota ..."
            />
          </div>
        </div>
      </div>
    </BRow>

    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
            <thead class="table-light text-muted">
            <tr>
              <th class="sort" scope="col" @click="onSort('nombreFlota')">Nombre Flota</th>
              <th class="sort" scope="col" @click="onSort('nombreFlota')">Precio Flota</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <template v-for="(flota, index) of paginatedQuery" :key="index">
              <tr>
                <td>{{ flota.nombreFlota }}</td>
                <td>{{ "$" + flota.precioFlota }}</td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(80)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-flota/${flota.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(flota.id)" v-if="permisos.includes(81)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="toggleExpand(flota)">
                    <i :class="flota.expanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
                  </BButton>
                </td>
              </tr>
              <!-- Fila expandida con detalles de los autos asignados a la flota -->
              <tr v-if="flota.expanded">
                <td colspan="2">
                  <div class="card-body p-0">
                    <table class="table table-borderless mt-1 mb-0">
                      <thead>
                      <tr>
                        <th>Patentes de Autos Asignados</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(auto, idx) in flota.autos" :key="idx">
                        <td>{{ auto.patente }}</td>
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
      data: [],
      page: 1,
      perPage: 5,
      itemsPerPage: 5,
      permisos:[],
      direction: 'asc',
    };
  },

  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async fetchFlota() {
      try {
        const response = await axios.get('http://localhost:8088/api/flotas');
        this.data = response.data.map(flota => ({
          ...flota,
          expanded: false, // Propiedad para controlar el despliegue de autos asignados
        }));
      } catch (error) {
        console.error("Error fetching flotas:", error);
      }
    },
    toggleExpand(flota) {
      flota.expanded = !flota.expanded;
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
    confirm(flotaId) {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteFlota(flotaId);
        }
      });
    },

    async deleteFlota(flotaId) {
      try {
        const response = await axios.patch(`http://localhost:8088/api/flotas/${flotaId}/delete`);
        if (response.status === 200) {
          Swal.fire(
              "¡Eliminado!",
              "La flota ha sido eliminada.",
              "success"
          ).then(() => {
            this.$router.go(0); // Recargar la página actual
          });
        }
      } catch (error) {
        console.error("Error al desactivar la flota:", error);
        Swal.fire("Error", "Hubo un problema al desactivar la flota", "error");
      }
    },
  },

  computed: {
    pages() {
      return Math.ceil(this.resultQuery.length / this.itemsPerPage);
    },
    resultQuery() {
      let filteredData = [...this.data];

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((flota) => {
          return (
              flota.nombreFlota.toLowerCase().includes(search) ||
              flota.precioFlota.toString().includes(search)
          );
        });
      }

      if (this.sortBy) {
        filteredData.sort((a, b) => {
          const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
          return this.sortDesc ? -result : result;
        });
      }

      return filteredData;
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

  mounted() {
    this.fetchFlota();
    this.loadUserData();
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
