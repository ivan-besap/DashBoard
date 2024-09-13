<template>
  <Layout>
    <PageHeader title="Actualizar Tarifas" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Actualizar Tarifa" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateTarifa">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombreTarifa" class="form-label">Nombre Tarifa</label>
                      <BFormInput
                          v-model="tarifa.nombreTarifa"
                          type="text"
                          class="form-control"
                          placeholder="Nombre de la Tarifa"
                          id="nombreTarifa"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="startDate" class="form-label">Fecha Inicial</label>
                      <flat-pickr v-model="tarifa.fechaInicio" class="form-control"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="endDate" class="form-label">Fecha Final</label>
                      <flat-pickr v-model="tarifa.fechaFin" class="form-control"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="startTime" class="form-label">Horario de Inicio</label>
                      <flat-pickr v-model="tarifa.horaInicio" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="endTime" class="form-label">Horario de Fin</label>
                      <flat-pickr v-model="tarifa.horaFin" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label class="form-label">Día de la Semana</label>
                      <div class="dias-semana" style="display: flex;">
                        <div v-for="day in daysOfWeek" :key="day.value" class="form-check">
                          <input
                              class="form-check-input"
                              type="checkbox"
                              :value="day.value"
                              v-model="tarifa.diasDeLaSemana"
                              :checked="tarifa.diasDeLaSemana.includes(day.value)"
                              :id="day.value"
                          />
                          <label class="form-check-label" :for="day.value">{{ day.text }}</label>
                        </div>
                      </div>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="precioTarifa" class="form-label">Valor Tarifa</label>
                      <BFormInput
                          v-model="tarifa.precioTarifa"
                          type="number"
                          step="0.01"
                          class="form-control"
                          placeholder="Valor de la Tarifa"
                          id="precioTarifa"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('/company/tarifas')">
                        Volver
                      </BButton>
                      <BButton type="submit" variant="light">
                        Actualizar
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
import "flatpickr/dist/flatpickr.css";
import flatPickr from "vue-flatpickr-component";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import CardHeader from "@/common/card-header";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      tarifa: {
        nombreTarifa: '',
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        diasDeLaSemana: [],
        precioTarifa: 0
      },
      timeConfig: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
      },
      daysOfWeek: [
        { value: 'Lunes', text: 'Lunes' },
        { value: 'Martes', text: 'Martes' },
        { value: 'Miércoles', text: 'Miércoles' },
        { value: 'Jueves', text: 'Jueves' },
        { value: 'Viernes', text: 'Viernes' },
        { value: 'Sábado', text: 'Sábado' },
        { value: 'Domingo', text: 'Domingo' }
      ],
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    flatPickr
  },
  methods: {
    fetchTarifa() {
      const id = this.$route.params.id; // Obteniendo el ID de la tarifa desde la ruta
      axios.get(`http://localhost:8080/api/fees/${id}`).then(response => {
        this.tarifa = response.data;
      }).catch(error => {
        console.error("Error al obtener la tarifa:", error);
      });
    },
    updateTarifa() {
      const id = this.$route.params.id; // ID de la tarifa desde la ruta
      axios.put(`http://localhost:8080/api/fees/${id}`, this.tarifa)
          .then(() => {
            Swal.fire("Tarifa actualizada con éxito", "", "success");
            this.$router.push('/company/tarifas');
          })
          .catch(error => {
            console.error("Error al actualizar la tarifa:", error);
            Swal.fire("Error al actualizar la tarifa", "", "error");
          });
    }
  },
  created() {
    this.fetchTarifa();
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
