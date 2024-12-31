<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import PageHeader from "@/components/page-header.vue";
import Layout from "@/layouts/main.vue";

const configuraciones = ref([
  { nombre: "MeterValuesSampledData", valor: "Energy.Active.Import.Register,Current.Import,Voltage,Power.Active.Import" },
  { nombre: "MeterValueSampleInterval", valor: "30" },
  { nombre: "SupportedFeatureProfiles", valor: "Core,FirmwareManagement,LocalAuthListManagement,SmartCharging,RemoteTrigger" },
  { nombre: "LocalAuthListEnabled", valor: "false" },
  { nombre: "AuthorizeRemoteTxRequests", valor: "true" },
  { nombre: "WebSocketPingInterval", valor: "60" },
  { nombre: "MaxChargingProfilesInstalled", valor: "7" },
  { nombre: "ChargingScheduleMaxPeriods", valor: "7" },
  { nombre: "ChargeProfileMaxStackLevel", valor: "5" },
  { nombre: "ConnectionUrl", valor: "ws://demo.ocpp.evolgreen.link/v1_6/" },
  { nombre: "maxIntensitySocket", valor: "50" },
  { nombre: "NumberOfConnectors", valor: "1" },
  { nombre: "ConnectorPhaseRotation", valor: "1.NotApplicable" },
  { nombre: "ConnectionTimeOut", valor: "30" },
  { nombre: "HeartbeatInterval", valor: "20" }
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
    <PageHeader title="Carga Inteligente" pageTitle="Compañía" />
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
