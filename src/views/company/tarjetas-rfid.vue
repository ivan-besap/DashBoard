<template>
  <Layout>
    <PageHeader title="Tarjetas RFID" pageTitle="Compañía" />

    <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="/company/create-empleados-company">Detalle de Terminal</a>
    </BButton>-->

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarjeta-rfid">
              Crear Tarjeta RFID
            </router-link>
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
              <th class="sort" data-sort="current_value" scope="col" @click="onSort('nombre')">Nombre</th>
              <th class="sort" data-sort="pairs" scope="col" @click="onSort('codigo')">Código</th>
              <th class="sort" data-sort="high" scope="col" @click="onSort('fechaExpiracion')">Fecha de expiración</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
            </thead>
            <tbody class="list form-check-all">
            <tr v-for="(dat, index) in resultQuery" :key="index">
              <td>{{ dat.nombre }}</td>
              <td class="pairs">{{ dat.codigo }}</td>
              <td class="pairs">{{ dat.fechaExpiracion }}</td>
              <td>
                <BButton style="padding: 5px 10px; " variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-tarjeta-rfid/`">
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
  data() {
    return {
      searchQuery: '',
      data: [
        { id: 1, nombre: "Tarjeta Oficina 23", codigo: "456897541287456200", fechaExpiracion: "13-08-2024"},
        { id: 2, nombre: "Tarjeta Oficina 45", codigo: "445543541287432190", fechaExpiracion: "23-09-2024"},
        { id: 3, nombre: "Tarjeta Oficina 004", codigo: "23324580549906948", fechaExpiracion: "31-08-2024"},
        { id: 4, nombre: "Tarjeta Oficina 453", codigo: "88554796002145575", fechaExpiracion: "28-10-2024"},
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
      return this.data.filter(dat => dat.nombre.toLowerCase().includes(query));
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
              data.nombre.toLowerCase().includes(search) ||
              data.codigo.toLowerCase().includes(search) ||
              data.fechaExpiracion.toLowerCase().includes(search)
          );
        });
      }
      return this.paginate(filteredData);
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
          Swal.fire("Tarjeta RFID Eliminada", "", "success");
        }
      });
    }
  },
};
</script>

