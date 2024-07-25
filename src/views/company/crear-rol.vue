<template>
    <Layout>
      <PageHeader title="Roles" pageTitle="items" />
      
      <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <a href="/company/create-empleados-company">Crear Roles</a>
      </BButton>
      
      <BForm @submit.prevent="saveRole">
        <BFormGroup label="Nombre del Rol" label-for="role-name">
          <BFormInput id="role-name" v-model="newRole.name" required></BFormInput>
        </BFormGroup>
        
        <BFormGroup label="Permisos" label-for="role-permissions">
          <div class="permisos-wrapper">
            <BFormCheckbox v-for="permission in permissions" :key="permission" v-model="newRole.permissions" :value="permission">
              {{ permission }}
            </BFormCheckbox>
          </div>
        </BFormGroup>
        
        <BButton type="submit" variant="primary">Guardar</BButton>
      </BForm>
      
      <div class="table-responsive table-card mt-5">
        <table class="table table-nowrap table-striped-columns mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Permisos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="#" class="fw-semibold">Administrador</a></td>
              <td>
                <div class="permisos-wrapper">
                  <span class="badge border border-dark text-body tama-dark">Cargadores - Crear</span>
                  <span class="badge border border-dark text-body tama-dark">Cargadores - Borrar</span>
                  <!-- Agrega los demás permisos aquí -->
                </div>
              </td>
              <td>
                <BButton variant="danger" type="button" id="sa-warning" @click="confirm">
                  Eliminar
                </BButton>
              </td>
            </tr>
            <!-- Agrega los demás roles aquí -->
          </tbody>
        </table>
      </div>
    </Layout>
  </template>
  
  <script>
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import Swal from "sweetalert2";
  import { BForm, BFormGroup, BFormInput, BFormCheckbox, BButton } from 'bootstrap-vue';
  
  export default {
    components: {
      Layout,
      PageHeader,
      BForm,
      BFormGroup,
      BFormInput,
      BFormCheckbox,
      BButton,
    },
    data() {
      return {
        newRole: {
          name: '',
          permissions: [],
        },
        permissions: [
          'Cargadores - Crear', 'Cargadores - Borrar', 'Cargadores - Editar', 
          'Cargas por terminal - Ver', 'Comandos OCPP - Cargador', 'Comandos OCPP - Conector', 
          'Conductores - Editar', 'Conductores - Inhabilitar', 'Conductores - Ver', 
          'Configuraciones de cargador - Ver', 'Control de potencia - Crear', 
          'Control de potencia - Editar', 'Control de potencia - Ver', 'Dashboard - Ver', 
          'Inhabilitaciones programadas - Crear', 'Inhabilitaciones programadas - Editar', 
          'Inhabilitaciones programadas - Ver', 'OCPP - Editar configuraciones', 
          'OCPP - Ver configuraciones', 'Peak Shaving - Crear', 'Peak Shaving - Editar', 
          'Peak Shaving - Ver', 'Registros de Carga - Ver', 'Roles - Borrar', 
          'Roles - Crear', 'Roles - Editar', 'Roles - Ver', 'Tecles - Ver', 
          'Terminales - Ver', 'Ubicaciones - Crear', 'Ubicaciones - Ver'
        ],
      };
    },
    methods: {
      saveRole() {
        // Aquí puedes añadir la lógica para guardar el rol
        console.log("Nuevo Rol:", this.newRole);
        Swal.fire("Rol guardado!", "El nuevo rol ha sido guardado correctamente.", "success");
      },
      confirm() {
        Swal.fire({
          title: "Desea eliminar el Rol?",
          text: "No podrás revertirlo!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Si, eliminar!",
        }).then((result) => {
          if (result.value) {
            Swal.fire("Eliminado!", "El Rol ha sido eliminado.", "success");
          }
        });
      },
    },
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
  