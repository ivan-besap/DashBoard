<template>
  <Layout>
    <PageHeader title="Crear Flota" pagetitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Flota" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createCar">
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
                        v-model="car.añoFabricacion" 
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
                    <div class="text-end">
                      <BButton style="" type="submit" variant="light"  @click="successmsg">
                        Crear Flota
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
import axios from 'axios';

export default {
  data() {
    return {
      car: {
        patente: '',
        modelo: '',
        vin: '',
        color: '',
        marca: '',
        añoFabricacion: '',
        capacidadPotencia: ''
      }
    };
  },
  methods: {
    successmsg() {
      Swal.fire({
        title: "Flota creada!",
        text: "Redirigiendo a la página de Flotas...",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('/company/flotas');
        }
      });
    },
    async createCar() {
      try {
        await axios.post('http://localhost:8080/api/companies/current/cars', this.car);
        this.successmsg();
      } catch (error) {
        console.error("Error creando el auto:", error);
        alert('Error creando el auto');
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
