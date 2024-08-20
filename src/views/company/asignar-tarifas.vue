<template>
  <Layout>
    <PageHeader title="Asignar Tarifas" pageTitle="items" />

    <BRow>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchStations"
              placeholder="Buscar estación..."
              v-model="stationSearchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <div class="table-responsive" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                    <label class="form-check-label" for="cardtableCheck"></label>
                  </div>
                </th>
                <th scope="col">Estación</th>
                <th scope="col">Cargador</th>
                <th scope="col">Conector</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="station in filteredStations" :key="station.id">
                <td>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" :id="'check' + station.id">
                    <label class="form-check-label" :for="'check' + station.id"></label>
                  </div>
                </td>
                <td>{{ station.name }}</td>
                <td>{{ station.charger }}</td>
                <td>{{ station.connector }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BCol>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchList"
              placeholder="Buscar tarifa..."
              v-model="searchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <BCardBody class="border-end" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Costo</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(data, index) in resultQuery" :key="index" @click="selectPlan(data)">
                <td>{{ data.name }}</td>
                <td>{{ data.value }}</td>
              </tr>
              </tbody>
            </table>
          </div>
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
// import simplebar from "simplebar-vue";

export default {
  components: {
    // simplebar,
    Layout,
    PageHeader,
  },

  data() {
    return {
      searchQuery: '',
      stationSearchQuery: '',
      selectedPlan: null,
      chargingStations: [
        { id: 1, name: 'Oficina Santiago', charger: 'STG-EMU-00009', connector: 'CCS Combo 2' },
        { id: 2, name: 'Lima', charger: 'STG-EMU-00007', connector: 'IEC Tipo 2' },
        { id: 3, name: 'Santiago ', charger: 'STG-EMU-00008', connector: 'Tipo 1 - J1772' },
        { id: 4, name: 'Las Condes ', charger: 'STG-EMU-00010', connector: 'CCS Combo 2' },
        { id: 5, name: 'San Isidro', charger: 'STG-EMU-00011', connector: 'CCS Combo 2' },
        { id: 6, name: 'Miraflores', charger: 'STG-EMU-00012', connector: 'CCS Combo 2' },
        { id: 7, name: 'Asia', charger: 'Cargador G', connector: 'CCS Combo 2' },
        { id: 8, name: 'Metropolitano', charger: 'Cargador H', connector: 'CCS Combo 2' },
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

  computed: {
    resultQuery() {
      return this.plans.filter((plan) => {
        return plan.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    filteredStations() {
      return this.chargingStations.filter(station =>
        station.name.toLowerCase().includes(this.stationSearchQuery.toLowerCase())
      );
    },
  },

  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
    },
    assignPlan() {
      if (this.selectedPlan) {
        // Aquí puedes agregar la lógica para asignar la tarifa seleccionada a la estación de carga seleccionada
        console.log('Tarifa asignada:', this.selectedPlan);
      }
    },
  },
};
</script>

<style scoped>
.search-box {
  position: relative;
}

.search-box .form-control {
  padding-left: 40px;
}

.search-box .search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}
</style>
