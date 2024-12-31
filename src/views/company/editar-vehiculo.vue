<template>
  <Layout>
    <PageHeader title="Editar Vehiculo" pagetitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Vehiculo" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateCar">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="patente" class="form-label">Patente</label>
                      <BFormInput 
                        v-model="car.patente" 
                        type="text" 
                        class="form-control" 
                        placeholder="Patente del auto" 
                        id="patente" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="modelo" class="form-label">Modelo</label>
                      <BFormInput 
                        v-model="car.modelo" 
                        type="text" 
                        class="form-control" 
                        placeholder="Modelo del auto" 
                        id="modelo" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="vin" class="form-label">VIN</label>
                      <BFormInput 
                        v-model="car.vin" 
                        type="text" 
                        class="form-control" 
                        placeholder="VIN del auto" 
                        id="vin" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="color" class="form-label">Color</label>
                      <BFormInput 
                        v-model="car.color" 
                        type="text" 
                        class="form-control" 
                        placeholder="Color del auto" 
                        id="color" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="marca" class="form-label">Marca</label>
                      <BFormInput 
                        v-model="car.marca" 
                        type="text" 
                        class="form-control" 
                        placeholder="Marca del auto" 
                        id="marca" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="añoFabricacion" class="form-label">Año de Fabricación</label>
                      <BFormInput 
                        v-model="car.anoFabricacion"
                        type="text" 
                        class="form-control" 
                        placeholder="Año de Fabricación" 
                        id="añoFabricacion" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="capacidadPotencia" class="form-label">Capacidad de Potencia</label>
                      <BFormInput 
                        v-model="car.capacidadPotencia" 
                        type="number" 
                        class="form-control" 
                        placeholder="Capacidad de Potencia del auto" 
                        id="capacidadPotencia" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/vehiculos')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Editar
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
              </BForm>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import "flatpickr/dist/flatpickr.css";
import "@vueform/multiselect/themes/default.css";
import Swal from "sweetalert2";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import axios from "axios";

export default {
  data() {
    return {
      car: {
        patente: '',
        modelo: '',
        vin: '',
        color: '',
        marca: '',
        anoFabricacion: '',
        capacidadPotencia: ''
      }
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  mounted() {
    this.loadCarData();
  },
  methods: {
  async loadCarData() {
    const carId = this.$route.params.id;

    console.log("Car ID:", carId);

    if (!carId || isNaN(carId)) {
      this.redirectToFlotas();
      return;
    }

    try {
      const response = await axios.get(`https://app.evolgreen.com/api/accounts/current/cars/${carId}`);
      console.log("API Response:", response.data); // Verifica los datos obtenidos
      if (response.data) {
        this.car = response.data;  // Carga los datos si el ID es válido y el auto existe
      } else {
        this.redirectToFlotas();  // Redirige si el auto no se encuentra
      }
    } catch (error) {
      console.error("Error al cargar los datos del auto:", error);
      this.redirectToFlotas();
    }
  },
    async updateCar() {
      try {
        const carId = this.$route.params.id; // Asume que el ID del auto se pasa como parámetro en la URL
        await axios.put(`https://app.evolgreen.com/api/accounts/current/cars/${carId}`, this.car);
        this.successmsg();
      } catch (error) {
        console.error("Error al actualizar el auto:", error);
        alert('Error al actualizar el auto');
      }
    },
    successmsg() {
      Swal.fire({
        title: "Vehículo Actualizado!",
        text: "Redirigiendo a la página de Vehiculos...",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('/company/vehiculos');
        }
      });
    },
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
