<template>
  <Layout>
    <PageHeader title="Editar Rol" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateRole">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="roleName" class="form-label">Nombre Rol</label>
                      <BFormInput
                          v-model="role.name"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del rol"
                          id="roleName"
                          required
                      />
                    </div>
                  </BCol>

                  <BCol md="12">
                    <div class="mb-3">
                      <label class="form-label">Permisos</label>
                      <div class="permissions-wrapper">
                        <BFormCheckbox
                            v-for="permiso in permisos"
                            :key="permiso.id"
                            :value="permiso.id"
                            v-model="role.permissions"
                            class="mb-2"
                        >
                          <strong>{{ permiso.descripcion }}</strong>
                        </BFormCheckbox>
                      </div>
                    </div>
                  </BCol>

                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/roles')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Actualizar
                      </BButton>
                    </div>
                  </BCol>
                </BRow>
              </BForm>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
  data() {
    return {
      role: {
        id: null,
        name: '',
        permissions: [],
      },
      permisos: []
    };
  },
  components: {
    Layout,
    PageHeader,
  },
  methods: {
    async fetchRole() {
      const roleId = this.$route.params.id; // Obtener el id del rol desde la URL
      try {
        const response = await axios.get(`https://app.evolgreen.com/api/roles/${roleId}`);
        const role = response.data;
        this.role.id = role.id;
        this.role.name = role.nombre;
        this.role.permissions = role.permisos.map(p => p.id);
      } catch (error) {
        console.error("Error fetching role:", error);
        Swal.fire("Error", "No se pudo cargar la información del rol.", "error");
      }
    },
    async fetchPermisos() {
      try {
        const response = await axios.get("https://app.evolgreen.com/api/permissions");
        this.permisos = response.data;
      } catch (error) {
        console.error("Error fetching permisos:", error);
        Swal.fire("Error", "No se pudo cargar la información de los permisos.", "error");
      }
    },
    async updateRole() {
      try {
        const roleData = {
          nombre: this.role.name,
          permisosIds: this.role.permissions
        };

        await axios.put(`https://app.evolgreen.com/api/roles/${this.role.id}`, roleData);
        this.successmsg();
      } catch (error) {
        console.error("Error updating role:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error actualizando el rol'
        });
      }
    },
    async successmsg() {
      Swal.fire({
        title: "Rol Actualizado!",
        text: "Redirigiendo a la página de Roles...",
        icon: "success",
        timer: 2000, // Tiempo en milisegundos antes de redirigir
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('/company/roles'); // Redirigir a la página de roles
        }
      });
    }
  },
  async created() {
    await this.fetchPermisos();
    await this.fetchRole();
  }
};
</script>

<style scoped>
.permissions-wrapper .form-check {
  margin-bottom: 0.5em;
}
</style>
