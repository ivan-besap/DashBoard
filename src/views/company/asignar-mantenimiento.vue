<template>
    <Layout>
      <PageHeader title="Asignar Mantenimiento" pageTitle="items" />
  
      <BRow>
        <BCol xl="6">
          <div class="search-box mb-2">
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
              <table class="table table-hover align-middle table-nowrap mb-0">
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
          <div class="search-box mb-2">
            <input
                type="text"
                class="form-control border-light"
                autocomplete="off"
                id="searchList"
                placeholder="Buscar mantenimiento..."
                v-model="searchQuery"
            />
            <i class="ri-search-line search-icon"></i>
          </div>
          <BCardBody class="border-end" style="background-color: white">
            <div style="max-height: 500px; overflow-y: auto;">
              <table class="table table-hover align-middle table-nowrap mb-0">
                <thead class="table-light">
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data, index) in resultQuery" :key="index" @click="selectPlan(data)">
                  <td>{{ data.description }}</td>
                  <td>{{ data.date }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="selectedPlan" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
              <div>
                <h5>Mantenimiento Seleccionado</h5>
                <p class="mb-1"><strong>Descripción:</strong> {{ selectedPlan.description }}</p>
                <p><strong>Fecha:</strong> {{ selectedPlan.date }}</p>
              </div>
              <div class="ms-auto me-3">
                <BButton style="" variant="light" @click="assignPlan">Asignar Mantenimiento</BButton>
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
  import Swal from "sweetalert2";
  
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
        maintenance: [
          { id: 1, description: 'Revisión general', date: '10/08/2024' },
          { id: 2, description: 'Cambio de filtro', date: '11/08/2024' },
          { id: 3, description: 'Revisión eléctrica', date: '12/08/2024' },
          { id: 4, description: 'Limpieza de cargador', date: '13/08/2024' },
          { id: 5, description: 'Ajuste de conectores', date: '14/08/2024' },
          { id: 6, description: 'Verificación de software', date: '15/08/2024' },
          { id: 7, description: 'Inspección de seguridad', date: '16/08/2024' },
          { id: 8, description: 'Cambio de batería interna', date: '17/08/2024' },
          { id: 9, description: 'Revisión de red eléctrica', date: '18/08/2024' },
          { id: 10, description: 'Pruebas de carga', date: '19/08/2024' }
        ],
      };
    },
  
    computed: {
      resultQuery() {
        return this.maintenance.filter((item) => {
          return item.description.toLowerCase().includes(this.searchQuery.toLowerCase());
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
          console.log('Mantenimiento asignado:', this.selectedPlan);

           // Mostrar SweetAlert de confirmación
      Swal.fire({
        title: 'Mantenimiento Asignado',
        text: `El mantenimiento  ha sido asignado exitosamente.`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
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
  