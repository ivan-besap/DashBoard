<template>
  <Layout>
    <PageHeader title="Crear Fabricante de Cargador" />

    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Fabricante de Cargador" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createManufacturer">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="name" class="form-label">Nombre del Fabricante</label>
                      <BFormInput
                          v-model="manufacturer.name"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del Fabricante"
                          id="name"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/crear-cargador')">Volver</BButton>
                      <BButton type="submit" variant="light">Crear Fabricante</BButton>
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
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  data() {
    return {
      manufacturer: {
        name: ''
      }
    };
  },
  methods: {
    async createManufacturer() {
      try {
        const response = await axios.post('http://localhost:8088/api/charger-manufacturers', this.manufacturer);
        if (response.status === 200 || response.status === 201) {
          Swal.fire("Fabricante Creado Exitosamente", "", "success").then(() => {
            this.$router.push('/company/crear-cargador');
          });
        }
      } catch (error) {
        console.error("Error creando el fabricante:", error);
        Swal.fire("Error al crear el fabricante", "", "error");
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
