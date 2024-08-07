<template>
    <Layout>
      <PageHeader title="Conectores" pageTitle="Compañía" />
    
      <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="/company/create-empleados-company">Detalle de Terminal</a>
      </BButton>-->

      <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-conector">
              Crear Conector
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px; margin-bottom: 10px;">
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
    
<!--      <div class="table-responsive table-card">-->
<!--        <table class="table table-nowrap table-striped-columns mb-0">-->
<!--          <thead class="table-light">-->
<!--            <tr>-->
<!--              <th scope="col">-->
<!--                <div class="form-check">-->
<!--                  <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">-->
<!--                  <label class="form-check-label" for="cardtableCheck"></label>-->
<!--                </div>-->
<!--              </th>-->
<!--              <th scope="col">Alias</th>-->
<!--              <th scope="col">Tipo conector</th>-->
<!--              -->
<!--              <th scope="col">Potencia en curso</th>-->
<!--             -->
<!--              -->
<!--              <th scope="col">Cargadores</th>-->
<!--              <th scope="col" style="width: 1%;">Acciones</th>-->
<!--            </tr>-->
<!--          </thead>-->
<!--          <tbody>-->
<!--            <tr v-for="station in stations" :key="station.id">-->
<!--              <td>-->
<!--                <div class="form-check">-->
<!--                  <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">-->
<!--                  <label class="form-check-label" for="cardtableCheck01"></label>-->
<!--                </div>-->
<!--              </td>-->
<!--              <td>{{ station.alias }}</td>-->
<!--              <td><img src="https://dhemax-lab-contenido-estatico-cms-evca.s3.amazonaws.com/cms/connectors/EVPhysicalConnectorType_IEC_62196_T1_COMBO.svg">{{ station.connectorType }}</td>-->
<!--              -->
<!--              <td>{{ station.currentPower }}</td>-->
<!--      -->
<!--              -->
<!--              <td>{{ station.vehicle }}</td>-->
<!--              <td>-->
<!--                <BButton style="padding: 5px 10px; background-color: #dfe4ea" variant="light" class="waves-effect waves-light">-->
<!--                  <router-link class="nav-link menu-link" :to="`/company/editar-conector/`">-->
<!--                    <i class="mdi mdi-pencil"></i>-->
<!--                  </router-link>-->
<!--                </BButton>-->
<!--                <BButton style="padding: 5px 10px; background-color: #dfe4ea; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">-->
<!--                  <i class="mdi mdi-delete"></i>-->
<!--                </BButton>-->
<!--            </td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--        </table>-->
<!--      </div>-->
      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive table-card">
            <table class="table align-middle table-nowrap" id="customerTable">
              <thead class="table-light text-muted">
              <tr>
                <th class="sort" data-sort="current_value" scope="col" @click="onSort('alias')">Alias</th>
                <th class="sort" data-sort="pairs" scope="col" @click="onSort('connectorType')">Tipo Conector</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('currentPower')">Potencia en curso</th>
                <th class="sort" data-sort="high" scope="col" @click="onSort('vehicle')">Cargadores</th>
                <th scope="col" style="width: 1%;">Acciones</th>
              </tr>
              </thead>
              <tbody class="list form-check-all">
              <tr v-for="(dat, index) in resultQuery" :key="index">
                <td>{{ dat.alias }}</td>
                <td class="pairs">{{ dat.connectorType }}</td>
                <td class="pairs">{{ dat.currentPower }}</td>
                <td class="pairs">{{ dat.vehicle }}</td>
                <td>
                  <BButton style="padding: 5px 10px; " variant="light" class="waves-effect waves-light">
                    <router-link class="nav-link menu-link" :to="`/company/editar-conector/`">
                      <i class="mdi mdi-pencil"></i>
                    </router-link>
                  </BButton>
                  <BButton style="padding: 5px 10px;  margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
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
        // stations: [
        //   { id: 1, alias: "Uno", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargadores 1" },
        //   { id: 2, alias: "Dos", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 2" },
        //   { id: 3, alias: "Tres", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 3" },
        //   { id: 4, alias: "Cuatro", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 4" },
        //   // Puedes agregar más estaciones aquí si lo necesitas
        // ],
        searchQuery: '',
        data: [
          { id: 1, alias: "Uno", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 1" },
          { id: 2, alias: "Dos", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 2" },
          { id: 3, alias: "Tres", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 3" },
          { id: 4, alias: "Cuatro", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 4" },
          // Puedes agregar más estaciones aquí si lo necesitas
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
        return this.data.filter(dat => dat.alias.toLowerCase().includes(query));
      },
      displayedPosts() {
        return this.paginate(this.data);
      },
      resultQuery() {
        if (this.searchQuery) {
          const search = this.searchQuery.toLowerCase();
          return this.displayedPosts.filter((data) => {
            return (
                data.alias.toLowerCase().includes(search) ||
                data.connectorType.toLowerCase().includes(search) ||
                data.currentPower.toLowerCase().includes(search) ||
                data.vehicle.toLowerCase().includes(search)
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
            Swal.fire("Conector Eliminado", "", "success");
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
  