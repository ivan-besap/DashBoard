<template>
  <Layout>
    <PageHeader title="Cargadores" pageTitle="Compañía" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="crear-cargador">
              Crear Cargador
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8; margin-right: 6px;" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="mantenimiento-cargador">
              Crear Mantenimiento
            </router-link>
          </BButton>
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="asignar-mantenimiento">
              Asignar Mantenimiento
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px; margin-bottom: 10px">
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('id')">ID</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('name')">Nombre</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('connectorStatus')">Estado</th>
              <th class="sort" data-sort="maintenanceDate" scope="col" @click="onSort('maintenanceDate')">Fecha de Mantenimiento</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.id }}</td>
              <td class="pairs">{{ dat.name }}</td>
              <td>
                <span :class="dat.connectorStatus === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ dat.connectorStatus }}
                </span>
              </td>
              <td>{{ dat.maintenanceDate }}</td>
              <td>
                <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-cargador/`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
                  <i class="mdi mdi-delete"></i>
                </BButton>
              </td>
            </tr>
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
            }" v-for="pageNumber in displayedPages" :key="pageNumber"
                  @click="goToPage(pageNumber)">
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
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      searchQuery: '',
      data: [
        { id: 1, name: 'Cargador 1', connectorStatus: 'CONNECTED', maintenanceDate: '2024-08-01' },
        { id: 2, name: 'Cargador 2', connectorStatus: 'DISCONNECTED', maintenanceDate: '2024-08-08' },
        { id: 3, name: 'Cargador 3', connectorStatus: 'CONNECTED', maintenanceDate: '2024-08-03' },
        { id: 4, name: 'Cargador 4', connectorStatus: 'DISCONNECTED', maintenanceDate: '2024-08-08' },
        { id: 5, name: 'Cargador 5', connectorStatus: 'CONNECTED', maintenanceDate: '2024-08-05' },
        { id: 6, name: 'Cargador 6', connectorStatus: 'DISCONNECTED', maintenanceDate: '2024-08-08' },
        { id: 7, name: 'Cargador 7', connectorStatus: 'CONNECTED', maintenanceDate: '2024-08-07' },
        { id: 8, name: 'Cargador 8', connectorStatus: 'DISCONNECTED', maintenanceDate: '2024-08-08' },
        { id: 9, name: 'Cargador 9', connectorStatus: 'CONNECTED', maintenanceDate: '2024-08-09' },
        { id: 10, name: 'Cargador 10', connectorStatus: 'DISCONNECTED', maintenanceDate: '2024-08-08' }
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
    filteredPlans() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(dat => dat.name.toLowerCase().includes(query));
    },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
              data.name.toLowerCase().includes(search) ||
              data.connectorStatus.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
  },
  watch: {
    posts() {
      this.setPages();
    },
  },
  created() {
    this.setPages();
  },

  methods: {
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
    confirm() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, bórralo",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
              "¡Eliminado!",
              "Tu archivo ha sido eliminado.",
              "success"
          );
        }
      });
    },
  },
};
</script>
