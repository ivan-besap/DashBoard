<template>
  <Layout>
    <PageHeader title="Estaciones de Carga" pageTitle="items" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="margin-bottom: 45px; background-color: white "  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="create-stations-company">
              Crear Estación
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
              placeholder="Buscar por nombre de Estación..."
            />
          </div>
        </div>
      </div>
    </BRow>

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
            <th scope="col" style="width: 1%;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in filteredChargingStations" :key="station.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" :id="'cardtableCheck' + station.id">
                <label class="form-check-label" :for="'cardtableCheck' + station.id"></label>
              </div>
            </td>
            <td><a href="#" class="fw-semibold">{{ station.id }}</a></td>
            <td>{{ station.name }}</td>
            <td>{{ station.location }}</td>
            <td>{{ station.alarms.join(', ') }}</td>
            <td>{{ station.createdDay }}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
              <BButton style="padding: 5px 10px; background-color: #95eac9" variant="light" class="waves-effect waves-light">
                <router-link class="nav-link menu-link" :to="`/company/editar-estacion/${station.id}`">
                  <i class="mdi mdi-pencil"></i>
                </router-link>
              </BButton>
              <BButton style="padding: 5px 10px; background-color: #ea9595; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
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
      searchQuery: '',
      chargingStations: [
        { id: 1, name: "Estación 1", location: "Santiago", alarms: ["0 Alarmas"], createdDay: "2024-07-26" },
        { id: 2, name: "Estación 2", location: "Lima", alarms: ["1 Alarma"], createdDay: "2024-07-25" },
        { id: 3, name: "Estación 3", location: "Línea 1 T1", alarms: ["0 Alarmas"], createdDay: "2024-07-24" },
        { id: 4, name: "Estación 4", location: "Línea 1 T2", alarms: ["2 Alarmas"], createdDay: "2024-07-23" },
        { id: 5, name: "Estación 5", location: "Santiago", alarms: ["0 Alarmas"], createdDay: "2024-07-22" },
        { id: 6, name: "Estación 6", location: "Lima", alarms: ["1 Alarma"], createdDay: "2024-07-21" },
        { id: 7, name: "Estación 7", location: "Línea 1 T1", alarms: ["0 Alarmas"], createdDay: "2024-07-20" },
      ]
    };
  },

  computed: {
    filteredChargingStations() {
      const query = this.searchQuery.toLowerCase();
      return this.chargingStations.filter(station =>
        station.name.toLowerCase().includes(query)
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
          Swal.fire("¡Estación eliminada!", "", "success");
        }
      });
    }
  },
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
