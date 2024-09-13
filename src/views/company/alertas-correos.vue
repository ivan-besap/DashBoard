<template>
  <Layout>
    <PageHeader title="Configuración de Correos Alertas y Errores" pageTitle="Compañía" />

    <BRow>
      <BCol class="my-2" xxl="3" md="6">
        <div>
          <label for="basiInput" class="form-label">Buscar Usuario</label>
          <input type="text" class="form-control" v-model="searchQuery">
        </div>
      </BCol>
      <BCol class="my-2 mb-4" xxl="5" md="6">
        <label for="ForminputState" class="form-label">Correo</label>
        <div class="d-flex align-items-center">
          <Multiselect
              style="border: 1px solid black;"
              v-model="correoSeleccionado"
              :options="correos"
              label="label"
              track-by="label"
              placeholder="Selecciona o ingresa un correo"
              :close-on-select="true"
              :searchable="true"
              :create-option="true"

          />
          <BButton class="ms-2" @click="agregarUsuario" variant="primary" v-if="permisos.includes(56)">Añadir</BButton>
        </div>
      </BCol>
    </BRow>

    <!-- Tablas y tabs existentes -->
    <BCard no-body>
      <BCardBody>
        <BTabs nav-class="mb-3 nav-pills-justified" pills justified v-model="pestanaActiva">
      <BTab title="Alarmas Diarias" active>
        <!-- Tabla de alarmas diarias -->
        <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
          <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="usuario in usuariosAlarmaFiltrados" :key="usuario.id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>
              <BButton v-if="permisos.includes(57)" variant="light" class="waves-effect waves-light" @click="eliminarUsuario(usuario.id, 'alarma')">
              <i class="mdi mdi-delete"></i>
              </BButton>
            </td>
          </tr>
          </tbody>
        </table>
      </BTab>

      <BTab title="Errores de Conector">
        <!-- Tabla de errores de conector -->
        <table class="table align-middle table-nowrap table-striped table-hover" id="customerTable">
          <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="usuario in usuariosErrorFiltrados" :key="usuario.id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>
              <BButton variant="light" class="waves-effect waves-light" @click="eliminarUsuario(usuario.id, 'error')">
                <i class="mdi mdi-delete"></i>
              </BButton>
            </td>
          </tr>
          </tbody>
        </table>
      </BTab>
    </BTabs>
      </BCardBody>
    </BCard>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from "axios";
import Multiselect from "@vueform/multiselect";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
    Multiselect
  },
  data() {
    return {
      correos: [],
      searchQuery: '',
      correoSeleccionado: null,
      usuariosAlarma: [],
      usuariosError: [],
      empresaId: null,
      pestanaActiva: 1,
      permisos : [],
    };
  },
  computed: {
    usuariosAlarmaFiltrados() {
      return this.usuariosAlarma.filter(usuario =>
          usuario.nombre && usuario.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    usuariosErrorFiltrados() {
      return this.usuariosError.filter(usuario =>
          usuario.nombre && usuario.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      this.userData = JSON.parse(userDataString);
      this.permisos = this.userData.rol.permisos.map(permiso => permiso.id);
    },
    async cargarCorreos() {
      try {
        const response = await axios.get(`https://app.evolgreen.com:8080/api/usuarios/correos`);  // Quitar empresaId
        this.correos = response.data;
      } catch (error) {
        console.error('Error al cargar los correos', error);
      }
    },
    async cargarUsuarios() {
      try {
        // Cargar usuarios para alarmas
        const responseAlarma = await axios.get(`https://app.evolgreen.com:8080/api/usuarios/alarmaCorreo`);  // Quitar empresaId
        this.usuariosAlarma = responseAlarma.data;

        // Cargar usuarios para errores
        const responseError = await axios.get(`https://app.evolgreen.com:8080/api/usuarios/alarmaError`);  // Quitar empresaId
        this.usuariosError = responseError.data;
      } catch (error) {
        console.error('Error al cargar los usuarios', error);
      }
    },
    async agregarUsuario() {
      if (!this.correoSeleccionado) {
        alert('Selecciona o ingresa un correo válido');
        return;
      }

      // Busca el objeto completo en `correos` usando el `value` (que es un número)
      const correoCompleto = this.correos.find(correo => correo.value === this.correoSeleccionado);

      if (!correoCompleto || !correoCompleto.label) {
        alert('No se pudo encontrar el correo seleccionado');
        return;
      }

      const nuevoUsuario = { email: correoCompleto.label }; // Usar el `label` como correo

      try {
        if (this.pestanaActiva === 0) {
          this.usuariosAlarma.push(nuevoUsuario);
          const response = await axios.post('https://app.evolgreen.com:8080/api/usuarios/alarmaCorreo/add', { email: nuevoUsuario.email });
          if (response.status === 200 || response.status === 201) {
            Swal.fire("Usuario agregado correctamente", "", "success").then(() => {
              this.$router.go(0);
            });
          }
        } else if (this.pestanaActiva === 1) {
          this.usuariosError.push(nuevoUsuario);
          const response = await axios.post('https://app.evolgreen.com:8080/api/usuarios/alarmaError/add', { email: nuevoUsuario.email });
          if (response.status === 200 || response.status === 201) {
            Swal.fire("Usuario agregado correctamente", "", "success").then(() => {
              this.$router.go(0);
            });
          }
        }
      } catch (error) {
        Swal.fire("Error al agregar usuario", "", "error");
        console.error('Error al añadir el usuario', error);
      }
    },
    async eliminarUsuario(id, tipo) {
      const url = tipo === 'alarma'
          ? `https://app.evolgreen.com:8080/api/usuarios/alarmaCorreo/${id}/remove`
          : `https://app.evolgreen.com:8080/api/usuarios/alarmaError/${id}/remove`;

      try {
        const response = await axios.patch(url);
        if (response.status === 200 || response.status === 201) {
          // Filtrar el usuario eliminado de la lista
          if (tipo === 'alarma') {
            this.usuariosAlarma = this.usuariosAlarma.filter(usuario => usuario.id !== id);
          } else {
            this.usuariosError = this.usuariosError.filter(usuario => usuario.id !== id);
          }

          // Mostrar un mensaje de éxito
          Swal.fire({
            title: "Usuario eliminado correctamente",
            icon: "success"
          }).then(() => {
            // Recargar la página después de cerrar el mensaje
            window.location.reload(); // O usa this.$router.go(0);
          });
        }
      } catch (error) {
        // Mostrar un mensaje de error en caso de fallo
        Swal.fire("Error al eliminar el usuario", "", "error");
        console.error('Error al eliminar el usuario', error);
      }
    }
  },
  mounted() {
    this.cargarCorreos();  // Cargar correos dinámicamente
    this.cargarUsuarios();
    this.loadUserData();
  },
};
</script>
<style scoped>
</style>
