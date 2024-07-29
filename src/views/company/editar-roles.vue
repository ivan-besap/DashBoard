<template>
    <Layout>
      <PageHeader title="Crear Rol" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Crear Rol" />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="createRole">
                  <BRow>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="roleName" class="form-label">Nombre</label>
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
                            v-model="role.permissions"
                            value="Cargadores - Borrar"
                            class="mb-2"
                          >
                            Cargadores - Borrar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Cargadores - Crear"
                            class="mb-2"
                          >
                            Cargadores - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Cargas por terminal - Ver"
                            class="mb-2"
                          >
                            Cargas por terminal - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Comandos OCPP - Cargador"
                            class="mb-2"
                          >
                            Comandos OCPP - Cargador
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Comandos OCPP - Conector"
                            class="mb-2"
                          >
                            Comandos OCPP - Conector
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Conductores - Editar"
                            class="mb-2"
                          >
                            Conductores - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Conductores - Inhabilitar"
                            class="mb-2"
                          >
                            Conductores - Inhabilitar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Conductores - Ver"
                            class="mb-2"
                          >
                            Conductores - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Configuraciones de cargador - Ver"
                            class="mb-2"
                          >
                            Configuraciones de cargador - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Control de potencia - Crear"
                            class="mb-2"
                          >
                            Control de potencia - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Control de potencia - Editar"
                            class="mb-2"
                          >
                            Control de potencia - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Control de potencia - Ver"
                            class="mb-2"
                          >
                            Control de potencia - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Dashboard - Ver"
                            class="mb-2"
                          >
                            Dashboard - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Inhabilitaciones programadas - Crear"
                            class="mb-2"
                          >
                            Inhabilitaciones programadas - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Inhabilitaciones programadas - Editar"
                            class="mb-2"
                          >
                            Inhabilitaciones programadas - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Inhabilitaciones programadas - Ver"
                            class="mb-2"
                          >
                            Inhabilitaciones programadas - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="OCPP - Editar configuraciones"
                            class="mb-2"
                          >
                            OCPP - Editar configuraciones
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="OCPP - Ver configuraciones"
                            class="mb-2"
                          >
                            OCPP - Ver configuraciones
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Peak Shaving - Crear"
                            class="mb-2"
                          >
                            Peak Shaving - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Peak Shaving - Editar"
                            class="mb-2"
                          >
                            Peak Shaving - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Peak Shaving - Ver"
                            class="mb-2"
                          >
                            Peak Shaving - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Registros de Carga - Ver"
                            class="mb-2"
                          >
                            Registros de Carga - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="RFID - Crear"
                            class="mb-2"
                          >
                            RFID - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="RFID - Editar"
                            class="mb-2"
                          >
                            RFID - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="RFID - Ver"
                            class="mb-2"
                          >
                            RFID - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Roles - Borrar"
                            class="mb-2"
                          >
                            Roles - Borrar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Roles - Crear"
                            class="mb-2"
                          >
                            Roles - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Roles - Editar"
                            class="mb-2"
                          >
                            Roles - Editar
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Roles - Ver"
                            class="mb-2"
                          >
                            Roles - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Tecles - Ver"
                            class="mb-2"
                          >
                            Tecles - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Terminales - Ver"
                            class="mb-2"
                          >
                            Terminales - Ver
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Ubicaciones - Crear"
                            class="mb-2"
                          >
                            Ubicaciones - Crear
                          </BFormCheckbox>
                          <BFormCheckbox
                            v-model="role.permissions"
                            value="Ubicaciones - Ver"
                            class="mb-2"
                          >
                            Ubicaciones - Ver
                          </BFormCheckbox>
                        </div>
                      </div>
                    </BCol>
  
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton type="submit" variant="primary" @click="successmsg">
                          Actualizar Rol
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
  import Swal from 'sweetalert2';
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import CardHeader from "@/common/card-header";
  
  export default {
    data() {
      return {
        role: {
          name: 'Nombre del Rol Ejemplo', // Valor predeterminado para el nombre
          permissions: [
            'Cargadores - Borrar',
            'Cargadores - Crear',
            'Comandos OCPP - Cargador',
            // Agrega aquí otros permisos seleccionados por defecto
          ]
        },
      };
    },
    components: {
      Layout,
      PageHeader,
      CardHeader,
    },
    methods: {
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
      },
      async createRole() {
        try {
         
          this.successmsg();
          this.role.name = '';
          this.role.permissions = [];
        } catch (error) {
          console.error("Error creando el rol:", error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error creando el rol'
          });
        }
      }
    }
  };
  </script>
  
  <style>
  .permissions-wrapper .form-check {
    margin-bottom: 0.5em;
  }
  </style>
  