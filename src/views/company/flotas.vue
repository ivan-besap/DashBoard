<template>
  <Layout>
    <PageHeader title="Flotas" pageTitle="Compañía" />
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
            <template v-for="(flota, index) in resultQuery" :key="index">
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
      pages: [],
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
        const response = await axios.get('https://app.evolgreen.com/api/flotas');
        this.data = response.data.map(flota => ({
          ...flota,
          expanded: false, // Propiedad para controlar el despliegue de autos asignados
        }));
        this.setPages();
      } catch (error) {
        console.error("Error fetching flotas:", error);
      }
    },
    toggleExpand(flota) {
      flota.expanded = !flota.expanded;
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
        const response = await axios.patch(`https://app.evolgreen.com/api/flotas/${flotaId}/delete`);
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
    resultQuery() {
      let filteredData = this.data;

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((flota) => {
          return (
              flota.nombreFlota.toLowerCase().includes(search)
          );
        });
      }

      return this.paginate(filteredData);
    },
    displayedPages() {
      let result = [];
      let page = this.page;
      let numberOfPages = this.pages.length;
      if (numberOfPages <= 5) {
        result = this.pages;
      } else {
        let start = Math.max(1, page - 2);
        let end = Math.min(numberOfPages, page + 2);
        if (start > 1) result.push(1);
        if (start > 2) result.push('...');
        result.push(...this.pages.slice(start - 1, end));
        if (end < numberOfPages) result.push('...');
        if (end < numberOfPages) result.push(numberOfPages);
      }
      return result;
    },
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
