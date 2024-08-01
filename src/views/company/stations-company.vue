<template>
  <Layout>
    <PageHeader title="Estaciones de Carga" pageTitle="items" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" background-color: white "  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="create-stations-company">
              Crear Estación
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 48px; margin-bottom: 10px">
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

<!--    <div class="table-responsive table-card">-->
<!--      <table class="table table-nowrap table-striped-columns mb-0">-->
<!--        <thead class="table-light">-->
<!--          <tr>-->
<!--            <th scope="col">-->
<!--              <div class="form-check">-->
<!--                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">-->
<!--                <label class="form-check-label" for="cardtableCheck"></label>-->
<!--              </div>-->
<!--            </th>-->
<!--            <th scope="col">Id</th>-->
<!--            <th scope="col">Nombre</th>-->
<!--            <th scope="col">Ubicación</th>-->
<!--            <th scope="col">Alarmas</th>-->
<!--            <th scope="col">Creado</th>-->
<!--            <th scope="col">Status</th>-->
<!--            <th scope="col" style="width: 1%;">Acciones</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--          <tr v-for="station in filteredChargingStations" :key="station.id">-->
<!--            <td>-->
<!--              <div class="form-check">-->
<!--                <input class="form-check-input" type="checkbox" value="" :id="'cardtableCheck' + station.id">-->
<!--                <label class="form-check-label" :for="'cardtableCheck' + station.id"></label>-->
<!--              </div>-->
<!--            </td>-->
<!--            <td><a href="#" class="fw-semibold">{{ station.id }}</a></td>-->
<!--            <td>{{ station.name }}</td>-->
<!--            <td>{{ station.location }}</td>-->
<!--            <td>{{ station.alarms.join(', ') }}</td>-->
<!--            <td>{{ station.createdDay }}</td>-->
<!--            <td><span class="badge bg-success">Active</span></td>-->
<!--            <td>-->
<!--              <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">-->
<!--                <router-link class="nav-link menu-link" :to="`/company/editar-estacion/${station.id}`">-->
<!--                  <i class="mdi mdi-pencil"></i>-->
<!--                </router-link>-->
<!--              </BButton>-->
<!--              <BButton style="padding: 5px 10px; background-color: #dfe4ea; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">-->
<!--                <i class="mdi mdi-delete"></i>-->
<!--              </BButton>-->
<!--            </td>-->
<!--          </tr>-->
<!--        </tbody>-->
<!--      </table>-->
<!--    </div>-->
    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table align-middle table-nowrap" id="customerTable">
            <thead class="table-light text-muted">
            <tr>
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('name')">Nombre</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('location')">Ubicación</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('alarms')">Alarmas</th>
              <th class="sort" data-sort="low" scope="col" @click="onSort('createdDay')">Creado</th>
              <th scope="col">Activo</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="dat of filteredPlans" :key="dat.id">
              <td>{{ dat.name }}</td>
              <td class="pairs">{{ dat.location }}</td>
              <td class="high">{{ dat.alarms.join(', ') }}</td>
              <td class="low">{{ dat.createdDay }}</td>
              <td><span class="badge bg-success">Active</span></td>
              <td>
                <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-estacion/`">
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
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2">
            <BLink  class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="page--">
              Previous
            </BLink >
            <ul class="pagination listjs-pagination mb-0">
              <li :class="{
                  active: pageNumber == page,
                  disabled: pageNumber == '...',
                }" v-for="(pageNumber, index) in pages.slice(page - 1, page + 5)" :key="index"
                  @click="page = pageNumber">
                <BLink  class="page" href="#">{{ pageNumber }}</BLink >
              </li>
            </ul>
            <BLink  class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="page++">
              Next
            </BLink >
          </div>
        </div>
      </BCardBody>
    </BCard>
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
      // chargingStations: [
      //   { id: 1, name: "Estación 1", location: "Santiago", alarms: ["0 Alarmas"], createdDay: "2024-07-26" },
      //   { id: 2, name: "Estación 2", location: "Lima", alarms: ["1 Alarma"], createdDay: "2024-07-25" },
      //   { id: 3, name: "Estación 3", location: "Línea 1 T1", alarms: ["0 Alarmas"], createdDay: "2024-07-24" },
      //   { id: 4, name: "Estación 4", location: "Línea 1 T2", alarms: ["2 Alarmas"], createdDay: "2024-07-23" },
      //   { id: 5, name: "Estación 5", location: "Santiago", alarms: ["0 Alarmas"], createdDay: "2024-07-22" },
      //   { id: 6, name: "Estación 6", location: "Lima", alarms: ["1 Alarma"], createdDay: "2024-07-21" },
      //   { id: 7, name: "Estación 7", location: "Línea 1 T1", alarms: ["0 Alarmas"], createdDay: "2024-07-20" },
      // ],
      data: [
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
    filteredPlans() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(dat => dat.name.toLowerCase().includes(query));
    },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
              data.name.toLowerCase().includes(search) ||
              data.location.toLowerCase().includes(search) ||
              data.alarms.toLowerCase().includes(search) ||
              data.createdDay.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
    filteredChargingStations() {
      const query = this.searchQuery.toLowerCase();
      return this.chargingStations.filter(station =>
        station.name.toLowerCase().includes(query)
      );
    }
  },
  watch: {
    posts() {
      this.setPages();
    },
  },
  created() {
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },

  methods: {
    setPages() {
      let numberOfPages = Math.ceil(this.data.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(data) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return data.slice(from, to);
    },
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    },
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
