<template>
  <Layout>
    <PageHeader title="Tarifas" pageTitle="Dashboard" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <router-link class="nav-link menu-link" target="" to="/company/crear-tarifas">
        Crear Tarifa
      </router-link>
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
            <th scope="col">Tarifa</th>
            <th scope="col">Periodo</th>
            <th scope="col">Día de la Semana</th>
            <th scope="col">Conector</th>
            <th scope="col">Valor</th>
            <th scope="col">Ubicación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td>{{ plan.name }}</td>
            <td>{{ plan.period }}</td>
            <td>{{ plan.weekDays.join(', ') }}</td>
            <td>{{ plan.chargerType }}</td>
            <td>{{ plan.value }}</td>
            <td>{{ plan.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      plans: [
        { id: 1, name: 'Tarifa 1', period: '01/01 - 01/31', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación A', value: '$200' },
        { id: 2, name: 'Tarifa 2', period: '02/01 - 02/28', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación B', value: '$300' },
        { id: 3, name: 'Tarifa 3', period: '03/01 - 03/31', weekDays: ['Viernes', 'Sábado'], chargerType: 'AC', location: 'Ubicación C', value: '$100' },
        { id: 4, name: 'Tarifa 4', period: '04/01 - 04/30', weekDays: ['Domingo'], chargerType: 'DC', location: 'Ubicación D', value: '$500' },
        { id: 5, name: 'Tarifa 5', period: '05/01 - 05/31', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación E', value: '$250' },
        { id: 6, name: 'Tarifa 6', period: '06/01 - 06/30', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación F', value: '$350' },
        { id: 7, name: 'Tarifa 7', period: '07/01 - 07/31', weekDays: ['Viernes', 'Sábado'], chargerType: 'AC', location: 'Ubicación G', value: '$150' },
        { id: 8, name: 'Tarifa 8', period: '08/01 - 08/31', weekDays: ['Domingo'], chargerType: 'DC', location: 'Ubicación H', value: '$600' },
        { id: 9, name: 'Tarifa 9', period: '09/01 - 09/30', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación I', value: '$280' },
        { id: 10, name: 'Tarifa 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación J', value: '$400' }
      ]
    };
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
