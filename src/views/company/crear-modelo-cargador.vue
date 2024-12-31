<template>
  <Layout>
    <PageHeader title="Crear Modelo de Cargador" pageTitle="Compañía" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Modelo de Cargador" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createChargerModel">
                <BRow>
                  <!-- Campo de texto para el nombre del modelo -->
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="modelName" class="form-label">Nombre del Modelo</label>
                      <BFormInput
                          v-model="model.name"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del Modelo"
                          id="modelName"
                          required
                      />
                    </div>
                  </BCol>

                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/cargadores-company')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Crear Modelo de Cargador
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
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";

export default {
  data() {
    return {
      model: {
        name: '', // Campo para el nombre del modelo
      }
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async createChargerModel() {
      try {
        const response = await axios.post('https://app.evolgreen.com/api/charger-models', this.model);
        if (response.status === 200 || response.status === 201) {
          this.model.name = ''; // Limpiar el campo de texto
        }
        Swal.fire("Modelo Creado Exitosamente", "", "success").then(() => {
          this.$router.push('/company/crear-cargador');
        });
      } catch (error) {
        console.error("Error creando el modelo de cargador:", error);
        Swal.fire("Error al crear el modelo de cargador", "", "error")
      }
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
