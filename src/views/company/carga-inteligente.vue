<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import PageHeader from "@/components/page-header.vue";
import Layout from "@/layouts/main.vue";

const configuraciones = ref([
  { nombre: "connectorId", valor: "1" },
  { nombre: "chargingProfileId", valor: "4" },
  { nombre: "transactionId", valor: "223332" },
  { nombre: "stackLevel", valor: "2" },
  { nombre: "chargingProfilePurpose", valor: "TxProfile" },
  { nombre: "chargingProfileKind", valor: "Absolute" },
  { nombre: "recurrencyKind", valor: "Daily" },
  { nombre: "validFrom", valor: "2025-01-15T00:00:00Z" },
  { nombre: "validTo", valor: "2025-01-16T00:00:00Z" },
  { nombre: "chargingSchedule", valor: "" },
  { nombre: "duration", valor: "3600" },
  { nombre: "startSchedule", valor: "2025-01-15T00:00:00Z" },
  { nombre: "chargingRateUnit", valor: "A" },
  { nombre: "chargingSchedulePeriod", valor: "" },
  { nombre: "startPeriod", valor: "0" },
  { nombre: "limit", valor: "32" },
  { nombre: "numberPhases", valor: "3" },
  { nombre: "minChargingRate", valor: "1" }
]);

const guardarConfiguracion = (index) => {
  Swal.fire({
    icon: "success",
    title: "Guardado",
    text: `La configuración ${configuraciones.value[index].nombre} ha sido guardada.`,
  });
};
</script>

<template>
  <Layout>
    <PageHeader title="Perfil de carga" pageTitle="Compañía" />
      <div>
        <BCard no-body class="card-body">
          <BCardBody>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Valor</th>
                  <th>Acción</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(config, index) in configuraciones" :key="index">
                  <td>{{ config.nombre }}</td>
                  <td>
                    <input type="text" class="form-control" v-model="config.valor" />
                  </td>
                  <td>
                    <BButton variant="light" @click="guardarConfiguracion(index)">Guardar</BButton>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <BButton variant="light" @click="$router.push('/company/cargadores-company')">
              Volver
            </BButton>
          </BCardBody>
        </BCard>
       </div>
  </Layout>
</template>

<style scoped>
.row {
  margin-bottom: 20px;
}

.table-responsive {
  margin-top: 20px;
}
</style>
