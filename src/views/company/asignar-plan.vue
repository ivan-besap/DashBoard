<template>
  <Layout>
    <PageHeader title="Asignar Planes" pageTitle="items" />

    <BRow>
      <BCol xl="6">
        <div class="table-responsive ">
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
              <th scope="col">Plan</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="station in chargingStations" :key="station.id">
              <td>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" :id="'cardtableCheck' + station.id">
                  <label class="form-check-label" :for="'cardtableCheck' + station.id"></label>
                </div>
              </td>
              <td>{{ station.name }}</td>
              <td>{{ station.location }}</td>
              <td>{{ station.plan }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </BCol>
      <BCol xl="6">
        <BCardBody class="border-end">
          <div class="search-box">
            <input
                type="text"
                class="form-control bg-light border-light"
                autocomplete="off"
                id="searchList"
                placeholder="Buscar plan..."
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
                      <span class="candidate-name">{{ data.name }}</span>
                      <span class="ms-2 text-muted fw-normal">{{ data.value }}</span>
                    </h5>
                  </div>
                </BLink>
              </li>
            </ul>
          </simplebar>
          <div v-if="selectedPlan" class="mt-3 d-flex justify-content-between align-items-center">
            <div>
              <h5>Plan Seleccionado</h5>
              <p class="mb-1"><strong>Nombre:</strong> {{ selectedPlan.name }}</p>
              <p><strong>Costo:</strong> {{ selectedPlan.value }}</p>
            </div>
            <div class="ms-auto me-3">
              <BButton variant="primary" @click="assignPlan">Asignar Plan</BButton>
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
import simplebar from "simplebar-vue"

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
        { id: 1, name: 'Estación 1', location: 'Santiago', plan: 'Plan 1' },
        { id: 2, name: 'Estación 2', location: 'Lima', plan: 'Plan 2' },
        { id: 3, name: 'Estación 3', location: 'Línea 1 T1', plan: 'Plan 3' },
        { id: 4, name: 'Estación 4', location: 'Línea 1 T2', plan: 'Plan 4' },
        { id: 5, name: 'Estación 5', location: 'Santiago', plan: 'Plan 5' },
        { id: 6, name: 'Estación 6', location: 'Lima', plan: 'Plan 6' },
        { id: 7, name: 'Estación 7', location: 'Línea 1 T1', plan: 'Plan 7' },
        { id: 8, name: 'Estación 8', location: 'Línea 1 T2', plan: 'Plan 8' },
        { id: 9, name: 'Estación 9', location: 'Santiago', plan: 'Plan 9' },
        { id: 10, name: 'Estación 10', location: 'Lima', plan: 'Plan 10' },
      ],
      plans: [
        { id: 1, name: 'Plan 1', value: '$200' },
        { id: 2, name: 'Plan 2', value: '$300' },
        { id: 3, name: 'Plan 3', value: '$100' },
        { id: 4, name: 'Plan 4', value: '$500' },
        { id: 5, name: 'Plan 5', value: '$250' },
        { id: 6, name: 'Plan 6', value: '$350' },
        { id: 7, name: 'Plan 7', value: '$150' },
        { id: 8, name: 'Plan 8', value: '$600' },
        { id: 9, name: 'Plan 9', value: '$280' },
        { id: 10, name: 'Plan 10', value: '$400' }
      ],
    };
  },

  computed: {
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.plans.filter((data) => {
          return (
              data.name.toLowerCase().includes(search) ||
              data.value.toLowerCase().includes(search)
          );
        });
      } else {
        return this.plans;
      }
    },
  },

  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
      this.searchQuery = ''; // Clear the search query after selection
    },
    assignPlan() {
      // Aquí puedes agregar la lógica para asignar el plan seleccionado
      alert(`Plan ${this.selectedPlan.name} asignado con éxito!`);
      this.selectedPlan = null; // Deselect plan after assigning
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
