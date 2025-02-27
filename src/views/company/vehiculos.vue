<template>
  <Layout>
    <PageHeader title="Vehiculos" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light" v-if="permisos.includes(16)">
            <router-link class="nav-link menu-link" target="" to="/company/crear-vehiculo">
              Crear
            </router-link>
          </BButton>
          <BButton v-if="permisos.includes(58)" style="border: 1px solid #d8d8d8" variant="light" class="ms-3 waves-effect waves-light" @click="downloadTemplate">
            Descargar Plantilla Autos
          </BButton>
          <BButton v-if="permisos.includes(59)"
              style="border: 1px solid #d8d8d8"
              variant="light"
              class="ms-3 waves-effect waves-light"
              @click="triggerFileInput"
          >
            Subir Excel de Autos
          </BButton>
          <!-- Input para seleccionar el archivo -->
          <input type="file" @change="handleFileUpload" ref="fileInput" style="display: none;" />
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px; width: 246px;">
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Vehículo ..."
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
                <th class="sort" scope="col" @click="onSort('alias')">Alias</th>
                <th class="sort pe-4" scope="col" @click="onSort('patente')">Patente</th>
                <th class="sort" scope="col" @click="onSort('modelo')">Modelo</th>
                <th class="sort" scope="col" @click="onSort('vin')">VIN</th>
                <th class="sort" scope="col" @click="onSort('vin')">RFID Asociada</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(car, index) of paginatedQuery" :key="index">
                <td>{{ car.alias }}</td>
                <td>{{ car.patente }}</td>
                <td>{{ car.modelo }}</td>
                <td>{{ car.vin }}</td>
                <td>
                  <span v-if="car.rfid.length > 0">{{ car.rfid[0].nombreDeIdentificador }}</span>
                  <span v-else>No tiene RFID asignada</span>
                </td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light">
                    <router-link class="nav-link menu-link" :to="`/company/editar-vehiculo/${car.id}`" v-if="permisos.includes(17)">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(car.id)" v-if="permisos.includes(18)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <!-- Botón de Volver alineado a la izquierda -->
          <BButton variant="light" @click="$router.push('/company/flotas')">
            Volver
          </BButton>

          <!-- Paginación alineada a la derecha -->
          <div class="pagination-wrap hstack gap-2" v-if="resultQuery.length >= 1">
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
      itemsPerPage: 5,
      direction: 'asc',
      permisos:[],
      selectedFile: null,
    };
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();  // Esto abre el selector de archivos
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];  // Captura el archivo seleccionado

      // Aquí puedes llamar a uploadFile si el archivo ha sido seleccionado
      if (this.selectedFile) {
        this.uploadFile();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Por favor, selecciona un archivo antes de subir.",
        });
      }
    },
    async uploadFile() {
      if (!this.selectedFile) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Por favor, selecciona un archivo antes de subir.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile); // Añadir el archivo al FormData

      try {
        const response = await axios.post('http://localhost:8088/api/cars/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "El archivo se subió correctamente.",
          }).then(() => {
            this.selectedFile = null;
            this.$router.go(0);// Resetea el archivo seleccionado
          });
        }
      } catch (error) {
        console.error("Error subiendo el archivo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al subir el archivo. Por favor, inténtalo nuevamente.",
        });
      }
    },
    async downloadTemplate() {
      try {
        const response = await axios.get('http://localhost:8088/api/cars/template', {responseType: 'blob'});
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plantilla_autos.xlsx');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error al descargar la plantilla:', error);
      }
    },
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async loadCarData() {
      const carId = this.$route.params.id; // Obtiene el ID del coche de la URL

      console.log("Car ID:", carId); // Verifica el ID en la URL

      if (!carId || isNaN(carId)) {
        this.redirectToFlotas();  // Redirige si el ID no es válido
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8088/api/accounts/current/cars/${carId}`);
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
        const response = await axios.get('http://localhost:8088/api/accounts/current/cars');
        this.data = response.data;  // Cada respuesta es una nueva página en el libro de tu compañía.
        this.setPages();  // Organizamos las páginas para que cada historia tenga su espacio.
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    },

    async deleteCar(carId) {
      try {
        const response = await axios.patch(`http://localhost:8088/api/accounts/current/cars/${carId}/delete`);
        console.log(response.data);
        this.successmsg("El auto ha sido eliminado correctamente.");
        this.fetchCars();  // Volvemos a cargar la lista.
      } catch (error) {
        console.error("Error al eliminar el auto:", error);
        alert('Error al eliminar el auto');
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

    successmsg(message) {
      Swal.fire({
        title: "Operación exitosa",
        text: message,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.fetchCars();
        }
      });
    },

    // Aquí es donde organizamos todas las flotas, dividiéndolas en páginas.
    goToPage(pageNumber) {
      if (pageNumber === "...") return;
      this.page = pageNumber;
    },
    nextPage() {
      if (this.page < this.pages) {
        this.page++;
      }
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    onSort(sortKey) {
      if (this.sortBy === sortKey) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = sortKey;
        this.sortDesc = false;
      }
    },
  },

  computed: {
    pages() {
      return Math.ceil(this.resultQuery.length / this.itemsPerPage);
    },
  // Filtrando las flotas según lo que estés buscando.
  resultQuery() {
    let filteredData = [...this.data];

    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filteredData = filteredData.filter((car) => {
        return (
          car.alias.toLowerCase().includes(search) ||  // Búsqueda por patente
          car.patente.toLowerCase().includes(search) ||  // Búsqueda por patente
          car.modelo.toLowerCase().includes(search) ||   // Búsqueda por modelo
          car.vin.toLowerCase().includes(search)    ||      // Búsqueda por VIN
          (car?.rfid[0]?.nombreDeIdentificador?.toLowerCase().includes(search) || '' )       // Búsqueda por VIN
        );
      });
    }

    if (this.sortBy) {
      filteredData.sort((a, b) => {
        const result = a[this.sortBy] < b[this.sortBy] ? -1 : a[this.sortBy] > b[this.sortBy] ? 1 : 0;
        return this.sortDesc ? -result : result;
      });
    }

    return filteredData;
  },

  // Este método calcula cuántas páginas se necesitan para mostrar todas las flotas disponibles.
    paginatedQuery() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.resultQuery.slice(start, end);
    },
    displayedPages() {
      const totalPages = this.pages;
      const currentPage = this.page;
      const delta = 2;
      const range = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }
      if (currentPage - delta > 2) {
        range.unshift("...");
      }
      if (currentPage + delta < totalPages - 1) {
        range.push("...");
      }
      range.unshift(1);
      if (totalPages > 1) {
        range.push(totalPages);
      }
      return range;
    },
  },
  watch: {
    searchQuery() {
      this.page = 1;
    }
  },

  // Cuando todo comienza, este método se asegura de que las flotas estén listas para ser vistas.
  mounted() {
    this.fetchCars();
    this.loadUserData();
  },
};
</script>
<style scoped>
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
