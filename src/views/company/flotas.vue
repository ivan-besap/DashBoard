<template>
  <Layout>
    <PageHeader title="Flotas" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-flota">
              Crear Flotas
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px;  width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 48px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar por Flota..."
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
                <th class="sort" scope="col" @click="onSort('firstSurname')">Nombre</th>
                <th class="sort" scope="col" @click="onSort('model')">Modelo</th>
                <th class="sort" scope="col" @click="onSort('patent')">Patente</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(dat, index) in resultQuery" :key="index">
                <td>{{ dat.firstSurname }}</td>
                <td>{{ dat.model }}</td>
                <td>{{ dat.patent }}</td>
                <td>
                  <BButton style="padding: 5px 10px; " variant="light" class="waves-effect waves-light">
                    <router-link class="nav-link menu-link" :to="`/company/editar-flota/`">
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
        { id: 1, firstSurname: 'Flota 1', model: 'Modelo X', patent: 'AB123CD', createdDay: '2023-01-01', company: 'Empresa A', active: true, plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 2, firstSurname: 'Flota 2', model: 'Modelo Y', patent: 'EF456GH', createdDay: '2023-02-01', company: 'Empresa B', active: false, plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 3, firstSurname: 'Flota 3', model: 'Modelo Z', patent: 'IJ789KL', createdDay: '2023-03-01', company: 'Empresa C', active: true, plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 4, firstSurname: 'Flota 4', model: 'Modelo X', patent: 'MN012OP', createdDay: '2023-04-01', company: 'Empresa D', active: false, plan: 'PLAN A BÁSICO', role: 'Usuario' },
        { id: 5, firstSurname: 'Flota 5', model: 'Modelo Y', patent: 'QR345ST', createdDay: '2023-05-01', company: 'Empresa E', active: true, plan: 'PLAN B INTERMEDIO', role: 'Administrador' },
        { id: 6, firstSurname: 'Flota 6', model: 'Modelo Z', patent: 'UV678WX', createdDay: '2023-06-01', company: 'Empresa F', active: false, plan: 'PLAN C AVANZADO', role: 'Usuario' },
        { id: 7, firstSurname: 'Flota 7', model: 'Modelo X', patent: 'YZ901AB', createdDay: '2023-07-01', company: 'Empresa G', active: true, plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 8, firstSurname: 'Flota 8', model: 'Modelo Y', patent: 'CD234EF', createdDay: '2023-08-01', company: 'Empresa H', active: false, plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 9, firstSurname: 'Flota 9', model: 'Modelo Z', patent: 'GH567IJ', createdDay: '2023-09-01', company: 'Empresa I', active: true, plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 10, firstSurname: 'Flota 10', model: 'Modelo X', patent: 'KL890MN', createdDay: '2023-10-01', company: 'Empresa J', active: false, plan: 'PLAN A BÁSICO', role: 'Usuario' },
      ],
      page: 1,
      perPage: 5,
      pages: [],
      direction: 'asc'
    };
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
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    },
    confirm() {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then((result) => {
        if (result.value) {
          // Aquí va la lógica para eliminar el item
          Swal.fire("¡Eliminado!", "El item ha sido eliminado.", "success");
        }
      });
    },
  },

  computed: {
    resultQuery() {
      let result = this.paginate(this.data);
      if (this.searchQuery) {
        result = result.filter(item => 
          item.firstSurname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.patent.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return result;
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
    this.setPages();
  },
};
</script>

<style scoped>
/* Añade estilos personalizados si es necesario */
</style>
