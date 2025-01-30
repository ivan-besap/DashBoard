<script>
import { ref, reactive, watchEffect, onMounted } from "vue";
import Layout from "@/layouts/main.vue";
import { CountTo } from "vue3-count-to";
import getChartColorsArray from "@/common/getChartColorsArray";
import PageHeader from "@/components/page-header";
import axios from "axios";
import { basicLineChart, zoomableChart } from "../charts/apex/line/data";

export default {
  components: {
    CountTo,
    Layout,
    PageHeader
  },
  setup() {
    // Variables reactivas
    // Variables reactivas
    const empresa = ref(null);
    const totalEnergyConsumed = ref(0);
    const totalConnectors = ref(0);

    const loading = ref(0);
    const available = ref(0);
    const disconnected = ref(0);
    const suspended = ref(0);
    const finishing = ref(0);

    // Estado del gráfico de dona con los nuevos estados incluidos
    const donutChart = reactive({
      series: [0, 0, 0, 0, 0], // Ahora tiene 5 valores
      chartOptions: {
        chart: {
          height: 300,
          type: "donut",
        },
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: false, // Deshabilita los porcentajes
        },
        labels: ["Cargando", "Disponible", "Sin conexión", "Suspendido", "Finalizando"], // Nuevos labels
        colors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#00CFE8"], // Colores para cada estado
        annotations: {
          position: "front",
          texts: [
            {
              text: "Conectores",
              x: "50%",
              y: "45%",
              textAnchor: "middle",
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "bold",
              cssClass: "apexcharts-custom-annotation",
            },
            {
              text: "0", // Se actualizará dinámicamente
              x: "50%",
              y: "55%",
              textAnchor: "middle",
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "bold",
              cssClass: "apexcharts-custom-annotation",
            },
          ],
        },
      },
    });

    // Método para obtener conectores y actualizar los contadores
    const fetchConectores = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/connectors");
        const connectors = response.data;

        // Contar cada estado
        loading.value = connectors.filter(c => c.estadoConector === "OCCUPIED").length;
        available.value = connectors.filter(c => c.estadoConector === "CONNECTED").length;
        disconnected.value = connectors.filter(c => c.estadoConector === "DISCONNECTED").length;
        suspended.value = connectors.filter(c => c.estadoConector === "SUSPENDED").length;
        finishing.value = connectors.filter(c => c.estadoConector === "FINISHING").length;

        // Total de conectores
        totalConnectors.value = connectors.length;
        console.log("Total conectores:", totalConnectors.value);
      } catch (error) {
        console.error("Error al obtener los conectores:", error);
      }
    };

    // Método para obtener el consumo de energía
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/transactionInfo/chargePoints", {
          params: { empresaId: 1 }
        });
        totalEnergyConsumed.value = response.data.totalEnergyConsumed;
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    // 🟢 **watchEffect para actualizar el gráfico dinámicamente**
    watchEffect(() => {
      donutChart.series = [loading.value, available.value, disconnected.value, suspended.value, finishing.value];
      donutChart.chartOptions.annotations.texts[1].text = totalConnectors.value.toString();
    });

    // Cargar datos al iniciar
    onMounted(() => {
      fetchConectores();
      fetchEnergyData();
    });

    return {
      empresa,
      totalEnergyConsumed,
      donutChart,
      totalConnectors,
      basicLineChart,
      zoomableChart,
      series: [
        {
          name: "Ingresos",
          data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5, 20.2],
        },
        {
          name: "Energía",
          data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2],
        },
        {
          name: "Tiempo",
          data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 309,
          stacked: true,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "20%",
            borderRadius: 6,
          },
        },
        dataLabels: { enabled: false },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          fontWeight: 400,
          fontSize: "8px",
          offsetX: 0,
          offsetY: 0,
          markers: { width: 9, height: 9, radius: 4 },
        },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        grid: { show: false },
        colors: getChartColorsArray('["--vz-info", "--vz-warning", "--vz-primary"]'),
        xaxis: {
          categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          axisTicks: { show: false },
          axisBorder: { show: true, strokeDashArray: 1, height: 1, width: "100%", offsetX: 0, offsetY: 0 },
        },
        yaxis: { show: false },
        fill: { opacity: 1 },
      },
    };
  },
};
</script>


<template>
  <Layout>
    <PageHeader title="Dashboard" pageTitle="Compañía" />
    <BRow>
<!--      <BCol class="col-xl-4">-->
<!--        <BCard no-body>-->
<!--          <BRow class="g-0" style="    padding-bottom: 11px;" >-->
<!--            <BCol >-->
<!--              <BCardHeader>-->
<!--                <div class="text-end">-->
<!--                  <h5 class="card-title mb-0">Alarmas Diarias</h5>-->
<!--                </div>-->
<!--              </BCardHeader>-->
<!--              <BCardBody>-->
<!--                <div class="d-flex justify-content-between align-items-center mb-1">-->
<!--                  <RouterLink :to="{ name: 'Alarmas Diarias' }">-->
<!--                    <BButton variant="black" class="p-0" style="width: 25px; height: 25px;">-->
<!--                      <i class="mdi mdi-eye"></i>-->
<!--                    </BButton>-->
<!--                  </RouterLink>-->
<!--                  <p class="mb-0 text-end w-100">2 reinicios de cargadores</p>-->
<!--                </div>-->
<!--                <div class="d-flex justify-content-between align-items-center">-->
<!--                  <RouterLink :to="{ name: 'Errores por Conector' }">-->
<!--                    <BButton variant="black" class="p-0" style="width: 25px; height: 25px;">-->
<!--                      <i class="mdi mdi-eye"></i>-->
<!--                    </BButton>-->
<!--                  </RouterLink>-->
<!--                  <p class="mb-0 text-end w-100">0 errores de conector</p>-->
<!--                </div>-->
<!--              </BCardBody>-->
<!--            </BCol>-->

