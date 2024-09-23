<template>
  <Layout>
    <PageHeader title="Actualizar Plan" pagetitle="Forms" />
    <BRow>
      <BCol xxl="12">
        <BCard no-body>
          <CardHeader title="Editar Plan" />
          <BCardBody>
            <div class="live-preview">
              <BForm @submit.prevent="updateChargingStation">
                <BRow>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="StartleaveDate" class="form-label">Fecha Inicial</label>
                      <flat-pickr v-model="date" class="form-control" :config="rangeDateconfig"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="EndleaveDate" class="form-label">Fecha Final</label>
                      <flat-pickr v-model="date1" class="form-control" :config="rangeDateconfig"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horarioInicio" class="form-label">Horario de inicio</label>
                      <flat-pickr v-model="chargingStation.startTime" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="horarioFin" class="form-label">Horario de fin</label>
                      <flat-pickr v-model="chargingStation.endTime" :config="timeConfig" class="form-control flatpickr-input"></flat-pickr>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="saldoEnergia" class="form-label">Limite Energía Kw</label>
                      <BFormInput 
                        v-model="chargingStation.currentLoad" 
                        type="number" 
                        step="0.01" 
                        class="form-control" 
                        placeholder="0.0" 
                        id="saldoEnergia" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="plan" class="form-label">Nombre Plan</label>
                      <BFormInput 
                        v-model="chargingStation.plan" 
                        type="text" 
                        class="form-control" 
                        placeholder="Plan" 
                        id="plan" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label class="form-label">Día de la semana</label>
                      <div class="dias-semana" style="display: flex; ">
                        <div v-for="day in daysOfWeek" :key="day.value" class="form-check">
                          <input class="form-check-input" type="checkbox" :value="day.value" v-model="chargingStation.dayOfWeek" :id="day.value">
                          <label class="form-check-label" :for="day.value">{{ day.text }}</label>
                        </div>
                      </div>
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="tipoCargador" class="form-label">Tipo Conector</label>
                      <BFormSelect 
                        v-model="chargingStation.chargerType" 
                        :options="chargerTypes" 
                        id="tipoCargador" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="potencia" class="form-label">Potencia</label>
                      <BFormInput 
                        v-model="chargingStation.power" 
                        type="number" 
                        step="0.01" 
                        class="form-control" 
                        placeholder="Potencia" 
                        id="potencia" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="kwh" class="form-label">KWH</label>
                      <BFormInput 
                        v-model="chargingStation.kwh" 
                        type="number" 
                        step="0.01" 
                        class="form-control" 
                        placeholder="KWH" 
                        id="kwh" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="minutos" class="form-label">Minutos</label>
                      <BFormInput 
                        v-model="chargingStation.minutes" 
                        type="number" 
                        class="form-control" 
                        placeholder="Minutos" 
                        id="minutos" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="descuento" class="form-label">Descuento</label>
                      <BFormInput 
                        v-model="chargingStation.discount" 
                        type="number" 
                        step="0.01" 
                        class="form-control" 
                        placeholder="Descuento" 
                        id="descuento" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol md="6">
                    <div class="mb-3">
                      <label for="valorPlan" class="form-label">Valor Plan</label>
                      <BFormInput 
                        v-model="chargingStation.planValue" 
                        type="number" 
                        step="0.01" 
                        class="form-control" 
                        placeholder="Valor Plan" 
                        id="valorPlan" 
                        required 
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="text-end">
                      <BButton type="submit" variant="primary" @click="updateChargingStation">
                        Actualizar Plan
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

export default {
  data() {
    return {
      chargingStation: {
        name: '',
        currentLoad: 0.0,
        plan: 'Plan 1',
        period: '01/01 - 01/31',
        dayOfWeek: ['lunes', 'martes'],
        startTime: '09:00',
        endTime: '14:00',
        chargerType: 'AC',
        power: 22.0,
        locationCPO: 'Ubicación A',
        kwh: 100.0,
        minutes: 60,
        discount: 10.0,
        planValue: 200.0
      },
      date: '01/01/2024',
      date1: '01/31/2024',
      time3: '',
      config: {
        wrap: true, 
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
      },
      rangeDateconfig: {
        mode: "range",
        dateFormat: "d M, Y",
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
      ],
      chargerTypes: [
        { value: 'AC', text: 'AC' },
        { value: 'DC', text: 'DC' }
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
    updateChargingStation() {
      // Mostrar el mensaje de éxito y redirigir
      this.successmsg(); 
    },
    successmsg() {
      Swal.fire({
        title: "Plan actualizado!",
        text: "Redirigiendo a la página de planes...",
        icon: "success",
        timer: 2000, // Tiempo en milisegundos antes de redirigir
        timerProgressBar: true,
        willClose: () => {
          this.$router.push('https://app.evolgreen.com:8088/api/company/plan-company'); // Redirigir a la página de planes
        }
      });
    },
    resetForm() {
      this.chargingStation = {
        name: '',
        currentLoad: 0.0,
        plan: '',
        period: '',
        dayOfWeek: [],
        startTime: '',
        endTime: '',
        chargerType: '',
        power: 0.0,
        locationCPO: '',
        kwh: 0.0,
        minutes: 0,
        discount: 0.0,
        planValue: 0.0
      };
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}
</style>
