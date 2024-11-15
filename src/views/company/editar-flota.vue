<template>
  <Layout>
    <PageHeader title="Editar Flota" pageTitle="Compañía" />
    <BRow>
      <BCard no-body class="card-body">
        <BCardBody>
          <BRow>
            <BCol md="6">
              <div class="mb-3">
                <label for="flotaNombre" class="form-label">Nombre de la Flota</label>
                <BFormInput
                    v-model="flotaNombre"
                    type="text"
                    class="form-control"
                    placeholder="Ingrese el nuevo nombre de la flota"
                    id="flotaNombre"
                    required
                />
              </div>
            </BCol>
            <BCol md="6">
              <div class="mb-3">
                <label for="precioFlota" class="form-label">Precio de la Flota</label>
                <BFormInput
                    v-model="precioFlota"
                    type="number"
                    class="form-control"
                    placeholder="Ingrese el precio de la flota"
                    id="precioFlota"
                    required
                />
              </div>
            </BCol>
          </BRow>
          <div class="d-flex justify-content-end">
            <BButton style="" type="submit" variant="light" @click="updateFlota">
              Guardar Cambios
            </BButton>
          </div>
        </BCardBody>
      </BCard>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      flotaNombre: "",
      precioFlota: 0,
      flotaId: this.$route.params.id,
    };
  },
  mounted() {
    this.fetchFlota();
  },
  methods: {
    async fetchFlota() {
      try {
        const response = await axios.get(`https://app.evolgreen.com/api/flotas/${this.flotaId}`);
        this.flotaNombre = response.data.nombreFlota;
        this.precioFlota = response.data.precioFlota;
      } catch (error) {
        console.error("Error al obtener los datos de la flota:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al obtener los datos de la flota. Por favor, inténtalo nuevamente.",
        });
      }
    },
    async updateFlota() {
      if (!this.flotaNombre || this.precioFlota <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Datos requeridos",
          text: "Por favor, ingrese un nombre y un precio válido para la flota",
        });
        return;
      }
      try {
        const response = await axios.put(`https://app.evolgreen.com/api/flotas/${this.flotaId}`, {
          nombreFlota: this.flotaNombre,
          precioFlota: this.precioFlota,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Flota actualizada exitosamente",
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.$router.push("/company/flotas");
          });
        }
      } catch (error) {
        console.error("Error al actualizar la flota:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al actualizar la flota. Por favor, inténtalo nuevamente.",
        });
      }
    },
  },
};
</script>
