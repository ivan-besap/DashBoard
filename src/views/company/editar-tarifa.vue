<template>
    <Layout>
      <PageHeader title="Actualizar Tarifas" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader title="Crear Tarifas" />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="createChargingStation">
                  <BRow>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="StartleaveDate" class="form-label">Fecha Inicial</label>
                        <flat-pickr v-model="chargingStation.startDate" class="form-control"></flat-pickr>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="EndleaveDate" class="form-label">Fecha Final</label>
                        <flat-pickr v-model="chargingStation.endDate" class="form-control"></flat-pickr>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="horarioInicio" class="form-label">Horario de inicio</label>
                        <flat-pickr v-model="chargingStation.startTime" :config="preloadingTime" class="form-control flatpickr-input"></flat-pickr>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="horarioFin" class="form-label">Horario de fin</label>
                        <flat-pickr v-model="chargingStation.endTime" :config="preloadingTime" class="form-control flatpickr-input"></flat-pickr>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label class="form-label">Día de la semana</label>
                        <div class="dias-semana" style="display: flex;">
                          <div v-for="day in daysOfWeek" :key="day.value" class="form-check">
                            <input class="form-check-input" type="checkbox" :value="day.value" v-model="chargingStation.dayOfWeek" :id="day.value">
                            <label class="form-check-label" :for="day.value">{{ day.text }}</label>
                          </div>
                        </div>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="tipoCargador" class="form-label">Tipo Cargador</label>
                        <BFormSelect v-model="chargingStation.chargerType" :options="chargerTypes2" id="tipoCargador" required />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="tipoCargador" class="form-label">Tipo Conector</label>
                        <BFormSelect v-model="chargingStation.chargerType" :options="chargerTypes" id="tipoCargador" required />
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="valorPlan" class="form-label">Valor Tarifa</label>
                        <BFormInput v-model="chargingStation.planValue" type="number" step="0.01" class="form-control" placeholder="Valor Plan" id="valorPlan" required />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton style="background-color: #dfe4ea" type="submit" variant="light">
                          Actualizar Tarifa
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
          startDate: "2024-07-01",
          endDate: "2024-07-31",
          startTime: "08:00",
          endTime: "18:00",
          dayOfWeek: ['lunes', 'martes', 'miércoles'],
          chargerType: 'AC',
          planValue: 10.0
        },
        timeConfig: {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          time_24hr: true,
        },
        preloadingTime: {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          defaultDate: "13:00",
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
          { value: 'Chademo', text: 'Chademo' },
          { value: 'GBTA', text: 'GBTA' }
        ],
        chargerTypes2: [
          { value: 'Cargador1', text: 'Cargador1' },
          { value: 'Cargador2', text: 'Cargador2' }
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
      async createChargingStation() {
        try {
          // Simula una llamada de API exitosa
          setTimeout(() => {
            this.successmsg();
            this.$router.push('/company/tarifas');
          }, 1000); // Retraso de 1 segundo para simular la llamada
        } catch (error) {
          console.error("Error creando la estación de carga:", error);
        }
      },
      successmsg() {
        Swal.fire("Tarifa Actualizada!", "", "success");
      }
    }
  };
  </script>
  
  <style>
  .flex-shrink-0 {
    display: none;
  }
  </style>
  