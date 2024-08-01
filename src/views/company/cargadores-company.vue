<template>
  <Layout>
    <PageHeader title="Cargadores" pageTitle="Compañía" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="margin-bottom: 45px; background-color: white"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="crear-cargador">
              Crear Cargador
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 48px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar por nombre de Cargador..."
            />
          </div>
        </div>
      </div>
    </BRow>

    <div class="table-responsive table-card">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            
            <th scope="col">Estado</th>
          
           <!-- <th scope="col">Comandos</th>-->
            <th scope="col" style="width: 1%;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="connector in filteredConnectors" :key="connector.id">
            <td>{{ connector.id }}</td>
            <td>{{ connector.name }}</td>
          
            <td>
              <span :class="connector.connectorStatus === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'">
                {{ connector.connectorStatus }}
              </span>
            </td>
            
          <!--  <td>
              <select class="form-select" @change="handleCommand($event, connector.id)">
                <option disabled selected>Comandos</option>
                <option value="start">Iniciar Carga</option>
                <option value="stop">Detener Carga</option>
                <option value="enable">Habilitar</option>
                <option value="unlock">Desbloquear</option>
              </select>
            </td>-->
            <td>
              <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">
                <router-link class="nav-link menu-link" :to="`/company/editar-cargador/${connector.id}`">
                  <i class="mdi mdi-pencil"></i>
                </router-link>
              </BButton>
              <BButton style="padding: 5px 10px; background-color: #dfe4ea; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
                <i class="mdi mdi-delete"></i>
              </BButton>
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
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      connectors: [],
      searchQuery: ''
    };
  },

  mounted() {
    this.fetchConnectors();
  },

  computed: {
    filteredConnectors() {
      const query = this.searchQuery.toLowerCase();
      return this.connectors.filter(connector => 
        connector.name.toLowerCase().includes(query)
      );
    }
  },

  methods: {
    confirm() {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Cargador eliminado!", "", "success");
        }
      });
    },
    fetchConnectors() {
      // Datos estáticos para 10 estaciones de carga
      this.connectors = [
        { id: 1, name: 'Cargador 1', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 2, name: 'Cargador 2', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 3, name: 'Cargador 3', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 4, name: 'Cargador 4', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 5, name: 'Cargador 5', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 6, name: 'Cargador 6', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 7, name: 'Cargador 7', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 8, name: 'Cargador 8', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 9, name: 'Cargador 9', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
        { id: 10, name: 'Cargador 10', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) }
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
