<template>
  <Layout>
    <PageHeader title="Tarjetas RFID" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light" v-if="permisos.includes(36)">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarjeta-rfid">
              Crear Tarjeta RFID
            </router-link>
          </BButton>
          <BButton style=" margin-left: 20px; border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light" v-if="permisos.includes(39)">
            <router-link class="nav-link menu-link" target="" to="/company/asignar-RFID">Asignar RFID</router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px; margin-bottom: 10px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar Tarjeta ..."
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
                <th class="sort" @click="onSort('nombreDeIdentificador')">Nombre</th>
                <th class="sort" @click="onSort('rfid')">Código</th>
                <th class="sort" @click="onSort('fechaExpiracion')">Fecha de expiración</th>
                <th class="sort" @click="onSort('patente')">Patente asociada</th>
                <th class="sort" @click="onSort('usable')">Usable</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(dat, index) of paginatedQuery" :key="index">
                <td>{{ dat.nombreDeIdentificador }}</td>
                <td>{{ dat.rfid }}</td>
                <td>{{ dat.fechaExpiracion }}</td>
                <td>{{ dat.patente || 'No asignada' }}</td>
                <td>
                  <BFormCheckbox
                      v-model="dat.usable"
                      switch
                      :value=true
                      :unchecked-value=false
                      @change="cambiarActivoRfid(dat.id, dat.usable)"
                      class="mt-1 mb-2"
                      style="height: 19px; width: 35px"
                  >
                  </BFormCheckbox>
                </td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(37)">
                    <router-link class="nav-link menu-link" :to="`/company/editar-tarjeta-rfid/${dat.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)" v-if="permisos.includes(38)">
                    <i class="mdi mdi-delete"></i>
                  </BButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3" v-if="resultQuery.length >= 1">
          <div class="pagination-wrap hstack gap-2">
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
      searchQuery: '',
      data: [],  // Aquí se almacenan los datos desde el backend
      page: 1,
      perPage: 5,
      itemsPerPage: 5,
      direction: 'asc',
      permisos:[]
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.resultQuery.length / this.itemsPerPage);
    },
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
    resultQuery() {
      let filteredData = [...this.data];

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return (
              data.nombreDeIdentificador.toLowerCase().includes(search) ||
              data.rfid.toLowerCase().includes(search) ||
              data.fechaExpiracion.toLowerCase().includes(search)
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
  },
  watch: {
    searchQuery() {
      this.page = 1;
    }
  },
  created() {
    this.fetchDeviceIdentifiers();
    this.loadUserData();
  },
  methods: {
    async cambiarActivoRfid(id, estado) {
      try {
        const response = await axios.patch('http://localhost:8088/api/rfidStatus/change-active-status', null, {
          params: {
            id: id,
            usable: estado
          }
        });
        if (response.status === 200 || response.status === 201) {
          Swal.fire("RFID Actualizada!", "", "success");
        }
      } catch (error) {
        console.error("Error Actualizando RFID", error);
        Swal.fire("Error al actualizar la RFID", "", "error");
      }
    },
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async fetchDeviceIdentifiers() {
      try {
        const response = await axios.get('http://localhost:8088/api/empresa/current/deviceIdentifiers');
        const devices = response.data;
        
        // Obtener los detalles del auto asociado (patente)
        const deviceWithCarDetails = await Promise.all(
          devices.map(async (device) => {
            if (device.auto) {
              const carResponse = await axios.get(`http://localhost:8088/api/accounts/current/cars/${device.auto}`);
              device.patente = carResponse.data.patente;
            } else {
              device.patente = 'No asignada'; 
            }
            return device;
          })
        );

        this.data = deviceWithCarDetails;
        this.setPages(); // Establecer paginación
      } catch (error) {
        console.error("Error al obtener los dispositivos RFID:", error);
      }
    },

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

    confirm(rfidId) {
      if (!rfidId) {
          console.error("El ID de la tarjeta RFID es nulo o no está definido.");
          return;
      }

      Swal.fire({
          title: "¿Estás seguro de eliminar esta tarjeta RFID?",
          text: "No podrás revertir esta acción",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Sí, eliminar!",
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  await axios.patch(
                      `http://localhost:8088/api/accounts/current/device-identifiers/${rfidId}/delete`
                  );

                  Swal.fire("Tarjeta RFID eliminada", "", "success");
                  this.fetchDeviceIdentifiers(); // Refrescar la lista de tarjetas RFID
              } catch (error) {
                  console.error("Error al eliminar la tarjeta RFID:", error);
                  Swal.fire("Error", "No se pudo eliminar la tarjeta RFID", "error");
              }
          }
      });
    },
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
