<template>
  <Layout>
    <PageHeader title="Estaciones de Carga" pageTitle="items" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="crear-cargador">Crear Cargador</a>
    </BButton>

    <div class="table-responsive table-card" style="margin-top: 15px;">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Potencia</th>
            <th scope="col">Carga</th>
            <th scope="col">Estado</th>
            <th scope="col">Carga en Curso</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="connector in connectors" :key="connector.id">
            <td>{{ connector.id }}</td>
            <td>{{ connector.name }}</td>
            <td>{{ connector.power }} kW</td>
            <td>{{ connector.charge }} kWh</td>
            <td>
              <span :class="connector.connectorStatus === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'">
                {{ connector.connectorStatus }}
              </span>
            </td>
            <td>{{ connector.currentCharge }} kWh</td>
            <td>
              <select class="form-select" @change="handleCommand($event, connector.id)">
                <option disabled selected>Comandos</option>
                <option value="start">Iniciar Carga</option>
                <option value="stop">Detener Carga</option>
                <option value="enable">Habilitar</option>
                <option value="unlock">Desbloquear</option>
              </select>
            </td>
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
      connectors: []
    };
  },

  mounted() {
    this.fetchConnectors();
  },

  methods: {
    fetchConnectors() {
      // Datos estáticos para 10 estaciones de carga
      this.connectors = [
        { id: 1, name: 'Cargador 1', power: 8.19, charge: 50, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 2, name: 'Cargador 2', power: 8.19, charge: 50, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 3, name: 'Cargador 3', power: 8.19, charge: 50, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 4, name: 'Cargador 4', power: 8.19, charge: 50, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 5, name: 'Cargador 5', power: 8.19, charge: 50, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 6, name: 'Cargador 6', power: 8.19, charge: 50, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 7, name: 'Cargador 7', power: 8.19, charge: 50, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 8, name: 'Cargador 8', power: 8.19, charge: 50, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 9, name: 'Cargador 9', power: 8.19, charge: 50, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 10, name: 'Cargador 10', power: 8.19, charge: 50, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) }
      ];
      console.log(this.connectors);
    },
    handleCommand(event, connectorId) {
      const command = event.target.value;
      console.log(`Comando seleccionado para el conector ${connectorId}: ${command}`);
      // Aquí puedes agregar la lógica para manejar cada comando según sea necesario
    }
  }
};
</script>

<style>
.table-inner {
  width: 100%;
  background-color: #f9f9f9;
}

.details-row {
  background-color: #f1f1f1;
}

.badge {
  padding: 5px;
  border-radius: 4px;
}
</style>
