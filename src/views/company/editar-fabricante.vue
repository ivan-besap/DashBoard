<template>
  <Layout>
    <PageHeader title="Editar Fabricante" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Fabricante" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateManufacturer">

                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombreFabricante" class="form-label">Nombre</label>
                      <BFormInput
                          v-model="manufacturer.name"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del fabricante"
                          id="nombreFabricante"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/charger-manufacturer')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Actualizar Fabricante
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
      manufacturer: {
        name: '',
      },
      manufacturerId: this.$route.params.id,
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
  },
  methods: {
    async loadManufacturer() {
      try {
        const response = await axios.get(`http://localhost:8088/api/manufacturers/${this.manufacturerId}`);
        this.manufacturer = response.data;
      } catch (error) {
        console.error("Error cargando el fabricante:", error);
      }
    },
    async updateManufacturer() {
      try {
        await axios.put(`http://localhost:8088/api/manufacturers/${this.manufacturerId}`, this.manufacturer);
        Swal.fire("Fabricante Actualizado!", "", "success").then(() => {
          this.$router.push('/company/charger-manufacturer');
        });
      } catch (error) {
        console.error("Error actualizando el fabricante:", error);
        Swal.fire("Error actualizando el fabricante", "", "error");
      }
    }
  },
  created() {
    this.loadManufacturer();
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
