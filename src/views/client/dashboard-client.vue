<script>
import Layout from "@/layouts/main.vue";
import {CountTo} from "vue3-count-to";
import getChartColorsArray from "@/common/getChartColorsArray";
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
  components: {
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
                    <strong><span class="fs-6" style="color: gray">Tiempo</span></strong>
                    <div class="sub-text fs-6">5:21 <span style="color: #6ae4a7;">h</span></div>
                  </div>
                  <div class="text-column">
                    <strong><span class="fs-6" style="color: gray">Batería</span></strong>
                    <div class="sub-text fs-6">88 <span style="color: #6ae4a7;">%</span></div>
                  </div>
                  <div class="text-column">
                    <strong><span class="fs-6" style="color: gray">Voltaje</span></strong>
                    <div class="sub-text fs-6">50 <span style="color: #6ae4a7;">V</span></div>
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
          <BCardTitle class="mb-0 flex-grow-1">Cargas Mensuales</BCardTitle>
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
                  <count-to :startVal='0' :endVal='3' :duration='4000'></count-to>m
                  <count-to :startVal='0' :endVal='40' :duration='4000'></count-to>seg
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
      <BCard no-body>
        <BCardTitle class="mb-3 mt-3 flex-grow-1">Estaciones Visitadas</BCardTitle>
        <BCol sm="12">
          <BCard no-body>
            <BRow class="g-0">
              <BCol md="4">
                <img class="rounded-start img-fluid h-100 object-fit-cover"
                     src="https://img.remediosdigitales.com/a4e9df/electrify-america-chargers-by-btc-power/450_1000.jpg" alt="Card image" />
              </BCol>
              <BCol md="8">
                <BCardHeader>
                  <h5 class="card-title mb-0">Estacion Clinica Vitacura</h5>
                </BCardHeader>
                <BCardBody>
                  <BCardBody class="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <p class="card-text mb-2">Puertos Disponibles: 10</p>
                      <p class="card-text mb-2">Empresa: EvolGreen</p>
                      <p class="card-text mb-2">Tipos de Conector: 4</p>
                      <p class="card-text mb-2">Reserva: Disponible</p>
                      <p class="card-text mb-2">Auto: Compatible</p>
                      <p class="card-text">
                        <small class="text-muted">Última carga hace 3 minutos</small>
                      </p>
                    </div>
                    <div class="text-end mt-2">
                      <BButton pill variant="success" class="waves-effect waves-light btn-lg" style="color: black; font-weight: bold;">Reserva Ahora</BButton>
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
                     src="https://www.reasonwhy.es/media/library/carga-coches-electricos.jpg" alt="Card image" />
              </BCol>
              <BCol md="8">
                <BCardHeader>
                  <h5 class="card-title mb-0">Estacion Viña del Mar</h5>
                </BCardHeader>
                <BCardBody>
                  <BCardBody>
                    <div>
                      <p class="card-text mb-2">Puertos Disponibles: 18</p>
                      <p class="card-text mb-2">Empresa: EvolGreen</p>
                      <p class="card-text mb-2">Tipos de Conector: 2</p>
                      <p class="card-text mb-2">Reserva: Disponible</p>
                      <p class="card-text mb-2">Auto: Compatible</p>
                      <p class="card-text">
                        <small class="text-muted">Última carga hace 1 día</small>
                      </p>
                    </div>
                    <div class="text-end mt-2">
                      <BButton pill variant="success" class="waves-effect waves-light btn-lg" style="color: black; font-weight: bold;">Reserva Ahora</BButton>
                    </div>
                  </BCardBody>
                </BCardBody>
              </BCol>
            </BRow>
          </BCard>
        </BCol>
      </BCard>
    </BRow>
  </Layout>
</template>