<template>
  <Layout>
    <PageHeader title="Usuarios" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="  background-color: white"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/create-empleados-company">
              Crear Usuario
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
              placeholder="Buscar por Empleado..."
            />
          </div>
        </div>
      </div>
    </BRow>
   

<!--    <div class="table-responsive table-card">-->
<!--      <table class="table table-nowrap table-striped-columns mb-0">-->
<!--        <thead class="table-light">-->
<!--          <tr>-->
<!--            <th scope="col">-->
<!--              <div class="form-check">-->
<!--                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">-->
<!--                <label class="form-check-label" for="cardtableCheck"></label>-->
<!--              </div>-->
<!--            </th>-->
<!--            <th scope="col">Nombre</th>-->
<!--            <th scope="col">Email</th>-->
<!--            <th scope="col">Fecha de Creación</th>-->
<!--            <th scope="col">Empresa</th>-->
<!--            <th scope="col">Activo</th>-->
<!--            <th scope="col">Plan</th>-->
<!--            <th scope="col">Rol</th>-->
<!--            <th scope="col">Acciones</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--          <tr v-for="employee in employees" :key="employee.id">-->
<!--            <td>-->
<!--              <div class="form-check">-->
<!--                <input class="form-check-input" type="checkbox" value="" id="customSwitchsizemd">-->
<!--                <label class="form-check-label" for="cardtableCheck01"></label>-->
<!--              </div>-->
<!--            </td>-->
<!--            <td><a style="color: #292dc1" href="#" class="fw-semibold">{{ employee.firstSurname }}</a></td>-->
<!--            <td>{{ employee.email }}</td>-->
<!--            <td>{{ employee.createdDay }}</td>-->
<!--            <td>{{ employee.company }}</td>-->
<!--            <td>-->
<!--             &lt;!&ndash; Base Switchs &ndash;&gt;-->
<!--<div class="form-check form-switch">-->
<!--<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">-->

<!--</div>-->
<!--            </td>-->
<!--            <td>{{ employee.plan }}</td>-->
<!--            <td>{{ employee.role }}</td>-->
<!--            <td>-->
<!--              <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">-->
<!--                <router-link class="nav-link menu-link" :to="`/company/editar-empleados/`">-->
<!--                  <i class="mdi mdi-pencil"></i>-->
<!--                </router-link>-->
<!--              </BButton>-->
<!--              <BButton style="padding: 5px 10px; background-color: #dfe4ea; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">-->
<!--                <i class="mdi mdi-delete"></i>-->
<!--              </BButton>-->
<!--            </td>-->
<!--          </tr>-->
<!--        </tbody>-->
<!--      </table>-->
<!--    </div>-->
    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table align-middle table-nowrap" id="customerTable">
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
            <tr v-for="dat of filteredPlans" :key="dat.id">
              <td>{{ dat.firstSurname }}</td>
              <td class="pairs">{{ dat.email }}</td>
              <td class="high">{{ dat.createdDay }}</td>
              <td class="low">{{ dat.company }}</td>
              <td class="market_cap">{{ dat.active }}</td>
              <td class="market_cap">{{ dat.plan }}</td>
              <td class="market_cap">{{ dat.role }}</td>
              <td>
                <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-empleados/`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px; background-color: #dfe4ea; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
                  <i class="mdi mdi-delete"></i>
                </BButton>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2">
            <BLink  class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="page--">
              Previous
            </BLink >
            <ul class="pagination listjs-pagination mb-0">
              <li :class="{
                  active: pageNumber == page,
                  disabled: pageNumber == '...',
                }" v-for="(pageNumber, index) in pages.slice(page - 1, page + 5)" :key="index"
                  @click="page = pageNumber">
                <BLink  class="page" href="#">{{ pageNumber }}</BLink >
              </li>
            </ul>
            <BLink  class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="page++">
              Next
            </BLink >
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
      ]
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
    filteredPlans() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(dat => dat.firstSurname.toLowerCase().includes(query));
    },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
              data.id.toLowerCase().includes(search) ||
              data.firstSurname.toLowerCase().includes(search) ||
              data.email.toLowerCase().includes(search) ||
              data.createdDay.toLowerCase().includes(search) ||
              data.company.toLowerCase().includes(search) ||
              data.active.toLowerCase().includes(search) ||
              data.plan.toLowerCase().includes(search) ||
              data.role.toLowerCase().includes(search)
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
