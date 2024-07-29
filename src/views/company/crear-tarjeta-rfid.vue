<template>
  <Layout>
    <PageHeader title="Crear Tarjeta RFID" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Tarjeta RFID" />
          <BCardBody>
            <div class="live-preview">
<!--              <BForm @submit.prevent="createCharger">-->
                <BRow>


                  <BCol md="6">
                    <div class="mb-3">
                      <label for="alias" class="form-label">Nombre</label>
                      <BFormInput
                          type="text"
                          class="form-control"
                          placeholder="Nombre"
                          id="alias"
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="alias" class="form-label">Código tarjeta</label>
                      <BFormInput
                          type="text"
                          class="form-control"
                          placeholder="Código Tarjeta"
                          id="alias"
                      />
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="StartleaveDate" class="form-label">Fecha Expiración</label>
                      <flat-pickr  class="form-control"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol lg="12">
                    <div class="text-end">
                      <BButton style="background-color: #dfe4ea" type="submit" variant="light" @click="successmsg">
                        Crear Tarjeta RFID
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
<!--              </BForm>-->
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

export default {
  data() {
    return {
    };
  },
  components: {
    flatPickr,
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    successmsg() {
      Swal.fire({
        title: "Tarjeta RFID Creada!",
        text: "Redirigiendo a la página de Tarjetas RFID...",
        icon: "success",
        timer: 2000, // Tiempo en milisegundos antes de redirigir
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('/company/tarjetas-rfid'); // Redirigir a la página de cargadores
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
</style>o
