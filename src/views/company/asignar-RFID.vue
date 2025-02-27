<template>
    <Layout>
      <PageHeader title="Asignar Auto a RFID" />
  
      <BRow>
        <!-- Lista de RFIDs sin auto asignado -->
        <BCol xl="6">
          <div class="search-box mb-4">
            <input
                type="text"
                class="form-control border-light"
                autocomplete="off"
                id="searchRFID"
                placeholder="Buscar RFID..."
                v-model="rfidSearchQuery"
            />
            <i class="ri-search-line search-icon"></i>
          </div>
          <div class="table-responsive" style="background-color: white">
            <div style="max-height: 500px; overflow-y: auto;">
              <table class="table table-striped table-hover align-middle table-nowrap mb-0">
                <thead class="table-light">
                <tr>
                  <th scope="col"></th> <!-- Checkbox column -->
                  <th scope="col">RFID</th>
                  <th scope="col">Nombre Identificador</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="rfid in filteredRFIDs" :key="rfid.id" @click="selectRFID(rfid)">
                  <td>
                    <input
                        type="radio"
                        name="rfidSelection"
                        :value="rfid"
                        v-model="selectedRFID"
                        @click.stop="selectRFID(rfid)"
                    />
                  </td>
                  <td>{{ rfid.rfid }}</td>
                  <td>{{ rfid.nombreDeIdentificador }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </BCol>
  
        <!-- Lista de autos disponibles -->
        <BCol xl="6">
          <div class="search-box mb-4">
            <input
                type="text"
                class="form-control border-light"
                autocomplete="off"
                id="searchCars"
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
                  <th scope="col">RFID</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="car in filteredCars" :key="car.id" @click="selectCar(car)">
                  <td>
                    <input
                        type="radio"
                        name="carSelection"
                        :value="car"
                        v-model="selectedCar"
                        @click.stop="selectCar(car)"
                    />
                  </td>
                  <td>{{ car.alias }}</td>
                  <td>{{ car.patente }}</td>
                  <td>{{ car.modelo }}</td>
                  <td>
                    <span v-if="car.rfid.length > 0">
                      {{ car.rfid[0].nombreDeIdentificador }}
                    </span>
                    <span v-else>
                      No tiene RFID
                    </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="selectedRFID && selectedCar" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
              <div>
                <h5>Asignación Seleccionada</h5>
                <p class="mb-1"><strong>RFID:</strong> {{ selectedRFID.rfid }}</p>
                <p class="mb-1"><strong>Auto:</strong> {{ selectedCar.patente }}</p>
              </div>
              <div class="ms-auto me-3">
                <BButton style="" variant="light" @click="assignCarToRFID">Asignar Auto</BButton>
              </div>
            </div>
          </BCardBody>
          <div class="d-flex justify-content-end mt-4">
            <BButton variant="dark" @click="$router.push('/company/tarjetas-rfid')" class="mb-3">
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
        rfidSearchQuery: '',
        carSearchQuery: '',
        selectedRFID: null,
        selectedCar: null,
        rfids: [], // RFIDs no asignados
        cars: [] // Autos de la cuenta
      };
    },
    computed: {
      filteredRFIDs() {
        return this.rfids.filter(rfid =>
          rfid.rfid.toLowerCase().includes(this.rfidSearchQuery.toLowerCase())
        );
      },
      filteredCars() {
        return this.cars.filter(car =>
          car.patente.toLowerCase().includes(this.carSearchQuery.toLowerCase())
        );
      }
    },
    created() {
      this.fetchUnassignedRFIDs();
      this.fetchAccountCars();
    },
    methods: {
      async fetchUnassignedRFIDs() {
        try {
          const response = await axios.get('http://localhost:8088/api/unassigned-device-identifiers');
          this.rfids = response.data;
        } catch (error) {
          console.error("Error obteniendo los RFIDs no asignados:", error);
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
      selectRFID(rfid) {
        this.selectedRFID = rfid;
      },
      selectCar(car) {
        this.selectedCar = car;
      },
      async assignCarToRFID() {
        if (this.selectedRFID && this.selectedCar) {
          try {
            await axios.patch(
              `http://localhost:8088/api/accounts/current/device-identifiers/${this.selectedRFID.id}/assign-car`,
              { carId: this.selectedCar.id }
            );
  
            Swal.fire({
              title: "Asignación Exitosa!",
              text: "El auto ha sido asignado al RFID.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                this.fetchUnassignedRFIDs(); // Refrescar la lista de RFIDs
                this.selectedRFID = null;
                this.selectedCar = null;
                location.reload()
              }
            });
          } catch (error) {
            console.error("Error asignando el auto al RFID:", error);
            Swal.fire("Error", "No se pudo asignar el auto al RFID", "error");
          }
        } else {
          Swal.fire("Selecciona RFID y Auto", "Debes seleccionar un RFID y un auto para realizar la asignación", "warning");
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
  