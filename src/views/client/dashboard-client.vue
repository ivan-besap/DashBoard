<script>
import Layout from "@/layouts/main.vue";
import {CountTo} from "vue3-count-to";
import getChartColorsArray from "@/common/getChartColorsArray";
import flatPickr from "vue-flatpickr-component";
import axios from "axios";
import moment from 'moment';
import {columnDatalabelChart} from "@/views/charts/apex/column/data";
/*import PageHeader from "@/components/page-header";*/

export default {
  setup() {
    return {
      series: [{
        name: "Potencia Cargada",
        data: [
          25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5,
          20.2,
        ],
      },
        {
          name: "Tiempo De Carga",
          data: [
            36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4,
            38.2,
          ],
        },
        {
          name: "Costo De Carga",
          data: [
            36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4,
            38.2,
          ],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 309,
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "20%",
            borderRadius: 6,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          fontWeight: 400,
          fontSize: "8px",
          offsetX: 0,
          offsetY: 0,
          markers: {
            width: 9,
            height: 9,
            radius: 4,
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        grid: {
          show: false,
        },
        colors: getChartColorsArray('["--vz-info", "--vz-warning", "--vz-primary"]'),
        xaxis: {
          categories: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
          ],
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: true,
            strokeDashArray: 1,
            height: 1,
            width: "100%",
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
      },
    };
  },
  data(){
    return{
      columnDatalabelChart: columnDatalabelChart,
      modalShow2: false,
      date1: null,
      client: null,
      chargers: [],
      connectors: [],
      selectedChargerId: null,
      selectedConnectorId: null,
      dateTimeConfig: {
        enableTime: true,
        dateFormat: "d-m-y H:i",
      }
    }
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get('http://localhost:8088/api/clients/current');
        this.client = response.data;
        this.populateChargers();
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    },
    populateChargers() {
      if (this.client && this.client.account.length > 0) {
        const chargingStations = this.client.account[0].chargingStations;
        if (chargingStations.length > 0) {
          this.chargers = chargingStations[0].chargers;
        }
      }
    },
    updateConnectors(chargerId) {
      const selectedCharger = this.chargers.find(charger => charger.id === chargerId);
      if (selectedCharger) {
        this.connectors = selectedCharger.connectors;
      } else {
        this.connectors = [];
      }
    },
    async reserve() {
      if (!this.selectedChargerId || !this.selectedConnectorId || !this.date1) {
        alert("Please select charger, connector and date");
        return;
      }

      const dateFormateada = this.date1;

      // Convert the user-friendly date to ISO-8601 format
      const isoDate = moment(dateFormateada, "DD-MM-YY HH:mm").toISOString();

      const reservationRequest = {
        chargerId: this.selectedChargerId,
        connectorId: this.selectedConnectorId,
        startTime: isoDate,  // Use the ISO-8601 formatted date
      };


      try {
        await axios.post('http://localhost:8088/api/reservations', reservationRequest);
        alert('Reservación creada con éxito!');
      } catch (error) {
        console.error('Error creating reservation:', error);
        alert('Error al crear la reservación , intente nuevamente!');
      } finally {
        this.resetForm();  // Reset form fields
        this.modalShow2 = false  // Close the modal in both success and error cases
    }
    },
    resetForm() {
      this.selectedChargerId = null;
      this.selectedConnectorId = null;
      this.date1 = null;
    }
  },
  mounted() {
    this.getUser();
  },
  watch: {
    selectedChargerId(newVal) {
      this.updateConnectors(newVal);
    },
  },
  components: {
    flatPickr,
    CountTo,
    Layout
  }
};
</script>
    
<template>
  <Layout>
    <BRow>
      <BCol cols="12">
        <BRow>
          <BCol lg="12">
            <BCard no-body>
              <BCardBody>
                <h6 class="card-title d-flex justify-content-between align-items-center mb-4">
                  EV Autos
                  <span class="fs-6">Tesla X</span>
                </h6>
                <div class="d-flex justify-content-between mb-4">
                  <div class="text-column">
                    <strong><span class="fs-6" style="color: gray">Tiempo Restante</span></strong>
                    <div class="sub-text fs-6">28:21 <span style="color: #6ae4a7;">min</span></div>
                  </div>
                  <div class="text-column">
                    <strong><span class="fs-6" style="color: gray">Batería</span></strong>
                    <div class="sub-text fs-6">88 <span style="color: #6ae4a7;">%</span></div>
                  </div>
                  <div class="text-column">
                    <strong><span class="fs-6" style="color: gray">Potencia</span></strong>
                    <div class="sub-text fs-6">50 <span style="color: #6ae4a7;">kW</span></div>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-2" style="color: #6ae4a7">
                  <i class="mdi mdi-flash"></i> <!-- Icono de rayo de Material Design Icons -->
                  <span class="fs-6">Cargando</span>
                </div>
                <BProgress striped animated :value="70" variant="success" style="height: 50px"></BProgress>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
      </BCol>
    </BRow>
    <BRow>
      <BCard no-body>
        <BCardHeader class="border-0 align-items-center d-flex">
          <BCardTitle class="mb-0 flex-grow-1">Carga Anual</BCardTitle>
          <div class="hstack gap-1">
            <BButton type="button" variant="soft-secondary" size="sm">ALL</BButton>
            <BButton type="button" variant="soft-secondary" size="sm">1M</BButton>
            <BButton type="button" variant="soft-secondary" size="sm">6M</BButton>
            <BButton type="button" variant="soft-primary" size="sm">1Y</BButton>
          </div>
        </BCardHeader>
        <BCardHeader class="p-0 border-0 bg-light-subtle">
          <BRow class="g-0 text-center">
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  <span>&nbsp;$</span>
                  <count-to :startVal='0' :endVal='854' :duration='5000'></count-to>
                  <span class="text-success ms-1 fs-12"> 49%<i class="ri-arrow-right-up-line ms-1 align-middle"></i></span>
                </h5>
                <p class="text-muted mb-0">Costo Mensual promedio</p>
              </div>
            </BCol>
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  <count-to :startVal='0' :endVal='1278' :duration='4000'></count-to>
                  <span>&nbsp;kWh</span>
                  <span class="text-success ms-1 fs-12"> 60%<i class="ri-arrow-right-up-line ms-1 align-middle"></i></span>
                </h5>
                <p class="text-muted mb-0">Potencia Cargada Promedio</p>
              </div>
            </BCol>
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0 border-end-0">
                <h5 class="mb-1">
                  <count-to :startVal='0' :endVal='40' :duration='4000'></count-to>m
                  <count-to :startVal='0' :endVal='55' :duration='4000'></count-to>seg
                  <span class="text-success ms-1 fs-12"> 37%<i class="ri-arrow-right-up-line ms-1 align-middle"></i></span>
                </h5>
                <p class="text-muted mb-0">Duración Aproximada Por Carga</p>
              </div>
            </BCol>
          </BRow>
        </BCardHeader>
        <BCard-body class="p-0 pb-2">
          <div>
            <apexchart class="apex-charts" dir="ltr" :series="series" :options="chartOptions" height="309"></apexchart>
          </div>
        </BCard-body>
      </BCard>
    </BRow>
    <BRow>
      <BCol lg="12">
      <BCard no-body>
        <BCardHeader class="
              justify-content-between
              d-flex
              align-items-center
            ">
          <BCardTitle>Potencia Cargada Anual</BCardTitle>

        </BCardHeader>
        <BCardBody>
          <apexchart class="apex-charts" height="350" dir="ltr" :series="columnDatalabelChart.series"
                     :options="columnDatalabelChart.chartOptions"></apexchart>
        </BCardBody>
      </BCard>
    </BCol>
    </BRow>
    <BRow>
      <BCard no-body>
        <BCardTitle class="mb-2 mt-2 flex-grow-1" style="font-size: 1rem;">Estaciones Cercanas</BCardTitle>
        <BCol sm="12">
          <BCard no-body>
            <BRow class="g-0">
              <BCol md="4">
                <img class="rounded-start img-fluid h-100 object-fit-cover"
                     src="https://img.remediosdigitales.com/a4e9df/electrify-america-chargers-by-btc-power/450_1000.jpg" alt="Card image"
                     style="height: 120px;" />
              </BCol>
              <BCol md="8">
                <BCardHeader style="padding: 0.5rem;">
                  <h5 class="card-title mb-0" style="font-size: 1rem;">Estacion Clinica Vitacura</h5>
                </BCardHeader>
                <BCardBody style="padding: 0.5rem;">
                  <BCardBody class="flex-grow-1 d-flex flex-column justify-content-between" style="padding: 0.5rem;">
                    <div>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">Puertos Disponibles: 10</p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">Empresa: EvolGreen</p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                        Tipos de Carga:
                        <span style="color: #4b7dd3;">Normal</span> -
                        <span style="color: #2acfc0;">Rápida</span> -
                        <span style="color: #25dd8f;">Muy rápida</span>
                      </p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                      Reserva:
                      <span style="color: #25dd8f;">Disponible</span>
                    </p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                        Conectores:
                        <ul class="ms-3" style="list-style-type: none; padding-left: 0;">
                          <li>
                            <span style="color: #25dd8f;">Chademo</span>
                            <span> - Precio: <span style="color: #25dd8f;">$210</span></span>
                            <span> - Potencia: <span style="color: #25dd8f;">45 kWh</span></span>
                          </li>
                          <li>
                            <span style="color: #25dd8f;">Tipo 2</span>
                            <span> - Precio: <span style="color: #25dd8f;">$250</span></span>
                            <span> - Potencia: <span style="color: #25dd8f;">60 kWh</span></span>
                          </li>
                        </ul>
                      </p>
                      <p class="card-text" style="font-size: 0.75rem;">
                        <small class="text-muted">Última carga hace 3 minutos</small>
                      </p>
                    </div>
                    <div class="text-end mt-1">
                      <BButton pill variant="success" @click="modalShow2 = !modalShow2" class="waves-effect waves-light btn-lg" style="color: black; font-weight: bold; font-size: 1rem; ">Reserva Ahora</BButton>
                    </div>
                  </BCardBody>
                </BCardBody>
              </BCol>
            </BRow>
          </BCard>
        </BCol>

        <BCol sm="12">
          <BCard no-body>
            <BRow class="g-0">
              <BCol md="4">
                <img class="rounded-start img-fluid h-100 object-fit-cover"
                     src="https://www.reasonwhy.es/media/library/carga-coches-electricos.jpg" alt="Card image"
                     style="height: 120px;" />
              </BCol>
              <BCol md="8">
                <BCardHeader style="padding: 0.5rem;">
                  <h5 class="card-title mb-0" style="font-size: 1rem;">Estacion Viña del Mar</h5>
                </BCardHeader>
                <BCardBody style="padding: 0.5rem;">
                  <BCardBody class="flex-grow-1 d-flex flex-column justify-content-between" style="padding: 0.5rem;">
                    <div>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">Puertos Disponibles: 18</p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">Empresa: EvolGreen</p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                        Tipos de Carga:
                        <span style="color: #4b7dd3;">Normal</span> -
                        <span style="color: #2acfc0;">Rápida</span>
                      </p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                        Reserva:
                        <span style="color: #25dd8f;">Disponible</span>
                      </p>
                      <p class="card-text mb-1" style="font-size: 0.875rem;">
                        Conectores:
                        <ul class="ms-3" style="list-style-type: none; padding-left: 0;">
<!--                          <li>
                            <span style="color: #25dd8f;">Chademo</span>
                            <span> - Precio: <span style="color: #25dd8f;">$200</span></span>
                            <span> - Potencia: <span style="color: #25dd8f;">45 kWh</span></span>
                          </li>-->
                          <li>
                            <span style="color: #25dd8f;">Tipo 2</span>
                            <span> - Precio: <span style="color: #25dd8f;">$230</span></span>
                            <span> - Potencia: <span style="color: #25dd8f;">60 kWh</span></span>
                          </li>
                        </ul>
                      </p>
                      <p class="card-text" style="font-size: 0.75rem;">
                        <small class="text-muted">Última carga hace 1 día</small>
                      </p>
                    </div>
                    <div class="text-end mt-1">
                      <BButton pill variant="success" @click="modalShow2 = !modalShow2" class="waves-effect waves-light btn-lg" style="color: black; font-weight: bold; font-size: 1rem;">Reserva Ahora</BButton>
                    </div>
                  </BCardBody>
                </BCardBody>
              </BCol>
            </BRow>
          </BCard>
        </BCol>
      </BCard>
    </BRow>
    <BModal v-model="modalShow2" hide-footer title="Solicitar Reserva" class="v-modal-custom">
      <form action="javascript:void(0);">
        <BRow>
          <BCol md="6">
            <label for="chargerSelect" class="form-label">Cargador</label>
            <select id="chargerSelect" class="form-select mb-3" v-model="selectedChargerId">
              <option v-for="charger in chargers" :key="charger.id" :value="charger.id">{{ charger.model }}</option>
            </select>
          </BCol>
          <BCol md="6">
            <label for="connectorSelect" class="form-label">Conector</label>
            <select id="connectorSelect" class="form-select mb-3" v-model="selectedConnectorId" :disabled="!selectedChargerId">
              <option v-for="connector in connectors" :key="connector.id" :value="connector.id">{{ connector.name }}</option>
            </select>
          </BCol>
          <BCol md="6">
            <div>
              <label class="form-label mb-0">Fecha Reserva</label>
              <flat-pickr v-model="date1" :config="dateTimeConfig" class="form-control"></flat-pickr>
            </div>
          </BCol>
          <BCol lg="12">
            <div class="hstack gap-2 justify-content-end">
              <BButton type="button" variant="light" @click="modalShow2 = false">
                Close</BButton>
              <BButton type="button" variant="success" @click="reserve">Reservar</BButton>
            </div>
          </BCol>
        </BRow>
      </form>
    </BModal>
  </Layout>
</template>