<template>
  <Layout>
    <PageHeader title="Asignar Autos a Flota" />

    <BRow>
      <!-- Lista de Flotas disponibles -->
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control border-light"
              autocomplete="off"
              placeholder="Buscar Flota..."
              v-model="flotaSearchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <div class="table-responsive" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col"></th> <!-- Checkbox column -->
                <th scope="col">Nombre de la Flota</th>
                <th scope="col">Precio Flota</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="flota in filteredFlotas" :key="flota.id" @click="selectFlota(flota)">
                <td>
                  <input
                      type="radio"
                      name="flotaSelection"
                      :value="flota"
                      v-model="selectedFlota"
                      @click.stop="selectFlota(flota)"
                  />
                </td>
                <td>{{ flota.nombreFlota }}</td>
                <td>{{ "$" + flota.precioFlota }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BCol>

      <!-- Lista de Autos disponibles -->
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control border-light"
              autocomplete="off"
              placeholder="Buscar Auto..."
              v-model="carSearchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <BCardBody class="border-end" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col"></th> <!-- Checkbox column -->
                <th scope="col">Alias</th>
                <th scope="col">Patente</th>
                <th scope="col">Modelo</th>
                <th scope="col">Flota Perteneciente</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="car in filteredCars" :key="car.id" @click="toggleCarSelection(car)">
                <td>
                  <input
                      type="checkbox"
                      :value="car"
                      v-model="selectedCars"
                      @click.stop="toggleCarSelection(car)"
                  />
                </td>
                <td>{{ car.alias }}</td>
                <td>{{ car.patente }}</td>
                <td>{{ car.modelo }}</td>
                <td>{{ car.flotaNombre ? car.flotaNombre : 'No está asignado a ninguna flota' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-if="selectedFlota && selectedCars.length > 0" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
            <div>
              <h5>Asignación Seleccionada</h5>
              <p class="mb-1"><strong>Flota:</strong> {{ selectedFlota.nombreFlota }}</p>
              <p class="mb-1"><strong>Precio:</strong> {{ "$" + selectedFlota.precioFlota }}</p>
              <p class="mb-1"><strong>Autos Seleccionados:</strong> {{ selectedCars.length }}</p>
            </div>
            <div class="ms-auto me-3">
              <BButton style="" variant="light" @click="assignCarsToFlota">Asignar Autos a Flota</BButton>
            </div>
          </div>
        </BCardBody>
        <div class="d-flex justify-content-end mt-4">
          <BButton variant="dark" @click="$router.push('/company/flotas')" class="mb-3">
            Volver
          </BButton>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from 'axios';


export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      flotaSearchQuery: '',
      carSearchQuery: '',
      selectedFlota: null,
      selectedCars: [],
      flotas: [], // Flotas disponibles
      cars: [] // Autos de la cuenta
    };
  },
  computed: {
    filteredFlotas() {
      return this.flotas.filter(flota =>
          flota.nombreFlota.toLowerCase().includes(this.flotaSearchQuery.toLowerCase())
      );
    },
    filteredCars() {
      return this.cars.filter(car =>
          car.patente.toLowerCase().includes(this.carSearchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.fetchFlotas();
    this.fetchAccountCars();
  },
  methods: {
    async fetchFlotas() {
      try {
        const response = await axios.get('http://localhost:8088/api/flotas');
        this.flotas = response.data;
      } catch (error) {
        console.error("Error obteniendo las flotas:", error);
      }
    },
    async fetchAccountCars() {
      try {
        const response = await axios.get('http://localhost:8088/api/accounts/current/cars');
        this.cars = response.data;
      } catch (error) {
        console.error("Error obteniendo los autos de la cuenta:", error);
      }
    },
    selectFlota(flota) {
      this.selectedFlota = flota;
    },
    toggleCarSelection(car) {
      if (this.selectedCars.includes(car)) {
        this.selectedCars = this.selectedCars.filter(selected => selected.id !== car.id);
      } else {
        this.selectedCars.push(car);
      }
    },
    async assignCarsToFlota() {
      if (this.selectedFlota && this.selectedCars.length > 0) {
        try {
          const carIds = this.selectedCars.map(car => car.id); // Array de IDs de autos
          await axios.post(`http://localhost:8088/api/flotas/${this.selectedFlota.id}/assign-cars`, carIds);

          Swal.fire({
            title: "Asignación Exitosa!",
            text: "Los autos han sido asignados a la flota.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              this.fetchFlotas();
              this.selectedFlota = null;
              this.selectedCars = [];
              this.$router.push("/company/flotas");
            }
          });
        } catch (error) {
          console.error("Error asignando los autos a la flota:", error);
          Swal.fire("Error", "No se pudo asignar los autos a la flota", "error");
        }
      } else {
        Swal.fire("Selecciona Flota y Autos", "Debes seleccionar una flota y al menos un auto para realizar la asignación", "warning");
      }
    }
  }
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
