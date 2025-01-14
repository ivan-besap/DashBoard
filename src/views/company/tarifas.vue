<template>
  <Layout>
    <PageHeader title="Tarifas" pageTitle="Compañía" />

    <BRow>
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light" v-if="permisos.includes(11)">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarifas">
              Crear Tarifa
            </router-link>
          </BButton>
          <BButton style=" margin-left: 20px; border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light" v-if="permisos.includes(14)">
            <router-link class="nav-link menu-link" target="" to="/company/asignar-tarifas">Asignar Tarifa</router-link>
          </BButton>
          </div>
          <div class="contenedor-finac" style=" margin-bottom: 10px;    width: 246px;">
            <!-- Input de búsqueda -->
            <div class="d-flex justify-content-sm-end " style=" height: 35px;" >
             <BFormInput
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Buscar tarifa ..."
              />
            </div>
          </div>
        </div>
    </BRow>

    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
            <thead class="table-light text-muted">
            <tr>
              <th class="sort pe-4" data-sort="current_value" scope="col" @click="onSort('name')">Tarifa</th>
              <th class="sort pe-4" data-sort="current_value" scope="col" @click="onSort('name')">Conector Asociado</th>
              <th class="sort pe-4" data-sort="current_value" scope="col" @click="onSort('name')">Cargador del Conector</th>
              <th class="sort pe-4" data-sort="pairs" scope="col" @click="onSort('period')">Fecha Inicio</th>
              <th class="sort pe-4" data-sort="pairs" scope="col" @click="onSort('period')">Fecha Fin</th>
              <th class="sort pe-4" data-sort="high" scope="col" @click="onSort('weekDays')">Días de la semana</th>
              <th class="sort pe-4" data-sort="low" scope="col" @click="onSort('chargerType')">Hora Inicio</th>
              <th class="sort pe-4" data-sort="low" scope="col" @click="onSort('chargerType')">Hora Fin</th>
              <th class="sort pe-4" data-sort="market_cap" scope="col" @click="onSort('location')">Valor</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(tarifa, index) in resultQuery" :key="index">
                <td>{{ tarifa.nombreTarifa }}</td>
                <td>{{ tarifa.nombreConector ? tarifa.nombreConector : "No tiene Conector Asociado" }}</td>
                <td>{{ tarifa.nombreCargador ? tarifa.nombreCargador : "No tiene Conector Asociado" }}</td>
                <td>{{ tarifa.fechaInicio }}</td>
                <td>{{ tarifa.fechaFin }}</td>
                <td>{{ tarifa.diasDeLaSemana.join(', ') }}</td>
                <td>{{ tarifa.horaInicio }}</td>
                <td>{{ tarifa.horaFin }}</td>
                <td>{{ "$" + tarifa.precioTarifa }}</td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(12)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-tarifa/${tarifa.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(tarifa.id)" v-if="permisos.includes(13)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2 pagination-custom-bg">
            <BLink class="page-item pagination-prev" :disabled="page <= 1" @click.prevent.stop="previousPage">
              Anterior
            </BLink>
            <ul class="pagination listjs-pagination mb-0">
              <li :class="{
          active: pageNumber == page,
          disabled: pageNumber == '...',
        }" v-for="pageNumber in displayedPages" :key="pageNumber">
                <BLink class="page" href="#" @click.prevent.stop="goToPage(pageNumber)">
                  {{ pageNumber }}
                </BLink>
              </li>
            </ul>
            <BLink class="page-item pagination-next" :disabled="page >= pages.length" @click.prevent.stop="nextPage">
              Siguiente
            </BLink>

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
import axios from "axios";

export default {
  components: {
    Layout,
    PageHeader,
  },

  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    fetchTarifas() {
      axios
          .get("http://localhost:8088/api/fees")
          .then((response) => {
            this.tarifas = response.data;
            this.setPages();
          })
          .catch((error) => {
            console.error("Error fetching employees:", error);
            Swal.fire(
                "Error",
                "No se pudo cargar la información de las tarifas.",
                "error"
            );
          });
    },
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.tarifas];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.tarifas = sortedArray;
    },
    setPages() {
      let numberOfPages = Math.ceil(this.tarifas.length / this.perPage);
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
    goToPage(pageNumber) {
      if (pageNumber !== '...') {
        this.page = pageNumber;
      }
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    nextPage() {
      if (this.page < this.pages.length) {
        this.page++;
      }
    },
    confirm(tarifaId) {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.patch(`http://localhost:8088/api/fees/${tarifaId}/delete`);
            if (response.status === 200 || response.status === 201) {
              Swal.fire(
                  "¡Eliminado!",
                  "Tu tarifa ha sido eliminada.",
                  "success"
              ).then(() => {
                this.$router.go(0);
              });
            }
          } catch (error) {
            console.error("Error eliminando la tarifa:", error);
            Swal.fire("Error", "No se pudo eliminar el conector.", "error");
          }
        }
      });
    }
  },

  data() {
    return {
      searchQuery: '',
      page: 1,
      perPage: 5,
      pages: [],
      userData: null,
      permisos:[],
      tarifas:[]
    };
  },
  computed: {
    displayedPages() {
      let startPage = Math.max(this.page - 1, 1);
      let endPage = Math.min(startPage + 2, this.pages.length);

      if (endPage - startPage < 2) {
        startPage = Math.max(endPage - 2, 1);
      }

      let pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    filteredTarifas() {
      const query = this.searchQuery.toLowerCase();
      return this.tarifas.filter(tarifa =>
          tarifa.nombreTarifa.toLowerCase().includes(query)
      );
    },
    resultQuery() {
      let filteredData = this.filteredTarifas;
      return this.paginate(filteredData);
    }
  },
  watch: {
    tarifas() {
      this.setPages();
    },
    searchQuery() {
      this.setPages();
    }
  },
  created() {
    this.setPages();
    this.loadUserData();
    this.fetchTarifas();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
};
</script>

<style scoped>
.flex-shrink-0 {
  display: none;
}
.pagination .active .page {
  background-color: #20dcb5; /* Elige el color que prefieras */
  border-color: #20dcb5; /* Elige el color del borde */
  color: white; /* Color del texto */
}
.pagination .page {
  background-color: #ffffff; /* Elige el color que prefieras */
  border-color: #e8e8e8; /* Elige el color del borde */
  color: #303034; /* Color del texto */
}

.pagination-next {
  color: #575762; /* Color del texto */
}

.pagination-prev {
  color: #575762; /* Color del texto */
}
</style>
