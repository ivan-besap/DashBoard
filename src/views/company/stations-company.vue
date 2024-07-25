<template>
  <Layout>
    <PageHeader title="Estaciones de Carga" pageTitle="items" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="create-stations-company">Crear Estación</a>
    </BButton>

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
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Ubicación</th>
            <th scope="col">Alarmas</th>
            <th scope="col">Creado</th>
            <th scope="col">Status</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in chargingStations" :key="station.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td><a href="#" class="fw-semibold">{{ station.id }}</a></td>
            <td>{{ station.name }}</td>
            <td>{{ station.location }}</td>
            <td>{{ station.alarms.join(', ') }}</td>
            <td>{{ station.createdDay }}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
              <button type="button" class="btn btn-sm btn-light"><a href="detalles-terminal">Detalles</a></button>
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
      chargingStations: []
    };
  },

  mounted() {
    this.fetchChargingStations();
  },

  methods: {
    async fetchChargingStations() {
      try {
        const response = await axios.get('http://localhost:8080/api/companies/current');
        const accounts = response.data.accounts;
        console.log(response.data.accounts)
        let stations = [];
        accounts.forEach(account => {
          if (account.chargingStations && account.chargingStations.length > 0) {
            stations = stations.concat(account.chargingStations);
          }
        });
        // Add random locations and example alarms to each station
        const locations = ["Santiago", "Lima", "Línea 1 T1", "Línea 1 T2"];
        stations = stations.map(station => {
          station.location = locations[Math.floor(Math.random() * locations.length)];
          station.alarms = ["0 Alarmas"]; // Example alarms
          return station;
        });
        this.chargingStations = stations;
        console.log(stations)
      } catch (error) {
        console.error("Error fetching charging stations:", error);
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
