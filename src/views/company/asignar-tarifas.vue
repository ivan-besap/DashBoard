<template>
  <Layout>
    <PageHeader title="Asignar Tarifas" pageTitle="items" />

    <BRow>
      <BCol xl="6">
        <div class="table-responsive" style="background-color: white">
          <table class="table table-hover align-middle table-nowrap mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                    <label class="form-check-label" for="cardtableCheck"></label>
                  </div>
                </th>
                <th scope="col">Nombre</th>
                <th scope="col">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="station in chargingStations" :key="station.id">
                <td>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                    <label class="form-check-label" for="cardtableCheck01"></label>
                  </div>
                </td>
                <td>{{ station.name }}</td>
                <td>{{ station.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCol>
      <BCol xl="6">
        <BCardBody class="border-end" style="background-color: white">
          <div class="search-box">
            <input
                type="text"
                class="form-control bg-light border-light"
                autocomplete="off"
                id="searchList"
                placeholder="Buscar tarifa..."
                v-model="searchQuery"
            />
            <i class="ri-search-line search-icon"></i>
          </div>
          <simplebar data-simplebar style="max-height: 190px" class="px-3 mx-n3">
            <ul class="list-unstyled mb-0 pt-2" id="candidate-list">
              <li v-for="(data, index) in resultQuery" :key="index" @click="selectPlan(data)">
                <BLink href="javascript:void(0);" class="d-flex align-items-center py-2">
                  <div class="flex-grow-1">
                    <h5 class="fs-13 mb-1 text-truncate">
                      <span style="margin-left: 10px;" class="candidate-name">{{ data.name }}</span>
                      <span class="ms-2 text-muted fw-normal">{{ data.value }}</span>
                    </h5>
                  </div>
                </BLink>
              </li>
            </ul>
          </simplebar>
          <div v-if="selectedPlan" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
            <div>
              <h5>Tarifa Seleccionada</h5>
              <p class="mb-1"><strong>Nombre:</strong> {{ selectedPlan.name }}</p>
              <p><strong>Costo:</strong> {{ selectedPlan.value }}</p>
            </div>
            <div class="ms-auto me-3">
              <BButton style="" variant="light" @click="assignPlan">Asignar Tarifa</BButton>
            </div>
          </div>
        </BCardBody>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import simplebar from "simplebar-vue";

export default {
  components: {
    simplebar,
    Layout,
    PageHeader,
  },

  data() {
    return {
      searchQuery: '',
      selectedPlan: null,
      exManualSelected: null,
      chargingStations: [
        { id: 1, name: 'Estación 1', location: 'Santiago' },
        { id: 2, name: 'Estación 2', location: 'Lima' },
        { id: 3, name: 'Estación 3', location: 'Línea 1 T1' },
        { id: 4, name: 'Estación 4', location: 'Línea 1 T2' },
        { id: 5, name: 'Estación 5', location: 'Santiago' },
        { id: 6, name: 'Estación 6', location: 'Lima' },
        { id: 7, name: 'Estación 7', location: 'Línea 1 T1' },
        { id: 8, name: 'Estación 8', location: 'Línea 1 T2' },
      ],
      plans: [
        { id: 1, name: 'Tarifa 1', period: '01/01 - 01/31', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación A', kwh: 100, minutes: 60, discount: 10, value: '$200' },
        { id: 2, name: 'Tarifa 2', period: '02/01 - 02/28', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 50, location: 'Ubicación B', kwh: 200, minutes: 120, discount: 15, value: '$300' },
        { id: 3, name: 'Tarifa 3', period: '03/01 - 03/31', weekDays: ['Viernes', 'Sábado'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 11, location: 'Ubicación C', kwh: 50, minutes: 30, discount: 5, value: '$100' },
        { id: 4, name: 'Tarifa 4', period: '04/01 - 04/30', weekDays: ['Domingo'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 100, location: 'Ubicación D', kwh: 400, minutes: 240, discount: 20, value: '$500' },
        { id: 5, name: 'Tarifa 5', period: '05/01 - 05/31', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación E', kwh: 150, minutes: 90, discount: 10, value: '$250' },
        { id: 6, name: 'Tarifa 6', period: '06/01 - 06/30', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 75, location: 'Ubicación F', kwh: 250, minutes: 150, discount: 15, value: '$350' },
        { id: 7, name: 'Tarifa 7', period: '07/01 - 07/31', weekDays: ['Viernes', 'Sábado'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 11, location: 'Ubicación G', kwh: 75, minutes: 45, discount: 5, value: '$150' },
        { id: 8, name: 'Tarifa 8', period: '08/01 - 08/31', weekDays: ['Domingo'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 120, location: 'Ubicación H', kwh: 500, minutes: 300, discount: 20, value: '$600' },
        { id: 9, name: 'Tarifa 9', period: '09/01 - 09/30', weekDays: ['Lunes', 'Martes'], schedule: '9:00 AM - 2:00 PM', chargerType: 'AC', power: 22, location: 'Ubicación I', kwh: 180, minutes: 100, discount: 10, value: '$280' },
        { id: 10, name: 'Tarifa 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], schedule: '9:00 AM - 2:00 PM', chargerType: 'DC', power: 85, location: 'Ubicación J', kwh: 300, minutes: 180, discount: 15, value: '$400' }
      ],
    };
  },
  computed:{
    displayedPosts() {
      return this.plans;
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
              data.name.toLowerCase().includes(search) ||
              data.value.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
  },

  methods:
  {
selectPlan(plan) {
this.selectedPlan = plan;
this.searchQuery = ''; // Clear the search query after selection
},
assignPlan() {
// Aquí puedes agregar la lógica para asignar el plan seleccionado
// alert(Plan ${this.selectedPlan.name} asignado con éxito!);
this.selectedPlan = null; // Deselect plan after assigning
},
deselectPlan() {
this.selectedPlan = null;
}
}
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>