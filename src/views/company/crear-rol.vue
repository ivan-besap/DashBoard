<template>
  <Layout>
    <PageHeader title="Crear Rol" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="crearRole">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3 ms-3">
                      <label for="roleName" class="form-label">Nombre Rol</label>
                      <BFormInput
                          v-model="roleName"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del rol"
                          id="roleName"
                          required
                      />
                    </div>
                  </BCol>

                  <BCol xxl="12">
                      <BCardBody>
                        <label for="permisos" class="form-label" style="margin-bottom: -15px">Seleccionar Permisos</label>
                        <hr>
                        <div class="permissions-wrapper">
                          <BFormCheckbox
                              v-for="permiso in permisos"
                              :key="permiso.id"
                              v-model="selectedPermisos"
                              :value="permiso.id"
                              class="mb-2"
                          >
                            <strong>{{ permiso.descripcion }}</strong>
                          </BFormCheckbox>
                        </div>
                      </BCardBody>
                  </BCol>

                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/roles')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Crear Rol
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
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      permisos:[],
      roleName: '',
      selectedPermisos: [],
    };
  },
  components: {
    Layout,
    PageHeader,
  },
  methods: {
    fetchPermisos() {
      axios
          .get("http://localhost:8088/api/permissions")
          .then((response) => {
            this.permisos = response.data;
          })
          .catch((error) => {
            console.error("Error fetching permisos:", error);
            Swal.fire(
                "Error",
                "No se pudo cargar la información de los permisos.",
                "error"
            );
          });
    },
    crearRole() {
      const roleData = {
        nombre: this.roleName,
        permisosIds: this.selectedPermisos,
      };

      axios
          .post("http://localhost:8088/api/create-role", roleData)
          .then(() => {
            Swal.fire({
              title: "Rol creado!",
              text: "Redirigiendo a la página de Roles...",
              icon: "success",
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                this.$router.push('/company/roles');
              }
            });
          })
          .catch((error) => {
            console.error("Error creating role:", error);
            Swal.fire(
                "Error",
                "No se pudo crear el rol.",
                "error"
            );
          });
    },
  },
  created() {
    this.fetchPermisos()
  }
};
</script>

<style>
.permissions-wrapper .form-check {
  margin-bottom: 0.5em;
}
</style>
