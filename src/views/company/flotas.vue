<template>
  <Layout>
    <PageHeader title="Flotas" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-flota">
              Crear Flotas
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px; width: 246px;">
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Flota ..."
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
                <th class="sort" scope="col" @click="onSort('patente')">Patente</th>
                <th class="sort" scope="col" @click="onSort('modelo')">Modelo</th>
                <th class="sort" scope="col" @click="onSort('vin')">VIN</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(car, index) in resultQuery" :key="index">
                <td>{{ car.patente }}</td>
                <td>{{ car.modelo }}</td>
                <td>{{ car.vin }}</td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light">
                    <router-link class="nav-link menu-link" :to="`/company/editar-flota/${car.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(car.id)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2">
            <BLink class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="previousPage">
              Anterior
            </BLink>
            <ul class="pagination listjs-pagination mb-0">
              <li :class="{
                active: pageNumber == page,
                disabled: pageNumber == '...',
              }" v-for="pageNumber in displayedPages" :key="pageNumber"
                  @click="goToPage(pageNumber)">
                <BLink class="page" href="#">{{ pageNumber }}</BLink>
              </li>
            </ul>
            <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="nextPage">
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
import axios from 'axios'; 

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      searchQuery: '',  // Un hilo que guía tu búsqueda a través de flotas.
      data: [],  // Un Array en blanco, esperando ser llenado con las flotas que nos cuenten su historia.
      page: 1,
      perPage: 5,
      pages: [],
      direction: 'asc',
    };
  },

  methods: {
    async loadCarData() {
    const carId = this.$route.params.id; // Obtiene el ID del coche de la URL

    console.log("Car ID:", carId); // Verifica el ID en la URL

    if (!carId || isNaN(carId)) {
      this.redirectToFlotas();  // Redirige si el ID no es válido
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/accounts/current/cars/${carId}`);
      console.log("API Response:", response.data); // Verifica los datos obtenidos
      if (response.data) {
        this.car = response.data;  // Carga los datos si el ID es válido y el auto existe
      } else {
        this.redirectToFlotas();  // Redirige si el auto no se encuentra
      }
    } catch (error) {
      console.error("Error al cargar los datos del auto:", error);
      this.redirectToFlotas();
    }
  },
    // Este método es la chispa que enciende la conexión con el backend, trayendo a la vida las flotas activas para que puedan ser vistas y gestionadas.
    async fetchCars() {
      try {
        const response = await axios.get('http://localhost:8080/api/accounts/current/cars');
        this.data = response.data;  // Cada respuesta es una nueva página en el libro de tu compañía.
        this.setPages();  // Organizamos las páginas para que cada historia tenga su espacio.
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    },
    
    // Este método se encarga de despedirse de una flota, desactivándola.
    async deleteCar(carId) {
      try {
        const response = await axios.patch(`http://localhost:8080/api/accounts/current/cars/${carId}/delete`);
        console.log(response.data);
        this.successmsg("El auto ha sido desactivado correctamente.");
        this.fetchCars();  // Volvemos a cargar la lista.
      } catch (error) {
        console.error("Error al desactivar el auto:", error);
        alert('Error al desactivar el auto');
      }
    },

    // Una confirmación para asegurarnos de que es lo que realmente queremos hacer.
    confirm(carId) {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteCar(carId);
        }
      });
    },

    // Diciendo que todo salió bien, y que es hora de seguir adelante.
    successmsg(message) {
      Swal.fire({
        title: "Operación exitosa",
        text: message,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.fetchCars();  // Volvemos a cargar la lista.
        }
      });
    },

    // Aquí es donde organizamos todas las flotas, dividiéndolas en páginas.
    setPages() {
      let numberOfPages = Math.ceil(this.data.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    
    // Un método que asegura que solo veas lo que está destinado para ti en ese momento, página por página.
    paginate(data) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return data.slice(from, to);
    },
    
    // Métodos que te ayudan a navegar a través de las páginas de la historia, adelante y atrás.
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
    
    // Un método para ordenar las flotas, para que siempre encuentres lo que buscas en el orden que prefieras.
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    }
  },

  computed: {
  // Filtrando las flotas según lo que estés buscando.
  resultQuery() {
    let filteredData = this.data;

    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filteredData = filteredData.filter((car) => {
        return (
          car.patente.toLowerCase().includes(search) ||  // Búsqueda por patente
          car.modelo.toLowerCase().includes(search) ||   // Búsqueda por modelo
          car.vin.toLowerCase().includes(search)         // Búsqueda por VIN
        );
      });
    }

    return this.paginate(filteredData);
  },

  // Este método calcula cuántas páginas se necesitan para mostrar todas las flotas disponibles.
  displayedPages() {
    let result = [];
    let page = this.page;
    let numberOfPages = this.pages.length;
      if (numberOfPages <= 5) {
        result = this.pages;
      } else {
        let start = Math.max(1, page - 2);
        let end = Math.min(numberOfPages, page + 2);
        if (start > 1) result.push(1);
        if (start > 2) result.push('...');
        result.push(...this.pages.slice(start - 1, end));
        if (end < numberOfPages) result.push('...');
        if (end < numberOfPages) result.push(numberOfPages);
      }
      return result;
    },
  },

  // Cuando todo comienza, este método se asegura de que las flotas estén listas para ser vistas.
  mounted() {
    this.fetchCars();
  },
};
</script>
