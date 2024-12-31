<template>
  <Layout>
    <PageHeader title="Editar Mantenimiento" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Mantenimiento" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateMantenimiento">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="descripcion" class="form-label">Descripción</label>
                      <BFormInput
                          v-model="mantenimiento.descripcion"
                          type="text"
                          class="form-control"
                          placeholder="Descripción del mantenimiento"
                          id="descripcion"
                          required
                      />
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaInicio" class="form-label">Fecha Inicial</label>
                      <flat-pickr v-model="mantenimiento.fechaInicial" class="form-control" :config="dateConfig"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaFin" class="form-label">Fecha Final</label>
                      <flat-pickr v-model="mantenimiento.fechaFinal" class="form-control" :config="dateConfig"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horaInicio" class="form-label">Horario de Inicio</label>
                      <flat-pickr v-model="mantenimiento.horarioInicio" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horaFin" class="form-label">Horario de Fin</label>
                      <flat-pickr v-model="mantenimiento.horarioFin" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label class="form-label">Días de la semana</label>
                      <div class="dias-semana" style="display: flex; flex-wrap: wrap;">
                        <div v-for="day in daysOfWeek" :key="day.value" class="form-check me-3">
                          <input class="form-check-input" type="checkbox" :value="day.text" v-model="mantenimiento.diasDeLaSemana" :id="day.value">
                          <label class="form-check-label" :for="day.value">{{ day.text }}</label>
                        </div>
                      </div>
                    </div>
                  </BCol>

                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/mantenimientos')">
                        Volver
                      </BButton>
                      <BButton type="submit" variant="light">
                        Guardar
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
import flatPickr from "vue-flatpickr-component";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      mantenimiento: {
        descripcion: '',
        fechaInicial: '',
        fechaFinal: '',
        horarioInicio: '',
        horarioFin: '',
        diasDeLaSemana: []
      },
      timeConfig: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
      },
      dateConfig: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      daysOfWeek: [
        { value: 'lunes', text: 'Lunes' },
        { value: 'martes', text: 'Martes' },
        { value: 'miércoles', text: 'Miércoles' },
        { value: 'jueves', text: 'Jueves' },
        { value: 'viernes', text: 'Viernes' },
        { value: 'sábado', text: 'Sábado' },
        { value: 'domingo', text: 'Domingo' }
      ],
      mantenimientoId: this.$route.params.id  // Tomar el ID desde la URL
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    flatPickr
  },
  created() {
    this.loadMantenimientoData();
  },
  methods: {
    // Cargar los datos del mantenimiento existente
    async loadMantenimientoData() {
      try {
        const response = await axios.get(`https://app.evolgreen.com/api/mantenimiento/${this.mantenimientoId}`);
        this.mantenimiento = {
          descripcion: response.data.descripcion,
          fechaInicial: response.data.fechaInicial,
          fechaFinal: response.data.fechaFinal,
          horarioInicio: response.data.horarioInicio,
          horarioFin: response.data.horarioFin,
          diasDeLaSemana: response.data.diasDeLaSemana
        };
      } catch (error) {
        console.error("Error cargando el mantenimiento:", error);
      }
    },
    // Actualizar el mantenimiento existente
    async updateMantenimiento() {
      try {
        await axios.put(`https://app.evolgreen.com/api/mantenimiento/${this.mantenimientoId}`, this.mantenimiento);
        Swal.fire("Mantenimiento actualizado exitosamente!", "", "success");
        this.$router.push('/company/mantenimientos');
      } catch (error) {
        console.error("Error actualizando el mantenimiento:", error);
        Swal.fire("Error al actualizar el mantenimiento", "", "error");
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
