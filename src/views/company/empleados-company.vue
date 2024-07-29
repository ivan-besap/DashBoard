<template>
  <Layout>
    <PageHeader title="Empleados" pageTitle="items" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/create-empleados-company">
              Crear Empleado
            </router-link>
          </BButton>
          
        </div>
        <div class="contenedor-finac" style="width: 246px;">
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
   

    <div class="table-responsive table-card">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                <label class="form-check-label" for="cardtableCheck"></label>
              </div>
            </th>
            <th scope="col">Nombre</th>
            <th scope="col">Email</th>
            <th scope="col">Fecha de Creación</th>
            <th scope="col">Empresa</th>
            <th scope="col">Activo</th>
            <th scope="col">Plan</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="customSwitchsizemd">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td><a href="#" class="fw-semibold">{{ employee.firstSurname }}</a></td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.createdDay }}</td>
            <td>{{ employee.company }}</td>
            <td>
             <!-- Base Switchs -->
<div class="form-check form-switch">
<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">

</div>
            </td>
            <td>{{ employee.plan }}</td>
            <td>{{ employee.role }}</td>
            <td>
              <BButton pill variant="warning" class="waves-effect waves-light">
                <router-link class="nav-link menu-link" :to="`/company/editar-empleados/`">Editar</router-link>
              </BButton>
              <BButton pill variant="danger" style="margin-left: 5px;" class="waves-effect waves-light" @click="confirm">
                Eliminar
              </BButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
      employees: [
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
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
