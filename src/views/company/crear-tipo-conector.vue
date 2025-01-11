<template>
  <Layout>
    <PageHeader title="Crear Tipo de Conector" pageTitle="Compañía" />

    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createTypeConnector">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombre" class="form-label">Nombre del Tipo de Conector</label>
                      <BFormInput
                          v-model="typeConnector.nombre"
                          type="text"
                          class="form-control"
                          placeholder="Ingrese el nombre del tipo de conector"
                          id="nombre"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="text-end">
                      <BButton style="" type="submit" variant="light" @click="successmsg">
                        Crear Tipo de Conector
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
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from 'axios';

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      typeConnector: {
        nombre: ''
      }
    };
  },
  methods: {
    successmsg() {
      Swal.fire({
        title: "Tipo de Conector creado!",
        text: "Redirigiendo a la página de Conectores...",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('/company/conector');
        }
      });
    },
    async createTypeConnector() {
      try {
        await axios.post('http://localhost:8088/api/connector-types', this.typeConnector);
        this.successmsg();
      } catch (error) {
        console.error("Error creando el tipo de conector:", error);
        Swal.fire(
            "Error",
            "No se pudo crear el tipo de conector.",
            "error"
        );
      }
    }
  }
};
</script>

<style scoped>
.flex-shrink-0 {
  display: none;
}
</style>
