<template>
  <Layout>
    <PageHeader title="Modelos" pageTitle="items" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-finac" style="width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 35px; margin-bottom: 10px">
            <BFormInput
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Buscar Modelo ..."
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('name')">Nombre</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.name }}</td>
              <td>
                <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light"  v-if="permisos.includes(69)">
                  <router-link class="nav-link menu-link" :to="`/company/editar-modelo/${dat.id}`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px;  margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)"  v-if="permisos.includes(71)">
                  <i class="mdi mdi-delete"></i>
                </BButton>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between mt-3" v-if="resultQuery.length >= 1">
          <BButton variant="light" @click="$router.push('/company/crear-cargador')">
            Volver
          </BButton>
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
      let filteredData = this.filteredChargingStations;
      return this.paginate(filteredData);
    },
    filteredChargingStations() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(dat =>
          dat.name.toLowerCase().includes(query)
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
    this.manufacturers();
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
    async manufacturers() {
      try {
        const response = await axios.get('https://app.evolgreen.com/api/models');
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
    confirm(modelId) {
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
            // Hacer la solicitud PUT al endpoint para "eliminar" la estación
            const response = await axios.patch(`https://app.evolgreen.com/api/models/${modelId}`);
            if (response.status === 200 || response.status === 201){
              Swal.fire("¡Modelo eliminado!", "", "success").then(() => {
                this.$router.go(0);
              });
            }
          } catch (error) {
            console.error("Error eliminandoel modelo :", error);
            Swal.fire("Error", "No se pudo eliminar el modelo.", "error");
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.flex-shrink-0 {
  display: none;
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
