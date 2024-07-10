<template>
  <Layout>
    <PageHeader title="Planes" pageTitle="Dashboard" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="crear-planes">Crear Plan</a>
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
            <th scope="col">Plan</th>
            <th scope="col">Periodo</th>
            <th scope="col">Día de la Semana</th>
            <th scope="col">Horario</th>
            <th scope="col">Tipo Cargador</th>
            <th scope="col">Potencia</th>
            <th scope="col">Ubicación CPO</th>
            <th scope="col">KWH</th>
            <th scope="col">Minutos</th>
            <th scope="col">Descuento</th>
            <th scope="col">Valor Plan</th>
           
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
            <td>{{ plan.schedule }}</td>
            <td>{{ plan.chargerType }}</td>
            <td>{{ plan.power }} kW</td>
            <td>{{ plan.location }}</td>
            <td>{{ plan.kwh }} kWh</td>
            <td>{{ plan.minutes }} min</td>
            <td>{{ plan.discount }}%</td>
            <td>{{ plan.value }}</td>
           
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
        { id: 1, name: 'Plan 1', period: '01/01 - 01/31', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación A', kwh: 100, minutes: 60, discount: 10, value: '$200' },
        { id: 2, name: 'Plan 2', period: '02/01 - 02/28', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 50, location: 'Ubicación B', kwh: 200, minutes: 120, discount: 15, value: '$300' },
        { id: 3, name: 'Plan 3', period: '03/01 - 03/31', weekDays: ['Viernes', 'Sábado'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 11, location: 'Ubicación C', kwh: 50, minutes: 30, discount: 5, value: '$100' },
        { id: 4, name: 'Plan 4', period: '04/01 - 04/30', weekDays: ['Domingo'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 100, location: 'Ubicación D', kwh: 400, minutes: 240, discount: 20, value: '$500' },
        { id: 5, name: 'Plan 5', period: '05/01 - 05/31', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación E', kwh: 150, minutes: 90, discount: 10, value: '$250' },
        { id: 6, name: 'Plan 6', period: '06/01 - 06/30', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 75, location: 'Ubicación F', kwh: 250, minutes: 150, discount: 15, value: '$350' },
        { id: 7, name: 'Plan 7', period: '07/01 - 07/31', weekDays: ['Viernes', 'Sábado'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 11, location: 'Ubicación G', kwh: 75, minutes: 45, discount: 5, value: '$150' },
        { id: 8, name: 'Plan 8', period: '08/01 - 08/31', weekDays: ['Domingo'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 120, location: 'Ubicación H', kwh: 500, minutes: 300, discount: 20, value: '$600' },
        { id: 9, name: 'Plan 9', period: '09/01 - 09/30', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación I', kwh: 180, minutes: 100, discount: 10, value: '$280' },
        { id: 10, name: 'Plan 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 85, location: 'Ubicación J', kwh: 300, minutes: 180, discount: 15, value: '$400' }
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
