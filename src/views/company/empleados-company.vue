<template>
  <Layout>
    <PageHeader title="Usuarios" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/create-empleados-company">
              Crear Usuario
            </router-link>
          </BButton>
          
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px;  width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Usuario ..."
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('firstSurname')">Nombre</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('email')">Email</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('createdDay')">Fecha de Creación</th>
              <th class="sort" data-sort="low" scope="col" @click="onSort('company')">Empresa</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('active')">Activo</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('plan')">Plan</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('role')">Rol</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.firstSurname }}</td>
              <td class="pairs">{{ dat.email }}</td>
              <td class="high">{{ dat.createdDay }}</td>
              <td class="low">{{ dat.company }}</td>
              <td class="market_cap">{{ dat.active }}</td>
              <td class="market_cap">{{ dat.plan }}</td>
              <td class="market_cap">{{ dat.role }}</td>
              <td>
                <BButton style="padding: 5px 10px; " variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-empleados/`">
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
      /*employees: [
        { id: 1, firstSurname: 'Julio Puga', email: 'gonzalez@example.com', createdDay: '2023-01-01', company: 'Empresa A', active: true, plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 2, firstSurname: 'Andres de la Jara', email: 'rodriguez@example.com', createdDay: '2023-02-01', company: 'Empresa B', active: false, plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 3, firstSurname: 'Ivan Castillo', email: 'perez@example.com', createdDay: '2023-03-01', company: 'Empresa C', active: true, plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 4, firstSurname: 'Sánchez', email: 'sanchez@example.com', createdDay: '2023-04-01', company: 'Empresa D', active: false, plan: 'PLAN A BÁSICO', role: 'Usuario' },
        { id: 5, firstSurname: 'López', email: 'lopez@example.com', createdDay: '2023-05-01', company: 'Empresa E', active: true, plan: 'PLAN B INTERMEDIO', role: 'Administrador' },
        { id: 6, firstSurname: 'Martínez', email: 'martinez@example.com', createdDay: '2023-06-01', company: 'Empresa F', active: false, plan: 'PLAN C AVANZADO', role: 'Usuario' },
        { id: 7, firstSurname: 'García', email: 'garcia@example.com', createdDay: '2023-07-01', company: 'Empresa G', active: true, plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 8, firstSurname: 'Hernández', email: 'hernandez@example.com', createdDay: '2023-08-01', company: 'Empresa H', active: false, plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 9, firstSurname: 'Ramírez', email: 'ramirez@example.com', createdDay: '2023-09-01', company: 'Empresa I', active: true, plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 10, firstSurname: 'Fernández', email: 'fernandez@example.com', createdDay: '2023-10-01', company: 'Empresa J', active: false, plan: 'PLAN A BÁSICO', role: 'Usuario' },
      ],*/
      searchQuery: '',
      data: [
        { id: 1, firstSurname: 'Julio Puga', email: 'gonzalez@example.com', createdDay: '2023-01-01', company: 'Empresa A', active: 'Activo', plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 2, firstSurname: 'Andres de la Jara', email: 'rodriguez@example.com', createdDay: '2023-02-01', company: 'Empresa B',  active: 'Activo', plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 3, firstSurname: 'Ivan Castillo', email: 'perez@example.com', createdDay: '2023-03-01', company: 'Empresa C',  active: 'Activo', plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 4, firstSurname: 'Sánchez', email: 'sanchez@example.com', createdDay: '2023-04-01', company: 'Empresa D',  active: 'Activo', plan: 'PLAN A BÁSICO', role: 'Usuario' },
        { id: 5, firstSurname: 'López', email: 'lopez@example.com', createdDay: '2023-05-01', company: 'Empresa E',  active: 'Activo', plan: 'PLAN B INTERMEDIO', role: 'Administrador' },
        { id: 6, firstSurname: 'Martínez', email: 'martinez@example.com', createdDay: '2023-06-01', company: 'Empresa F', active: 'Activo', plan: 'PLAN C AVANZADO', role: 'Usuario' },
        { id: 7, firstSurname: 'García', email: 'garcia@example.com', createdDay: '2023-07-01', company: 'Empresa G',  active: 'Activo', plan: 'PLAN A BÁSICO', role: 'Administrador' },
        { id: 8, firstSurname: 'Hernández', email: 'hernandez@example.com', createdDay: '2023-08-01', company: 'Empresa H',  active: 'Activo', plan: 'PLAN B INTERMEDIO', role: 'Usuario' },
        { id: 9, firstSurname: 'Ramírez', email: 'ramirez@example.com', createdDay: '2023-09-01', company: 'Empresa I',  active: 'Activo', plan: 'PLAN C AVANZADO', role: 'Administrador' },
        { id: 10, firstSurname: 'Fernández', email: 'fernandez@example.com', createdDay: '2023-10-01', company: 'Empresa J',  active: 'Activo', plan: 'PLAN A BÁSICO', role: 'Usuario' },
      ],
      page: 1,
      perPage: 5,
      pages: [],
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
        title: "Estas seguro de eliminar?",
        text: "No podras revertir la accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Empleado Eliminado", "", "success");
        }
      });
    }
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
      return this.data.filter(dat => dat.firstSurname.toLowerCase().includes(query));
    },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      let filteredData = this.data;
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return (
              data.id.toString().toLowerCase().includes(search) ||
              data.firstSurname.toLowerCase().includes(search) ||
              data.email.toLowerCase().includes(search) ||
              data.createdDay.toLowerCase().includes(search) ||
              data.company.toLowerCase().includes(search) ||
              data.active.toLowerCase().includes(search) ||
              data.plan.toLowerCase().includes(search) ||
              data.role.toLowerCase().includes(search)
          );
        });
      }
      return this.paginate(filteredData);
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
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
