<template>
  <Layout>
    <PageHeader title="Editar Modelo" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Modelo" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateModel">

                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombreModelo" class="form-label">Nombre</label>
                      <BFormInput
                          v-model="model.name"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del modelo"
                          id="nombreModelo"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/charger-models')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Actualizar Modelo
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
import "flatpickr/dist/flatpickr.css";
import "@vueform/multiselect/themes/default.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      model: {
        name: '',
      },
      modelId: this.$route.params.id,
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async loadModel() {
      try {
        const response = await axios.get(`https://app.evolgreen.com/api/models/${this.modelId}`);
        this.model = response.data;
      } catch (error) {
        console.error("Error cargando el modelo:", error);
      }
    },
    async updateModel() {
      try {
        await axios.put(`https://app.evolgreen.com/api/models/${this.modelId}`, this.model);
        Swal.fire("Modelo Actualizado!", "", "success").then(() => {
          this.$router.push('/company/charger-models');
        });
      } catch (error) {
        console.error("Error actualizando el modelo:", error);
        Swal.fire("Error actualizando el modelo", "", "error");
      }
    }
  },
  created() {
    this.loadModel();
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
