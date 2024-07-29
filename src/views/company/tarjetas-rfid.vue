<template>
  <Layout>
    <PageHeader title="Tarjetas RFID" pageTitle="Compañía" />

    <!--<BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="/company/create-empleados-company">Detalle de Terminal</a>
    </BButton>-->

    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="contenedor-inic">
          <BButton style="margin-bottom: 45px; background-color: white"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-tarjeta-rfid">
              Crear Tarjeta RFID
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
                placeholder="Buscar por nombre de Tarjeta..."
            />
          </div>
        </div>
      </div>
    </BRow>

    <div class="table-responsive table-card">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
        <tr>
<!--          <th scope="col">-->
<!--            <div class="form-check">-->
<!--              <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">-->
<!--              <label class="form-check-label" for="cardtableCheck"></label>-->
<!--            </div>-->
<!--          </th>-->
          <th scope="col">Nombre</th>
          <th scope="col">Código Tarjeta</th>
          <th scope="col">Fecha Expiración</th>
          <th style="width: 1%" scope="col">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="tarjeta in tarjetas" :key="tarjeta.id">
<!--          <td>-->
<!--            <div class="form-check">-->
<!--              <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">-->
<!--              <label class="form-check-label" for="cardtableCheck01"></label>-->
<!--            </div>-->
<!--          </td>-->
          <td>{{ tarjeta.nombre }}</td>
          <td>{{ tarjeta.codigo }}</td>
          <td>{{ tarjeta.fechaExpiracion }}</td>

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
      tarjetas: [
        { id: 1, nombre: "Tarjeta Oficina 23", codigo: "456897541287456200", fechaExpiracion: "13-08-2024"},
        { id: 2, nombre: "Tarjeta Oficina 45", codigo: "445543541287432190", fechaExpiracion: "23-09-2024"},
        { id: 3, nombre: "Tarjeta Oficina 004", codigo: "23324580549906948", fechaExpiracion: "31-08-2024"},
        { id: 4, nombre: "Tarjeta Oficina 453", codigo: "88554796002145575", fechaExpiracion: "28-10-2024"},
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
          Swal.fire("Tarjeta RFID Eliminada", "", "success");
        }
      });
    }
  },
};
</script>

