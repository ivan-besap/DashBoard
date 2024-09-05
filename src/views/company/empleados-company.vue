<template>
  <Layout>
    <PageHeader title="Usuarios" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light" v-if="permisos.includes(27)">
            <router-link class="nav-link menu-link" target="" to="/company/create-empleados-company">
              Crear Usuario
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px; width: 246px;">
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
                <th class="sort" data-sort="nombre" scope="col" @click="onSort('nombre')">Nombre</th>
                <th class="sort" data-sort="apellidoPaterno" scope="col" @click="onSort('apellidoPaterno')">Apellido Paterno</th>
                <th class="sort" data-sort="apellidoMaterno" scope="col" @click="onSort('apellidoMaterno')">Apellido Materno</th>
                <th class="sort" data-sort="email" scope="col" @click="onSort('email')">Email</th>
                <th class="sort" data-sort="createdDay" scope="col" @click="onSort('fechaDeCreacion')">Fecha de Creación</th>
                <th class="sort" data-sort="role" scope="col" @click="onSort('role.nombre')">Rol</th>
<!--                <th class="sort" data-sort="role" scope="col" @click="onSort('activo')">Estado Cuenta</th>-->
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(employee, index) in resultQuery" :key="index">
                <td>{{ employee.nombre }}</td>
                <td>{{ employee.apellidoPaterno }}</td>
                <td> {{ employee.apellidoMaterno }}</td>
                <td class="email">{{ employee.email }}</td>
                <td class="createdDay">{{ employee.fechaDeCreacion }}</td>
                <td class="role">{{ employee.rol.nombre }}</td>
<!--                <td class="d-flex align-items-center">-->
<!--                  <span :class="employee.activo ? 'badge bg-success' : 'badge bg-danger'"-->
<!--                        class="me-2 mt-2 mb-2" style="font-size: 14px">-->
<!--                    {{ employee.activo ? 'Activo' : 'Inactivo' }}-->
<!--                  </span>-->
<!--                  <BFormCheckbox-->
<!--                      v-model="employee.activo"-->
<!--                      switch-->
<!--                      :true-value="true"-->
<!--                      :false-value="false"-->
<!--                      @change="cambiarActivoUsuario(employee.id, employee.activo)"-->
<!--                      class="mt-1 mb-2"-->
<!--                      style="height: 20px; width: 36px"-->
<!--                  >-->
<!--                  </BFormCheckbox>-->
<!--                </td>-->
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(28)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-empleados/${employee.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(employee.id)" v-if="permisos.includes(29)">
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
import axios from "axios";
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
      employees: [],
      searchQuery: "",
      page: 1,
      perPage: 5,
      pages: [],
      permisos:[]
    };
  },
  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async cambiarActivoUsuario(id, activeStatus) {
      try {
        const response = await axios.patch(`http://localhost:8080/api/update-active-status`, null, {
          params: {
            accountId: id,
            activeStatus: activeStatus
          }
        });
        if (response.status === 200) {
          Swal.fire("Estado Actualizado!", "", "success");
        }
      } catch (error) {
        console.error("Error Actualizando el Estado", error);
        Swal.fire("Error", "No se pudo actualizar el estado del usuario.", "error");
      }
    },
    fetchEmployees() {
      axios
        .get("http://localhost:8080/api/companies/current/employee")
        .then((response) => {
          this.employees = response.data;
          this.setPages();
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          Swal.fire(
            "Error",
            "No se pudo cargar la información de los empleados.",
            "error"
          );
        });
    },
    setPages() {
      let numberOfPages = Math.ceil(this.filteredEmployees.length / this.perPage);
      this.pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
    },
    paginate(data) {
      let from = (this.page - 1) * this.perPage;
      let to = this.page * this.perPage;
      return data.slice(from, to);
    },
    goToPage(pageNumber) {
      if (pageNumber !== "...") {
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
      this.employees.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return res;
      });
    },
    confirm(employeeId) {
      Swal.fire({
        title: "¿Estás seguro de desactivar este empleado?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, desactivar!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(
              `http://localhost:8080/api/companies/current/employees/${employeeId}/delete`
            );

            Swal.fire("Empleado desactivado", "", "success");
            this.fetchEmployees(); 
          } catch (error) {
            console.error("Error al desactivar el empleado:", error);
            Swal.fire("Error", "No se pudo desactivar el empleado", "error");
          }
        }
      });
    },
  },
  computed: {
    filteredEmployees() {
      const search = this.searchQuery.toLowerCase();
      return this.employees.filter((employee) =>
        `${employee.nombre} ${employee.apellidoPaterno} ${employee.apellidoMaterno} ${employee.email} ${employee.empresa ? employee.empresa.nombre : ''} ${employee.rol.nombre}`
          .toLowerCase()
          .includes(search)
      );
    },
    resultQuery() {
      return this.paginate(this.filteredEmployees);
    },
    displayedPages() {
      let startPage = Math.max(this.page - 1, 1);
      let endPage = Math.min(startPage + 2, this.pages.length);

      if (endPage - startPage < 2) {
        startPage = Math.max(endPage - 2, 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
  },
  watch: {
    employees() {
      this.setPages();
    },
    searchQuery() {
      this.setPages();
    },
  },
  created() {
    this.fetchEmployees();
    this.loadUserData();
  },
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
