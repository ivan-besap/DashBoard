<template>
  <Layout>
    <PageHeader title="Crear Tarifas" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Crear Tarifas" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="createTarifa">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="nombreTarifa" class="form-label">Nombre Tarifa</label>
                      <BFormInput
                          v-model="tarifa.nombreTarifa"
                          type="text"
                          class="form-control"
                          placeholder="Nombre Tarifa"
                          id="nombreTarifa"
                          required
                      />
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaInicio" class="form-label">Fecha Inicial</label>
                      <flat-pickr v-model="tarifa.fechaInicio" class="form-control" :config="dateConfig"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="fechaFin" class="form-label">Fecha Final</label>
                      <flat-pickr v-model="tarifa.fechaFin" class="form-control" :config="dateConfig"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horaInicio" class="form-label">Horario de Inicio</label>
                      <flat-pickr v-model="tarifa.horaInicio" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horaFin" class="form-label">Horario de Fin</label>
                      <flat-pickr v-model="tarifa.horaFin" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>

                  <BCol md="6">
                    <div class="mb-3">
                      <label class="form-label">Días de la semana</label>
                      <div class="dias-semana" style="display: flex; flex-wrap: wrap;">
                        <div v-for="day in daysOfWeek" :key="day.value" class="form-check me-3">
                          <input class="form-check-input" type="checkbox" :value="day.text" v-model="tarifa.diasDeLaSemana" :id="day.value">
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
                          placeholder="Precio Tarifa"
                          id="precioTarifa"
                          required
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="consumoEnergiaAlarma" class="form-label">Consumo de Energía para Alarma Crítica</label>
                      <BFormInput
                          v-model="tarifa.consumoDeEnergiaAlarma"
                          type="text"
                          class="form-control"
                          placeholder="Consumo de energía crítica"
                          id="consumoEnergiaAlarma"
                      />
                    </div>
                  </BCol>

                  <BCol lg="12">
                    <div class="d-flex justify-content-between">
                      <BButton variant="light" @click="$router.push('https://app.evolgreen.com:8088/api/company/tarifas')">
                        Volver
                      </BButton>
                      <BButton style="" type="submit" variant="light">
                        Crear Tarifa
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
      tarifa: {
        nombreTarifa: '',
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        diasDeLaSemana: [],
        precioTarifa: 0.0,
        consumoDeEnergiaAlarma: ''
      },
      dateConfig: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      timeConfig: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
      },
      daysOfWeek: [
        { value: 'lunes', text: 'Lunes' },
        { value: 'martes', text: 'Martes' },
        { value: 'miércoles', text: 'Miércoles' },
        { value: 'jueves', text: 'Jueves' },
        { value: 'viernes', text: 'Viernes' },
        { value: 'sábado', text: 'Sábado' },
        { value: 'domingo', text: 'Domingo' }
      ]
    };
  },
  components: {
    Layout,
    PageHeader,
    CardHeader,
    flatPickr
  },
  methods: {
    successmsg() {
      Swal.fire({
        title: "Tarifa creada!",
        text: "Redirigiendo a la página de Tarifas...",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('https://app.evolgreen.com:8088/api/company/tarifas');
        }
      });
    },
    async createTarifa() {
      if (this.tarifa.consumoDeEnergiaAlarma === '') {
        this.tarifa.consumoDeEnergiaAlarma = null;
      }
      try {
        await axios.post('https://app.evolgreen.com:8088/api/fees', this.tarifa);
        this.successmsg();
      } catch (error) {
        console.error("Error creando la tarifa:", error);
        Swal.fire("Error", "No se pudo crear la tarifa.", "error");
      }
    },
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
