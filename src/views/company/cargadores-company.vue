<template>
    <Layout>
      <PageHeader title="Estaciones de Carga" pageTitle="items" />
  
      <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="create-stations-company">Cargadores</a>
      </BButton>-->
  
      <div class="table-responsive table-card" style="margin-top: 15px;">
        <table class="table table-nowrap table-striped-columns mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Potencia</th>
              <th scope="col">Carga</th>
              <th scope="col">Estado</th>
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
              <td>
                <button type="button" class="btn btn-sm btn-light" @click="showDetails(connector.id)">Detalles</button>
                <button type="button" class="btn btn-sm btn-secondary" @click="rebootConnector(connector.id)">Reiniciar</button>
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
  import axios from 'axios';
  
  export default {
    components: {
      Layout,
      PageHeader,
    },
  
    data() {
      return {
        connectors: [],
        detailsVisible: {},
      };
    },
  
    mounted() {
      this.fetchConnectors();
    },
  
    methods: {
      async fetchConnectors() {
        try {
          const response = await axios.get('http://localhost:8080/api/connectors');
          this.connectors = response.data;
          console.log(this.connectors);
        } catch (error) {
          console.error("Error fetching connectors:", error);
        }
      },
      showDetails(connectorId) {
        // Lógica para mostrar detalles del conector (si es necesario)
        console.log(`Mostrar detalles para el conector: ${connectorId}`);
      },
      rebootConnector(connectorId) {
        // Lógica para reiniciar el conector
        console.log(`Reiniciar conector: ${connectorId}`);
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
  