<template>
  <Layout>
    <PageHeader title="Asignar Mantenimiento" pageTitle="items" />

    <BRow>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchStations"
              placeholder="Buscar estación..."
              v-model="cargadorSearchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <div class="table-responsive" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
<!--                <th scope="col">-->
<!--                  <div class="form-check">-->
<!--                    <input-->
<!--                        class="form-check-input"-->
<!--                        type="checkbox"-->
<!--                        @click="toggleSelectAllCargadores"-->
<!--                        style="border-radius: 10px"-->
<!--                    >-->
<!--                    <label class="form-check-label"></label>-->
<!--                  </div>-->
<!--                </th>-->
                <th></th>
                <th scope="col">Estación</th>
                <th scope="col">Cargador</th>
                <th scope="col">Conector</th>
                <th scope="col">Mantenimiento</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="cargador in filteredCargadores" :key="cargador.id" @click="toggleCargadorSelection(cargador)">
                <td>
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'check' + cargador.id"
                        v-model="selectedCargadores"
                        :value="cargador"
                        @click.stop
                        style="border-radius: 10px"
                    />
                    <label class="form-check-label" :for="'check' + cargador.id"></label>
                  </div>
                </td>
                <td>{{ cargador.terminalName }}</td>
                <td>{{ cargador.nombre }}</td>
                <td>{{ cargador.ocppid }}</td>
                <td>
                  <!-- Verifica si el cargador tiene al menos un mantenimiento asignado -->
                  <span v-if="cargador.mantenimientos.length > 0">
                    {{ cargador.mantenimientos[0].descripcion }}
                  </span>
                  <span v-else>
                    No hay mantenimiento asignado
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BCol>
      <BCol xl="6">
        <div class="search-box mb-4">
          <input
              type="text"
              class="form-control  border-light"
              autocomplete="off"
              id="searchList"
              placeholder="Buscar tarifa..."
              v-model="searchQuery"
          />
          <i class="ri-search-line search-icon"></i>
        </div>
        <BCardBody class="border-end" style="background-color: white">
          <div style="max-height: 500px; overflow-y: auto;">
            <table class="table table-striped table-hover align-middle table-nowrap mb-0">
              <thead class="table-light">
              <tr>
                <th></th>
                <th scope="col">Descripción</th>
                <th scope="col">Fecha</th>
                <th scope="col">Horario</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(mantenimiento, index) in resultQuery" :key="index" @click="selectMantenimiento(mantenimiento)">
                <td>
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        :value="mantenimiento"
                        v-model="selectedMantenimiento"
                        :id="'mantenimiento' + mantenimiento.id"
                        @click.stop
                    />
                    <label class="form-check-label" :for="'mantenimiento' + mantenimiento.id"></label>
                  </div>
                </td>
                <td>{{ mantenimiento.descripcion }}</td>
                <td>{{ mantenimiento.fechaInicial }} / {{ mantenimiento.fechaFinal }}</td>
                <td>{{ mantenimiento.horarioInicio }} / {{ mantenimiento.horarioFin }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-if="selectedMantenimiento && selectedCargadores.length > 0" class="mt-3 d-flex justify-content-between align-items-center" style="margin-left: 10px">
            <div>
              <h5>Tarifa Seleccionada</h5>
              <p class="mb-1"><strong>Nombre</strong> {{ selectedMantenimiento.descripcion }}</p>
              <p><strong>Fecha Inicio</strong> {{ selectedMantenimiento.fechaInicial }} / {{ selectedMantenimiento.fechaFinal }}</p>
            </div>
            <div class="ms-auto me-3">
              <BButton variant="light" @click="assignMantenimiento">Asignar</BButton>
            </div>
          </div>
        </BCardBody>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      searchQuery: '',
      cargadorSearchQuery: '',
      selectedMantenimiento: null,
      selectedCargadores: [],
      cargadores: [],
      mantenimientos: [],
      // allCargadoresSelected: false,
    };
  },

  computed: {
    resultQuery() {
      return this.mantenimientos.filter((mantenimiento) => {
        return mantenimiento.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    filteredCargadores() {
      return this.cargadores.filter(cargador =>
          cargador.terminalName.toLowerCase().includes(this.cargadorSearchQuery.toLowerCase()) ||
          cargador.nombre.toLowerCase().includes(this.cargadorSearchQuery.toLowerCase()) ||
          cargador.ocppid.toLowerCase().includes(this.cargadorSearchQuery.toLowerCase())
      );
    },
  },

  methods: {
    fetchMantenimientos() {
      axios.get("http://localhost:8088/api/mantenimientos")
          .then(response => {
            this.mantenimientos = response.data;
          })
          .catch(error => {
            console.error("Error al obtener mantenimientos:", error);
          });
    },

    fetchCargadores() {
      axios.get("http://localhost:8088/api/chargers")
          .then(response => {
            this.cargadores = response.data;
          })
          .catch(error => {
            console.error("Error al obtener cargadores:", error);
          });
    },

    toggleCargadorSelection(conector) {
      const index = this.selectedCargadores.findIndex(c => c.id === conector.id);
      if (index > -1) {
        this.selectedCargadores.splice(index, 1);  // Deselect if already selected
      } else {
        this.selectedCargadores.push(conector);    // Select if not selected
      }
    },
    selectMantenimiento(mantenimiento) {
      this.selectedMantenimiento = mantenimiento;
    },

    // toggleSelectAllCargadores() {
    //   if (this.allCargadoresSelected) {
    //     this.selectedCargadores = [];
    //   } else {
    //     this.selectedCargadores = [...this.connectors];
    //   }
    //   this.selectedCargadores = !this.selectedCargadores;
    // },

    assignMantenimiento() {
      if (this.selectedMantenimiento && this.selectedCargadores.length > 0) {
        // Mapeamos cada cargador seleccionado y realizamos una solicitud PATCH
        const requests = this.selectedCargadores.map(cargador => {
          return axios.patch(`http://localhost:8088/api/asignar-mantenimiento`, null, {
            params: {
              cargadorId: cargador.id,
              mantenimientoId: this.selectedMantenimiento.id
            }
          });
        });

        // Ejecutar todas las solicitudes en paralelo
        Promise.all(requests)
            .then(() => {
              Swal.fire({
                title: "Mantenimiento asignado exitosamente!",
                icon: "success",
                confirmButtonText: "OK",
                timer: 3000, // Duración de 3 segundos
              }).then(() => {
                location.reload(); // Solo recarga después de cerrar el Swal o pasar el tiempo
              });

              this.selectedCargadores = []; // Resetea los cargadores seleccionados después de asignar
            })
            .catch(error => {
              console.error("Error al asignar mantenimiento:", error);
              Swal.fire("Error al asignar mantenimiento", "No se pudo asignar el mantenimiento", "error");
            });
      } else {
        Swal.fire("Error", "Seleccione un mantenimiento y al menos un cargador antes de asignar", "warning");
      }
    }
  },

  created() {
    this.fetchMantenimientos();
    this.fetchCargadores();
  },
};
</script>

<style scoped>
.search-box {
  position: relative;
}

.search-box .form-control {
  padding-left: 40px;
}

.search-box .search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}
</style>
