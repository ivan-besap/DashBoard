<template>
  <Layout>
    <PageHeader title="Roles" pageTitle="Compañía" />
    <BRow>
      <div style="display: flex; flex-direction: row; justify-content: space-between;" v-if="permisos.includes(53)">
        <div class="contenedor-inic">
          <BButton style=" border: 1px solid #d8d8d8"  variant="light" class="waves-effect waves-light">
            <router-link class="nav-link menu-link" target="" to="/company/crear-rol">
              Crear Rol
            </router-link>
          </BButton>
      
        </div>
        <div class="contenedor-finac" style="margin-bottom: 10px; width: 246px;">
          <!-- Input de búsqueda -->
          <div class="d-flex justify-content-sm-end" style="height: 35px;">
            <BFormInput
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar por Rol..."
            />
          </div>
        </div>
      </div>
    </BRow>


    <BCard no-body class="card-body">
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table table-nowrap mb-0">
            <thead class="table-light">
            <tr>
              <th scope="col" style="width: 11%">Nombre</th>
              <th scope="col">Permisos</th>
              <th scope="col">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="role in filteredRoles" :key="role.id">
              <td><a style="color: #0c0c0c" class="fw-semibold">{{ role.nombre }}</a></td>
              <td>
                <div class="permisos-wrapper">
                    <span v-for="permiso in role.permisos" :key="permiso.id" class="badge border border-dark text-body tama-dark">
                      {{ permiso.descripcion }}
                    </span>
                </div>
              </td>
              <td>
                <BButton style="padding: 5px 10px;" variant="light" class="waves-effect waves-light" v-if="permisos.includes(31)">
                  <router-link class="nav-link menu-link" :to="`/company/editar-roles/${role.id}`">
                    <i class="mdi mdi-pencil"></i>
                  </router-link>
                </BButton>
                <BButton style="padding: 5px 10px; margin-left: 10px" variant="light" class="waves-effect waves-light" @click="confirm(role.id)" v-if="permisos.includes(32)">
                  <i class="mdi mdi-delete"></i>
                </BButton>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      roles: [],
      searchQuery: '',
      permisos:[]
    };
  },
  computed:{
    filteredRoles() {
      if (!this.searchQuery) {
        return this.roles;
      }

      const search = this.searchQuery.toLowerCase();
      return this.roles.filter(role => {
        // Buscar por nombre del rol
        const matchesRoleName = role.nombre.toLowerCase().includes(search);

        // Buscar por nombre de los permisos
        const matchesPermission = role.permisos.some(permiso =>
            permiso.descripcion.toLowerCase().includes(search)
        );

        return matchesRoleName || matchesPermission;
      });
    }
  },
  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    fetchRoles() {
      axios.get("https://app.evolgreen.com:8088/api/roles")
          .then((response) => {
            this.roles = response.data;
          })
          .catch((error) => {
            console.error("Error fetching roles:", error);
            Swal.fire(
                "Error",
                "No se pudo cargar la información de los roles.",
                "error"
            );
          });
    },
    confirm(roleId) {
      Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir la acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Sí, eliminar!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.patch(`https://app.evolgreen.com:8088/api/roles/${roleId}/delete`);
            if (response.status === 200 || response.status === 201) {
              Swal.fire(
                  "¡Eliminado!",
                  "Tu Rol ha sido eliminada.",
                  "success"
              ).then(() => {
                this.$router.go(0);
              });
            }
          } catch (error) {
            console.error("Error eliminando el rol:", error);
            Swal.fire("Error", "No se pudo eliminar el conector.", "error");
          }
        }
      });
    }
  },
  created() {
    this.fetchRoles();
    this.loadUserData();
  }
};
</script>

<style scoped>
.table-card .badge.tama-dark {
  font-size: 1rem;
  padding: 0.6em;
}
.permisos-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
</style>
