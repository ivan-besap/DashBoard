<template>
    <Layout>
      <PageHeader title="Crear Mantenimiento" pagetitle="Forms" />
      <BRow>
        <BCol xxl="12">
          <BCard no-body>
            <CardHeader  />
            <BCardBody>
              <div class="live-preview">
                <BForm @submit.prevent="createChargingStation">
                  
                  <BRow>
                    <BCol md="6">
                    <div class="mb-3">
                      <label for="employeeName" class="form-label">Descripción</label>
                      <BFormInput 
                     
                        type="text" 
                        class="form-control" 
                        placeholder="Descripción del mantenimiento" 
                        id="employeeName" 
                        required 
                      />
                    </div>
                  </BCol>
  
                    <BCol md="6">
                    <div class="mb-3">
                      <label for="StartleaveDate" class="form-label">Fecha Inicial</label>
                      <flat-pickr v-model="date" class="form-control"></flat-pickr>
                    </div>
                  
  
                    </BCol>
                    <BCol md="6">
  
                      <div class="mb-3">
                    <label for="EndleaveDate" class="form-label">Fecha Final</label>
  
                    <flat-pickr v-model="date1" class="form-control"></flat-pickr>
                  </div>
                      </BCol>
                      <BCol md="6">
                      <div class="mb-3">
                        <label for="horarioInicio" class="form-label">Horario de inicio</label>
                        <flat-pickr v-model="time3" :config="preloadingTime" class="form-control flatpickr-input">
                        </flat-pickr>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="mb-3">
                        <label for="horarioFin" class="form-label">Horario de fin</label>
                        <flat-pickr v-model="time3" :config="preloadingTime" class="form-control flatpickr-input">
                        </flat-pickr>
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
                  
                    
                   
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton style="background-color: #dfe4ea" type="submit" variant="light" @click="successmsg">
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
        chargingStation: {
          dayOfWeek: [],
          chargerType: '',
          planValue: 0.0
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
  
      successmsg() {
        Swal.fire("Tarifa creada!", "", "success");
      },
      async createChargingStation() {
        try {
          await axios.post('https://app.evolgreen.com:8080/api/company/current/chargingStations', this.chargingStation);
          // alert('Estación de carga creada exitosamente');
          this.resetForm();
        } catch (error) {
          console.error("Error creando la estación de carga:", error);
         // alert('Error creando la estación de carga');
        }
      },
      resetForm() {
        this.chargingStation = {
          dayOfWeek: [],
          chargerType: '',
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
  