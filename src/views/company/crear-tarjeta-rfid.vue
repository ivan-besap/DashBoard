<template>
  <Layout>
    <PageHeader title="Crear Tarjeta RFID" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Tarjeta RFID" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createDeviceIdentifier">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombre" class="form-label">Nombre</label>
                      <BFormInput
                          v-model="deviceIdentifier.nombreDeIdentificador"
                          type="text"
                          class="form-control"
                          placeholder="Nombre"
                          id="nombre"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="rfid" class="form-label">Código tarjeta</label>
                      <BFormInput
                          v-model="deviceIdentifier.rfid"
                          type="text"
                          class="form-control"
                          placeholder="Código Tarjeta"
                          id="rfid"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaExpiracion" class="form-label">Fecha Expiración</label>
                      <flat-pickr
                          v-model="deviceIdentifier.fechaExpiracion"
                          class="form-control"
                          :config="{ dateFormat: 'Y-m-d' }"
                          placeholder="Selecciona la fecha de expiración"
                          id="fechaExpiracion"
                          required
                      ></flat-pickr>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/tarjetas-rfid')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Crear
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
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Swal from "sweetalert2";
import flatPickr from "vue-flatpickr-component";
import axios from "axios";

export default {
  data() {
    return {
      deviceIdentifier: {
        nombreDeIdentificador: '',
        rfid: '',
        fechaExpiracion: '',
        auto: null
      }
    };
  },
  components: {
    flatPickr,
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async createDeviceIdentifier() {
      try {
        const response = await axios.post('https://app.evolgreen.com/api/accounts/current/device-identifiers', this.deviceIdentifier);
        if (response.status === 200 || response.status === 201){
          Swal.fire({
            title: "Tarjeta RFID Creada!",
            text: "Redirigiendo a la página de Tarjetas RFID...",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              this.$router.push('/company/tarjetas-rfid');
            }
          });
        }
      } catch (error) {
        console.error("Error al crear la tarjeta RFID:", error);
        Swal.fire("Error", "No se pudo crear la tarjeta RFID", "error");
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
