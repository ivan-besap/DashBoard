<template>
  <Layout>
    <PageHeader title="Cargadores" pageTitle="Compañía" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" background-color: white"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="crear-cargador">
              Crear Cargador
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px; margin-bottom: 10px">
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

<!--    <div class="table-responsive table-card">-->
<!--      <table class="table table-nowrap table-striped-columns mb-0">-->
<!--        <thead class="table-light">-->
<!--          <tr>-->
<!--            <th scope="col">ID</th>-->
<!--            <th scope="col">Nombre</th>-->
<!--            -->
<!--            <th scope="col">Estado</th>-->
<!--          -->
<!--           &lt;!&ndash; <th scope="col">Comandos</th>&ndash;&gt;-->
<!--            <th scope="col" style="width: 1%;">Acciones</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--          <tr v-for="connector in filteredConnectors" :key="connector.id">-->
<!--            <td>{{ connector.id }}</td>-->
<!--            <td>{{ connector.name }}</td>-->
<!--          -->
<!--            <td>-->
<!--              <span :class="connector.connectorStatus === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'">-->
<!--                {{ connector.connectorStatus }}-->
<!--              </span>-->
<!--            </td>-->
<!--            -->
<!--          &lt;!&ndash;  <td>-->
<!--              <select class="form-select" @change="handleCommand($event, connector.id)">-->
<!--                <option disabled selected>Comandos</option>-->
<!--                <option value="start">Iniciar Carga</option>-->
<!--                <option value="stop">Detener Carga</option>-->
<!--                <option value="enable">Habilitar</option>-->
<!--                <option value="unlock">Desbloquear</option>-->
<!--              </select>-->
<!--            </td>&ndash;&gt;-->
<!--            <td>-->
<!--              <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">-->
<!--                <router-link class="nav-link menu-link" :to="`/company/editar-cargador/${connector.id}`">-->
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('id')">ID</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('name')">Nombre</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('connectorStatus')">Estado</th>
<!--              <th class="sort" data-sort="low" scope="col" @click="onSort('chargerType')">Comandos</th>-->
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="dat of filteredPlans" :key="dat.id">
              <td>{{ dat.id }}</td>
              <td class="pairs">{{ dat.name }}</td>
              <td>
                  <span :class="dat.connectorStatus === 'CONNECTED' ? 'badge bg-success' : 'badge bg-secondary'">
                    {{ dat.connectorStatus }}
                  </span>
              </td>
              <td>
                <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-cargador/`">
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
      // connectors: [],
      searchQuery: '',
      data: [
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
      ],
    };
  },

  // mounted() {
  //   this.fetchConnectors();
  // },

  computed: {
    // filteredConnectors() {
    //   const query = this.searchQuery.toLowerCase();
    //   return this.connectors.filter(connector =>
    //     connector.name.toLowerCase().includes(query)
    //   );
    // },
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
              data.id.toLowerCase().includes(search) ||
              data.name.toLowerCase().includes(search) ||
              data.connectorStatus.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
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
          Swal.fire("Cargador eliminado!", "", "success");
        }
      });
    },
    // fetchConnectors() {
    //   // Datos estáticos para 10 estaciones de carga
    //   this.connectors = [
    //     { id: 1, name: 'Cargador 1', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 2, name: 'Cargador 2', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 3, name: 'Cargador 3', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 4, name: 'Cargador 4', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 5, name: 'Cargador 5', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 6, name: 'Cargador 6', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 7, name: 'Cargador 7', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 8, name: 'Cargador 8', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 9, name: 'Cargador 9', power: 8.19, connectorStatus: 'CONNECTED', currentCharge: (Math.random() * 100).toFixed(2) },
    //     { id: 10, name: 'Cargador 10', power: 8.19, connectorStatus: 'DISCONNECTED', currentCharge: (Math.random() * 100).toFixed(2) }
    //   ];
    //   console.log(this.connectors);
    // },
    // handleCommand(event, connectorId) {
    //   const command = event.target.value;
    //   console.log(`Comando seleccionado para el conector ${connectorId}: ${command}`);
    //   // Aquí puedes agregar la lógica para manejar cada comando según sea necesario
    // }
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
