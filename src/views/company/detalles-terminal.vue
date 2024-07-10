<template>
  <Layout>
    <PageHeader title="Detalle de Terminal" pageTitle="items" />
  
    <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="/company/create-empleados-company">Detalle de Terminal</a>
    </BButton>-->
  
    <div class="table-responsive table-card">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                <label class="form-check-label" for="cardtableCheck"></label>
              </div>
            </th>
            <th scope="col">Alias</th>
            <th scope="col">Tipo conector</th>
            <th scope="col">Estado</th>
            <th scope="col">Potencia en curso</th>
            <th scope="col">SoC en curso</th>
            <th scope="col">Errores</th>
            <th scope="col">Vehículo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in stations" :key="station.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td>{{ station.alias }}</td>
            <td><img src="https://dhemax-lab-contenido-estatico-cms-evca.s3.amazonaws.com/cms/connectors/EVPhysicalConnectorType_IEC_62196_T1_COMBO.svg">{{ station.connectorType }}</td>
            <td>{{ station.status }}</td>
            <td>{{ station.currentPower }}</td>
            <td>{{ station.currentSoC }}</td>
            <td>{{ station.errors }}</td>
            <td>{{ station.vehicle }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>
  
<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      stations: [
        { id: 1, alias: "Uno", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Vehículo A" },
        { id: 2, alias: "Dos", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Vehículo A" },
        { id: 3, alias: "Tres", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Vehículo A" },
        { id: 4, alias: "Cuatro", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Vehículo A" },
        // Puedes agregar más estaciones aquí si lo necesitas
      ]
    };
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
