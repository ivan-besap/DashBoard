<template>
  <Layout>
    <PageHeader title="Actualizar Tarifas" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Tarjeta RFID" />
          <BCardBody>
            <div class="live-preview">
                <BRow>
                  <BCol md="4">
                    <div class="mb-3">
                      <label for="StartleaveDate" class="form-label">Nombre</label>
                      <BFormInput v-model="chargingStation.nombre" class="form-control"></BFormInput>
                    </div>
                  </BCol>
                  <BCol md="4">
                    <div class="mb-3">
                      <label type="number" for="StartleaveDate" class="form-label">Código</label>
                      <BFormInput v-model="chargingStation.codigo" class="form-control"></BFormInput>
                    </div>
                  </BCol>
                  <BCol md="4">
                    <div class="mb-3">
                      <label for="EndleaveDate" class="form-label">Fecha Expiración</label>
                      <flat-pickr v-model="chargingStation.fechaExpiracion" class="form-control"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="text-end">
                      <BButton style="background-color: #dfe4ea" type="submit" variant="light" @click="successmsg">
                        Actualizar Tarjeta
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import "flatpickr/dist/flatpickr.css";
import flatPickr from "vue-flatpickr-component";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      chargingStation: {
        nombre: "Tarjeta Oficina 23",
        codigo: "456897541287456200",
        fechaExpiracion: "13-08-2024",
      },
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    flatPickr
  },
  methods: {
    successmsg() {
      Swal.fire("Tarjeta Actualizada!", "", "success");
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
