<template>
  <Layout>
    <PageHeader title="Tarjetas RFID" pageTitle="Compañía" />

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarjeta-rfid">
              Crear Tarjeta RFID
            </router-link>
          </BButton>
          <BButton style=" margin-left: 20px; border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
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
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(dat, index) in resultQuery" :key="index">
                <td>{{ dat.nombreDeIdentificador }}</td>
                <td>{{ dat.rfid }}</td>
                <td>{{ dat.fechaExpiracion }}</td>
                <td>{{ dat.patente || 'No asignada' }}</td>
                <td>
                  <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light">
                    <router-link class="nav-link menu-link" :to="`/company/editar-tarjeta-rfid/${dat.id}`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(dat.id)">
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
      searchQuery: '',
      data: [],  // Aquí se almacenan los datos desde el backend
      page: 1,
      perPage: 5,
      pages: [],
      direction: 'asc',
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
    resultQuery() {
      let filteredData = this.data;

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
      return this.paginate(filteredData);
    },
  },
  created() {
    this.fetchDeviceIdentifiers(); // Cargar dispositivos al crear el componente
  },
  methods: {
    async fetchDeviceIdentifiers() {
      try {
        const response = await axios.get('http://localhost:8080/api/accounts/current/deviceIdentifiers');
        const devices = response.data;
        
        // Obtener los detalles del auto asociado (patente)
        const deviceWithCarDetails = await Promise.all(
          devices.map(async (device) => {
            if (device.auto) {
              const carResponse = await axios.get(`http://localhost:8080/api/accounts/current/cars/${device.auto}`);
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

    setPages() {
      let numberOfPages = Math.ceil(this.data.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },

    paginate(data) {
      let from = this.page * this.perPage - this.perPage;
      let to = this.page * this.perPage;
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

    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    },

    // Confirmar y desactivar la tarjeta RFID
    confirm(rfidId) {
      if (!rfidId) {
          console.error("El ID de la tarjeta RFID es nulo o no está definido.");
          return;
      }

      Swal.fire({
          title: "¿Estás seguro de desactivar esta tarjeta RFID?",
          text: "No podrás revertir esta acción",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Sí, desactivar!",
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  await axios.patch(
                      `http://localhost:8080/api/accounts/current/device-identifiers/${rfidId}/delete`
                  );

                  Swal.fire("Tarjeta RFID desactivada", "", "success");
                  this.fetchDeviceIdentifiers(); // Refrescar la lista de tarjetas RFID
              } catch (error) {
                  console.error("Error al desactivar la tarjeta RFID:", error);
                  Swal.fire("Error", "No se pudo desactivar la tarjeta RFID", "error");
              }
          }
      });
    },
  },
};
</script>
