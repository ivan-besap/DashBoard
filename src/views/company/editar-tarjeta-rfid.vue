<template>
  <Layout>
    <PageHeader title="Actualizar Tarjeta RFID" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Tarjeta RFID" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateDeviceIdentifier">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombreTarjeta" class="form-label">Nombre</label>
                      <BFormInput 
                        v-model="deviceIdentifier.nombreDeIdentificador" 
                        type="text" 
                        class="form-control" 
                        placeholder="Nombre de la tarjeta" 
                        id="nombreTarjeta" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="codigoTarjeta" class="form-label">Código RFID</label>
                      <BFormInput 
                        v-model="deviceIdentifier.rfid" 
                        type="text" 
                        class="form-control" 
                        placeholder="Código RFID" 
                        id="codigoTarjeta" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaExpiracion" class="form-label">Fecha de Expiración</label>
                      <flat-pickr v-model="deviceIdentifier.fechaExpiracion" class="form-control" required></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="autoSelect" class="form-label">Patente del Auto</label>
                      <Multiselect
                          style="border: 1px solid black;"
                          v-model="deviceIdentifier.auto"
                          :options="cars"
                          label="label"
                          track-by="label"
                          placeholder="Selecciona o ingrese una patente"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('https://app.evolgreen.com:8088/api/company/tarjetas-rfid')">
                        Volver
                      </BButton>
                      <BButton style="background-color: #dfe4ea;" type="submit" variant="light">
                        Actualizar Tarjeta
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
import axios from 'axios';
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Multiselect from "@vueform/multiselect";

export default {
  data() {
    return {
      deviceIdentifier: {
        nombreDeIdentificador: '',  
        rfid: '',
        fechaExpiracion: '',
        auto: null  // Auto seleccionado
      },
      cars: []  // Lista de autos para el select
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    flatPickr,
    Multiselect
  },
  created() {
    this.fetchDeviceIdentifierData();  
    this.fetchCars();  // Obtener la lista de autos al cargar la página
  },
  methods: {
    // Obtener datos de la tarjeta RFID a editar
    async fetchDeviceIdentifierData() {
      const deviceId = this.$route.params.id;
      try {
        const response = await axios.get(`https://app.evolgreen.com:8088/api/accounts/current/deviceIdentifiers/${deviceId}`);
        this.deviceIdentifier = response.data;
        if(response.data.auto === null){
          this.deviceIdentifier.auto = ''
        }
      } catch (error) {
        console.error("Error obteniendo los datos del dispositivo:", error);
      }
    },
    // Obtener lista de autos
    async fetchCars() {
      try {
        const response = await axios.get('https://app.evolgreen.com:8088/api/accounts/current/cars');
        this.cars = response.data.map(car => ({
          label: car.patente,
          value: car.id
        }));
      } catch (error) {
        console.error("Error obteniendo los autos:", error);
      }
    },
    // Actualizar la tarjeta RFID con los nuevos datos
    async updateDeviceIdentifier() {
      const deviceId = this.$route.params.id;
      try {
        const updatedData = {
          nombreDeIdentificador: this.deviceIdentifier.nombreDeIdentificador,
          rfid: this.deviceIdentifier.rfid,
          fechaExpiracion: this.deviceIdentifier.fechaExpiracion,
          auto: this.deviceIdentifier.auto  // Auto seleccionado
        };

        await axios.put(
          `https://app.evolgreen.com:8088/api/accounts/current/device-identifiers/${deviceId}`,
          updatedData
        );

        Swal.fire({
          title: "Tarjeta Actualizada!",
          text: "Redirigiendo a la lista de tarjetas RFID...",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            this.$router.push('https://app.evolgreen.com:8088/api/company/tarjetas-rfid');
          }
        });

      } catch (error) {
        console.error("Error actualizando la tarjeta:", error);
        Swal.fire("Error", "No se pudo actualizar la tarjeta", "error");
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
