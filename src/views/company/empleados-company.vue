<template>
  <Layout>
    <PageHeader title="Empleados" pageTitle="items" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="/company/create-empleados-company">Crear Empleado</a>
    </BButton>

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
            <th scope="col">Apellido</th>
            <th scope="col">Email</th>
            <th scope="col">Fecha de Creación</th>
            <th scope="col">Empresa</th>
            <th scope="col">Activo</th>
            <th scope="col">Plan</th>
            <th scope="col">Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td><a href="#" class="fw-semibold">{{ employee.firstSurname }}</a></td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.createdDay }}</td>
            <td>{{ employee.company }}</td>
            <td>
              <span :class="['badge', employee.active ? 'bg-success' : 'bg-danger']">
                {{ employee.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ employee.plan }}</td>
            <td>{{ employee.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      employees: []
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get('http://localhost:8080/api/employees');
        this.employees = response.data.map(employee => {
          // Asignar aleatoriamente un plan a cada empleado
          const plans = ["PLAN A BÁSICO", "PLAN B INTERMEDIO", "PLAN C AVANZADO"];
          const roles = ["Administrador", "Usuario"];
          employee.plan = plans[Math.floor(Math.random() * plans.length)];
          employee.role = roles[Math.floor(Math.random() * roles.length)];
          return employee;
        });
        console.log(this.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