<!--          </BRow>-->
<!--        </BCard>-->
<!--      </BCol>-->
      <BCol class="col-xl-4">
        <BCard no-body>
          <BRow class="g-0" style="    padding-bottom: 21px;">
            <BCol >
              <BCardHeader>
                <div class="text-end">
                  <h5 class="card-title mb-0">Energía entregada diaria</h5>
                </div>
              </BCardHeader>
              <BCardBody>
                <div class="d-flex justify-content-between align-items-center mb-1">

                  <img src="../../assets/images/gas-station-fuel-svgrepo-com.svg" width="40px">

                  <p class="mb-0 w-40" style="font-size: 25px;">{{ totalEnergyConsumed }} kWh</p>
                </div>
              </BCardBody>
            </BCol>

          </BRow>
        </BCard>
      </BCol>
<!--      <BCol class="col-xl-4">-->
<!--        <BCard no-body>-->
<!--          <BRow class="g-0" style="    padding-bottom: 21px;">-->
<!--            <BCol >-->
<!--              <BCardHeader>-->
<!--                <div class="text-end">-->
<!--                  <h5 class="card-title mb-0">Energía entregada mensual</h5>-->
<!--                </div>-->
<!--              </BCardHeader>-->
<!--              <BCardBody>-->
<!--                <div class="d-flex justify-content-between align-items-center mb-1">-->
<!--                  <img src="../../assets/images/lightning-charge-fill-green.svg">-->


<!--                  <p class="mb-0 w-50" style="font-size: 25px;">{{ maxPower }} kW</p>-->
<!--                </div>-->

<!--              </BCardBody>-->
<!--            </BCol>-->

<!--          </BRow>-->
<!--        </BCard>-->
<!--      </BCol>-->
    </BRow>
    <BRow>
      <BCol lg="6">
        <BCard no-body>
          <BCardHeader>
            <BCardTitle class="mb-0">Energia Entregada Mensual</BCardTitle>
          </BCardHeader>
          <BCardBody>
            <apexchart class="apex-charts" height="350" dir="ltr" :series="basicLineChart.series"
              :options="basicLineChart.chartOptions"></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="6">
        <BCard no-body style="height: 430px;">
          <BCardHeader class="justify-content-between d-flex align-items-center">
            <BCardTitle>Estado de conectores</BCardTitle>

          </BCardHeader>
          <BCardBody>
            <apexchart class="apex-charts" height="300" dir="ltr" :series="donutChart.series"
                       :options="donutChart.chartOptions"></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
<!--    <BRow>-->
<!--      <BCol lg="12">-->
<!--        <BCard no-body>-->
<!--          <BCardHeader>-->
<!--            <BCardTitle class="mb-0">Potencia máxima diaria</BCardTitle>-->
<!--          </BCardHeader>-->
<!--          <BCardBody>-->
<!--            <apexchart class="apex-charts" height="350" dir="ltr" :series="zoomableChart.series"-->
<!--                       :options="zoomableChart.chartOptions"></apexchart>-->
<!--          </BCardBody>-->
<!--        </BCard>-->
<!--      </BCol>-->
<!--    </BRow>-->
    <BRow>
      <BCard no-body>
        <BCardHeader class="border-0 align-items-center d-flex">
          <BCardTitle class="mb-0 flex-grow-1">Datos Cargas Mensuales</BCardTitle>
         <!-- <div class="hstack gap-1">
            <BButton type="button" variant="soft-secondary" size="sm">ALL</BButton>
            <BButton type="button" variant="soft-secondary" size="sm">1M</BButton>
            <BButton type="button" variant="soft-secondary" size="sm">6M</BButton>
            <BButton type="button" variant="soft-primary" size="sm">1Y</BButton>
          </div>-->
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
                <p class="text-muted mb-0">Ingreso al mes actual</p>
              </div>
            </BCol>
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  <count-to :startVal='0' :endVal='1278' :duration='4000'></count-to>
                  <span>&nbsp;kWh</span>
                  <span class="text-success ms-1 fs-12"> 60%<i class="ri-arrow-right-up-line ms-1 align-middle"></i></span>
                </h5>
                <p class="text-muted mb-0">Energía entregada al mes</p>
              </div>
            </BCol>
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0 border-end-0">
                <h5 class="mb-1">
                  <count-to :startVal='0' :endVal='3' :duration='4000'></count-to>m
                  <count-to :startVal='0' :endVal='40' :duration='4000'></count-to>seg
                  <span class="text-success ms-1 fs-12"> 37%<i class="ri-arrow-right-up-line ms-1 align-middle"></i></span>
                </h5>
                <p class="text-muted mb-0">Tiempo Aproximado Por Carga</p>
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
  
    
  </Layout>
</template>
<style>
.apexcharts-custom-annotation {
  fill: #0c0c0c !important; /* Force the fill color */
}
</style>