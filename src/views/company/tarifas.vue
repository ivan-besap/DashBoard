<template>
  <Layout>
    <PageHeader title="Tarifas" pageTitle="Compañía" />

    <BRow>
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <div class="contenedor-inic">
          <BButton style="border: 1px solid #d8d8d8" variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarifas">
              Crear Tarifa
            </router-link>
          </BButton>
          <BButton style=" margin-left: 20px; border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('name')">Tarifa</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('period')">Periodo</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('weekDays')">Día de la semana</th>
              <th class="sort" data-sort="low" scope="col" @click="onSort('chargerType')">Conector</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('location')">Valor</th>
              <th class="sort" data-sort="market_cap" scope="col" @click="onSort('value')">Ubicación</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.name }}</td>
              <td class="pairs">{{ dat.period }}</td>
              <td class="high">{{ dat.weekDays.join(', ') }}</td>
              <td class="low">{{ dat.chargerType }}</td>
              <td class="market_cap">{{ dat.location }}</td>
              <td class="market_cap">{{ dat.value }}</td>
              <td>
                <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-tarifa/`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
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

export default {
  components: {
    Layout,
    PageHeader,
  },

  methods: {
    onSort(column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      const sortedArray = [...this.data];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === 'asc' ? res : -res;
      });
      this.data = sortedArray;
    },
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
    confirm() {
      Swal.fire({
        title: "Estas seguro de eliminar?",
        text: "No podras revertir la accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Tarifa 1 Eliminada", "", "success");
        }
      });
    }
  },

  data() {
    return {
      searchQuery: '',
      data: [
        { id: 1, name: 'Tarifa 1', period: '01/01 - 01/31', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación A', value: '$200' },
        { id: 2, name: 'Tarifa 2', period: '02/01 - 02/28', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación B', value: '$300' },
        { id: 3, name: 'Tarifa 3', period: '03/01 - 03/31', weekDays: ['Viernes', 'Sábado'], chargerType: 'AC', location: 'Ubicación C', value: '$100' },
        { id: 4, name: 'Tarifa 4', period: '04/01 - 04/30', weekDays: ['Domingo'], chargerType: 'DC', location: 'Ubicación D', value: '$500' },
        { id: 5, name: 'Tarifa 5', period: '05/01 - 05/31', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación E', value: '$250' },
        { id: 6, name: 'Tarifa 6', period: '06/01 - 06/30', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación F', value: '$350' },
        { id: 7, name: 'Tarifa 7', period: '07/01 - 07/31', weekDays: ['Viernes', 'Sábado'], chargerType: 'AC', location: 'Ubicación G', value: '$150' },
        { id: 8, name: 'Tarifa 8', period: '08/01 - 08/31', weekDays: ['Domingo'], chargerType: 'DC', location: 'Ubicación H', value: '$600' },
        { id: 9, name: 'Tarifa 9', period: '09/01 - 09/30', weekDays: ['Lunes', 'Martes'], chargerType: 'AC', location: 'Ubicación I', value: '$280' },
        { id: 10, name: 'Tarifa 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación J', value: '$400' },
        { id: 11, name: 'Tarifa 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación J', value: '$400' },
        { id: 12, name: 'Tarifa 10', period: '10/01 - 10/31', weekDays: ['Miércoles', 'Jueves'], chargerType: 'DC', location: 'Ubicación J', value: '$400' }
      ],
      page: 1,
      perPage: 5,
      pages: [],
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
    filteredPlans() {
      const query = this.searchQuery.toLowerCase();
      return this.data.filter(dat => dat.name.toLowerCase().includes(query));
    },
    displayedPosts() {
      return this.paginate(this.data);
    },
    resultQuery() {
      let filteredData = this.data;

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return (
              data.id.toString().toLowerCase().includes(search) ||
              data.name.toLowerCase().includes(search) ||
              data.period.toLowerCase().includes(search) ||
              data.weekDays.some(day => day.toLowerCase().includes(search)) ||
              data.chargerType.toLowerCase().includes(search) ||
              data.location.toLowerCase().includes(search) ||
              data.value.toLowerCase().includes(search)
          );
        });
      }
        return this.paginate(filteredData);
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
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
