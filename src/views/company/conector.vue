<template>
    <Layout>
      <PageHeader title="Conectores" pageTitle="Compañía" />
    
      <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="/company/create-empleados-company">Detalle de Terminal</a>
      </BButton>-->

      <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="margin-bottom: 45px; background-color: white"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-conector">
              Crear Conector
            </router-link>
          </BButton>
        </div>
        <div class="contenedor-finac" style="width: 246px;">
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
    
      <div class="table-responsive table-card">
        <table class="table table-nowrap table-striped-columns mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                  <label class="form-check-label" for="cardtableCheck"></label>
                </div>
              </th>
              <th scope="col">Alias</th>
              <th scope="col">Tipo conector</th>
              
              <th scope="col">Potencia en curso</th>
             
              
              <th scope="col">Cargadores</th>
              <th scope="col" style="width: 1%;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="station in stations" :key="station.id">
              <td>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                  <label class="form-check-label" for="cardtableCheck01"></label>
                </div>
              </td>
              <td>{{ station.alias }}</td>
              <td><img src="https://dhemax-lab-contenido-estatico-cms-evca.s3.amazonaws.com/cms/connectors/EVPhysicalConnectorType_IEC_62196_T1_COMBO.svg">{{ station.connectorType }}</td>
              
              <td>{{ station.currentPower }}</td>
      
              
              <td>{{ station.vehicle }}</td>
              <td>
                <BButton style="padding: 5px 10px; background-color: #95eac9" variant="light" class="waves-effect waves-light">
                  <router-link class="nav-link menu-link" :to="`/company/editar-conector/`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px; background-color: #ea9595; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm">
                  <i class="mdi mdi-delete"></i>
                </BButton>
            </td>
            </tr>
          </tbody>
        </table>
      </div>
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
        stations: [
          { id: 1, alias: "Uno", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargadores 1" },
          { id: 2, alias: "Dos", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 2" },
          { id: 3, alias: "Tres", connectorType: "Tipo 1 - J1772", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 3" },
          { id: 4, alias: "Cuatro", connectorType: "IEC Tipo 2", status: "Activo", currentPower: "8.19 kW", currentSoC: "0 %", errors: "0 Errores", vehicle: "Cargador 4" },
          // Puedes agregar más estaciones aquí si lo necesitas
        ]
      };
    },

    methods: {
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
  