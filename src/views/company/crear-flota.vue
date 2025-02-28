<template>
  <Layout>
    <PageHeader title="Crear Flota" />
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
                    placeholder="Ingrese el nombre de la flota"
                    id="flotaNombre"
                    required
                />
              </div>
            </BCol>
<!--            <BCol md="6">-->
<!--              <div class="mb-3">-->
<!--                <label for="precioFlota" class="form-label">Precio de la Flota</label>-->
<!--                <BFormInput-->
<!--                    v-model="precioFlota"-->
<!--                    type="number"-->
<!--                    class="form-control"-->
<!--                    placeholder="Ingrese el precio de la flota"-->
<!--                    id="precioFlota"-->
<!--                    required-->
<!--                />-->
<!--              </div>-->
<!--            </BCol>-->
          </BRow>
          <div class="d-flex justify-content-between">
            <BButton variant="light" @click="$router.push('/company/flotas')">
              Volver
            </BButton>
            <BButton style="" type="submit" variant="light" @click="createFlota">
              Crear
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
      flotaNombre: "", // Nombre de la flota
      precioFlota: 0, // Precio de la flota
    };
  },
  methods: {
    async createFlota() {
      if (!this.flotaNombre) {
        Swal.fire({
          icon: "warning",
          title: "Datos requeridos",
          text: "Por favor, ingrese un nombre y un precio válido para la flota",
        });
        return;
      }
      try {
        const response = await axios.post("http://localhost:8088/api/create-flota", {
          nombreFlota: this.flotaNombre,
          precioFlota: this.precioFlota,
        });

        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Flota creada exitosamente",
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.flotaNombre = "";
            this.precioFlota = 0;
            this.$router.push("/company/flotas"); // Redirige a la lista de flotas
          });
        }
      } catch (error) {
        console.error("Error al crear la flota:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al crear la flota. Por favor, inténtalo nuevamente.",
        });
      }
    },
  },
};
</script>
