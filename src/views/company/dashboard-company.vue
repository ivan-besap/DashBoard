<script>
import { ref, reactive, watchEffect, onMounted } from "vue";
import Layout from "@/layouts/main.vue";
import { CountTo } from "vue3-count-to";
import getChartColorsArray from "@/common/getChartColorsArray";
import PageHeader from "@/components/page-header";
import axios from "axios";
import { zoomableChart } from "../charts/apex/line/data";

export default {
  components: {
    CountTo,
    Layout,
    PageHeader
  },

  setup() {
    // Variables reactivas
    // Variables reactivas
    const mesActual = ref(null);
    const empresa = ref(null);
    const totalEnergyConsumed = ref(0);  // Energía total sin restricciones
    const dailyEnergyConsumed = ref(0);  // Energía consumida en el día actual
    const monthlyEnergyConsumed = ref(0);  // Energía acumulada en el mes actual
    const ingresoDiario = ref(0);  // Energía acumulada en el mes actual
    const costoTotal = ref(0);  // Costo total acumulado
    const costosMensuales = ref([]);  // Costos agrupados por mes
    const totalConnectors = ref(0);
    const porcentajeIngresoAcumulado = ref(0);
    const porcentajeIngresoDiario = ref(0);
    const porcentajeIngresoMensual = ref(0);
    const porcentajeTiempoDiario = ref(0);
    const porcentajeTiempoMensual = ref(0);
    const porcentajeTiempoAnual = ref(0);
    const promedioDiario = ref(0);
    const promedioAnual = ref(0);
    const tiempoMensual = ref(0);

    const loading = ref(0);
    const available = ref(0);
    const disconnected = ref(0);
    const suspended = ref(0);
    const finishing = ref(0);

    const mesIndex = new Date().getMonth();


    const obtenerMesActual = () => {
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const fecha = new Date();
      mesActual.value = meses[fecha.getMonth()];
    };

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

    const basicLineChart = reactive({
      series: [
        {
          name: "Energía Entregada",
          data: [], // Se llenará con los valores reales
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        markers: {
          size: 4,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        colors: getChartColorsArray('["--vz-primary"]'),
        title: {
          text: "KWh",
          align: "left",
          style: { fontWeight: 500 },
        },
        xaxis: {
          categories: [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
          ],
        },
      },
    });

    const reportChart = reactive({
      series: [
        { name: "Ingresos", data: Array(12).fill(0) },
      ],
      chartOptions: {
        chart: { type: "bar", height: 309, stacked: true, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: "20%", borderRadius: 6 } },
        dataLabels: { enabled: false },
        legend: {
          show: true, position: "bottom", horizontalAlign: "center",
          fontWeight: 400, fontSize: "8px",
          markers: { width: 9, height: 9, radius: 4 }
        },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        grid: { show: false },
        colors: getChartColorsArray('["--vz-info"]'),
        xaxis: {
          categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          axisTicks: { show: false },
          axisBorder: { show: true, strokeDashArray: 1, height: 1, width: "100%", offsetX: 0, offsetY: 0 },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return "$" + val.toLocaleString(); // Agrega signo de peso y formato con separador de miles
            },
            style: {
              colors: "#495057", // Color de los valores en el eje Y
              fontSize: "12px",
              fontWeight: 500,
            }
          },
        },
        fill: { opacity: 1 },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$" + val.toLocaleString(); // Agrega el signo de peso y formato con separador de miles
            }
          }
        }
      },
    });

    const reportChartTiempo = reactive({
      series: [{ name: "Tiempo Promedio", data: Array(12).fill(0) }],
      chartOptions: {
        chart: { type: "bar", height: 309, stacked: true, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: "20%", borderRadius: 6 } },
        dataLabels: { enabled: false },
        legend: {
          show: true, position: "bottom", horizontalAlign: "center",
          fontWeight: 400, fontSize: "8px",
          markers: { width: 9, height: 9, radius: 4 }
        },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        grid: { show: false },
        colors: getChartColorsArray('["--vz-warning"]'),
        xaxis: {
          categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          axisTicks: { show: false },
          axisBorder: { show: true, strokeDashArray: 1, height: 1, width: "100%", offsetX: 0, offsetY: 0 },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return formatoTiempo(val); // Convierte los valores en segundos a formato legible
            },
            style: {
              colors: "#495057",
              fontSize: "12px",
              fontWeight: 500,
            }
          },
        },
        fill: { opacity: 1 },
        tooltip: {
          y: {
            formatter: function (val) {
              return formatoTiempo(val); // Convierte los valores en segundos para el tooltip
            }
          }
        }
      }
    });

    const formatoTiempo = (segundos) => {
      if (segundos < 60) return `${segundos}s`; // Solo segundos

      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const segs = segundos % 60;

      if (horas > 0) {
        return `${horas}h ${minutos}m ${segs}s`; // Formato completo con horas
      } else if (minutos > 0) {
        return `${minutos}m ${segs}s`; // Formato sin horas
      } else {
        return `${segs}s`; // Solo segundos
      }
    };

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
      } catch (error) {
        console.error("Error al obtener los conectores:", error);
      }
    };

    // Método para obtener el consumo de energía
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/transactionInfo/chargePoints", {
          params: { empresaId: 1 },
        });

        totalEnergyConsumed.value = response.data.totalEnergyConsumed;
        dailyEnergyConsumed.value = response.data.dailyEnergyConsumed;

        // Extraer los datos de energía mensual
        const mesesAbrev = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const currentYear = new Date().getFullYear();

        // Crear un array con 12 posiciones (1 por mes) y llenar con los valores obtenidos de la API
        const energyByMonth = Array(12).fill(0);

        Object.entries(response.data.monthlyEnergyConsumed).forEach(([key, value]) => {
          // Extraer el mes y año del string "Febrero 2025"
          const [mes, ano] = key.split(" ");
          if (parseInt(ano) === currentYear) {
            const index = mesesAbrev.findIndex(m => mes.startsWith(m));
            if (index !== -1) {
              energyByMonth[index] = value; // Asignar el valor de kWh al mes correcto
            }
          }
        });

        monthlyEnergyConsumed.value = energyByMonth[mesIndex] || 0;

        // Actualizar la serie de datos del gráfico
        basicLineChart.series[0].data = energyByMonth;

      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    const fetchReporteData = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/resumen-reportes", { params: { empresaId: 1 } });

        console.log("Datos de reportes recibidos:", response.data);

        // Extraer datos de la API
        costoTotal.value = response.data.costoTotalAcumulado;
        ingresoDiario.value = response.data.ingresoDiario;
        porcentajeIngresoAcumulado.value = response.data.porcentajeIngresoAcumulado;
        porcentajeIngresoDiario.value = response.data.porcentajeIngresoDiario;
        porcentajeIngresoMensual.value = response.data.porcentajeIngresoMensual;
        promedioDiario.value = convertirTiempoASegundos(response.data.promedioDiario);
        promedioAnual.value = convertirTiempoASegundos(response.data.promedioAnual);

        porcentajeTiempoDiario.value = response.data.porcentajeTiempoDiario;
        porcentajeTiempoMensual.value = response.data.porcentajeTiempoMensual;
        porcentajeTiempoAnual.value = response.data.porcentajeTiempoAnual;

        const costosMensualesData = response.data.costosMensuales;
        const promedioMensualPorMesData = response.data.promedioMensualPorMes;


        // Definir los meses en formato esperado
        const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        const currentYear = new Date().getFullYear();

        // Mapeo de ingresos mensuales asegurando que todos los meses tengan un valor
        costosMensuales.value = meses.map(m => costosMensualesData[`${m} ${currentYear}`] || 0);

        // 🔵 Mapeo de tiempos mensuales asegurando que cada mes tenga un valor en segundos
        tiempoMensual.value = meses.map(m => convertirTiempoASegundos(promedioMensualPorMesData[`${m} ${currentYear}`] || "0s"));

        // **Actualizar gráfico de ingresos**
        reportChart.series = [{ name: "Ingresos", data: [...costosMensuales.value] }];

        // **Actualizar gráfico de tiempos**
        reportChartTiempo.series = [{ name: "Tiempo Promedio", data: [...tiempoMensual.value] }];

      } catch (error) {
        console.error("Error al obtener datos de reportes:", error);
      }
    };

// Función para convertir tiempos en formato "hh:mm:ss" a segundos
    const convertirTiempoASegundos = (tiempoStr) => {
      if (!tiempoStr) return 0;

      const partes = tiempoStr.split(" ");
      let segundos = 0;

      partes.forEach(parte => {
        if (parte.includes("h")) {
          segundos += parseInt(parte.replace("h", "")) * 3600;
        } else if (parte.includes("m")) {
          segundos += parseInt(parte.replace("m", "")) * 60;
        } else if (parte.includes("s")) {
          segundos += parseInt(parte.replace("s", ""));
        }
      });

      return segundos;
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
      obtenerMesActual();
      fetchReporteData();
    });

    return {
      empresa,
      mesIndex,
      mesActual,
      totalEnergyConsumed,
      dailyEnergyConsumed,
      monthlyEnergyConsumed,
      costoTotal,
      costosMensuales,
      ingresoDiario,
      porcentajeIngresoAcumulado,
      porcentajeIngresoDiario,
      porcentajeIngresoMensual,
      promedioDiario,
      promedioAnual,
      tiempoMensual,
      porcentajeTiempoDiario,
      porcentajeTiempoMensual,
      porcentajeTiempoAnual,
      donutChart,
      totalConnectors,
      basicLineChart,
      reportChart,
      reportChartTiempo,
      zoomableChart,
      formatoTiempo
    };
  },
};
</script>


<template>
  <Layout>
    <PageHeader title="Dashboard" />
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
          <BRow class="g-0" style="padding-bottom: 21px;">
            <BCol>
              <BCardHeader>
                <div class="text-end">
                  <h5 class="card-title mb-0">Energía entregada diaria</h5>
                </div>
              </BCardHeader>
              <BCardBody>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <img src="../../assets/images/gas-station-fuel-svgrepo-com.svg" width="40px">
                  <p class="mb-0 w-40" style="font-size: 25px;">{{ dailyEnergyConsumed }} kWh</p>
                </div>
              </BCardBody>
            </BCol>
          </BRow>
        </BCard>
      </BCol>
      <BCol class="col-xl-4">
        <BCard no-body>
          <BRow class="g-0" style="padding-bottom: 21px;">
            <BCol>
              <BCardHeader>
                <div class="text-end">
                  <h5 class="card-title mb-0">Energía entregada al mes de {{ mesActual }}</h5>
                </div>
              </BCardHeader>
              <BCardBody>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <img src="../../assets/images/gas-station-fuel-svgrepo-com.svg" width="40px">
                  <p class="mb-0 w-40" style="font-size: 25px;">{{ monthlyEnergyConsumed }} kWh</p>
                </div>
              </BCardBody>
            </BCol>
          </BRow>
        </BCard>
      </BCol>
      <BCol class="col-xl-4">
        <BCard no-body>
          <BRow class="g-0" style="padding-bottom: 21px;">
            <BCol>
              <BCardHeader>
                <div class="text-end">
                  <h5 class="card-title mb-0">Energía Anual Entregada</h5>
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
    </BRow>
    <BRow>
      <BCol lg="6">
        <BCard no-body>
          <BCardHeader>
            <BCardTitle class="mb-0">Energía Entregada Mensual</BCardTitle>
          </BCardHeader>
          <BCardBody>
            <apexchart class="apex-charts" height="350" dir="ltr"
                       :series="basicLineChart.series"
                       :options="basicLineChart.chartOptions"></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="6">
        <BCard no-body style="height: 430px;">
          <BCardHeader class="justify-content-between d-flex align-items-center">
            <BCardTitle>Estado de conectores</BCardTitle>
            <router-link to="/company/conector">
              <BButton variant="light" class="waves-effect waves-light" style="padding: 5px 10px;">
                <i class="mdi mdi-eye"></i>
              </BButton>
            </router-link>
          </BCardHeader>
          <BCardBody>
            <apexchart class="apex-charts" height="300" dir="ltr" :series="donutChart.series"
                       :options="donutChart.chartOptions"></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
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
    </BRow>
    <BRow>
      <BCard no-body>
        <BCardHeader class="border-0 align-items-center d-flex">
          <BCardTitle class="mb-0 flex-grow-1">Ingresos De Estaciones</BCardTitle>
        </BCardHeader>
        <BCardHeader class="p-0 border-0 bg-light-subtle">
          <BRow class="g-0 text-center">

            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  <count-to :startVal="0" :endVal="ingresoDiario" :duration="3000"></count-to>
                  <span>&nbsp;kWh</span>
                  <span :class="{
                      'text-success': porcentajeIngresoDiario > 0,
                      'text-danger': porcentajeIngresoDiario < 0,
                      'text-primary': porcentajeIngresoDiario === 0
                    }" class="ms-1 fs-12">
                      {{ Math.abs(porcentajeIngresoDiario.toFixed(1)) }}%
                      <i :class="{
                        'ri-arrow-right-up-line': porcentajeIngresoDiario > 0,
                        'ri-arrow-right-down-line': porcentajeIngresoDiario < 0,
                        'ri-arrow-right-line': porcentajeIngresoDiario === 0
                      }" class="ms-1 align-middle"></i>
                 </span>
                </h5>
                <p class="text-muted mb-0">Ingresos Hoy</p>
              </div>
            </BCol>

            <!-- 🟢 Ingreso al mes actual -->
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  <span>&nbsp;$</span>
                  <count-to :startVal="0" :endVal="costosMensuales.length > mesIndex ? costosMensuales[mesIndex] : 0" :duration="3000"></count-to>
                  <span :class="{
                    'text-success': porcentajeIngresoMensual > 0,
                    'text-danger': porcentajeIngresoMensual < 0,
                    'text-primary': porcentajeIngresoMensual === 0
                  }" class="ms-1 fs-12">
                    {{ Math.abs(porcentajeIngresoMensual.toFixed(1)) }}%
                    <i :class="{
                      'ri-arrow-right-up-line': porcentajeIngresoMensual > 0,
                      'ri-arrow-right-down-line': porcentajeIngresoMensual < 0,
                      'ri-arrow-right-line': porcentajeIngresoMensual === 0
                    }" class="ms-1 align-middle"></i>
                  </span>
                </h5>
                <p class="text-muted mb-0">Ingresos al mes de {{mesActual}}</p>
              </div>
            </BCol>


            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0 border-end-0">
                <h5 class="mb-1">
                  $<count-to :startVal="0" :endVal="costoTotal ? costoTotal : 0" :duration="3000"></count-to>
                  <span :class="{
                    'text-success': porcentajeIngresoAcumulado > 0,
                    'text-danger': porcentajeIngresoAcumulado < 0,
                    'text-primary': porcentajeIngresoAcumulado === 0
                  }" class="ms-1 fs-12">
                    {{ Math.abs(porcentajeIngresoAcumulado.toFixed(1)) }}%
                    <i :class="{
                      'ri-arrow-right-up-line': porcentajeIngresoAcumulado > 0,
                      'ri-arrow-right-down-line': porcentajeIngresoAcumulado < 0,
                      'ri-arrow-right-line': porcentajeIngresoAcumulado === 0
                    }" class="ms-1 align-middle"></i>
                </span>
                </h5>
                <p class="text-muted mb-0">Ingresos anuales</p>
              </div>
            </BCol>
          </BRow>
        </BCardHeader>
        <BCard-body class="p-0 pb-2">
          <div>
            <apexchart class="apex-charts" dir="ltr" :series="reportChart.series" :options="reportChart.chartOptions" height="309"></apexchart>
          </div>
        </BCard-body>
      </BCard>
    </BRow>

    <BRow>
      <BCard no-body>
        <BCardHeader class="border-0 align-items-center d-flex">
          <BCardTitle class="mb-0 flex-grow-1">Tiempos De Carga</BCardTitle>
        </BCardHeader>

        <BCardHeader class="p-0 border-0 bg-light-subtle">
          <BRow class="g-0 text-center">

            <!-- Tiempo Promedio Hoy -->
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  {{ formatoTiempo(promedioDiario) }}
                  <span
                      :class="{
                  'text-success': porcentajeTiempoDiario < 0,
                  'text-danger': porcentajeTiempoDiario > 0,
                  'text-primary': porcentajeTiempoDiario === 0
                }" class="ms-1 fs-12">
                {{ Math.abs(porcentajeTiempoDiario.toFixed(1)) }}%
                <i
                    :class="{
                    'ri-arrow-right-up-line': porcentajeTiempoDiario < 0,
                    'ri-arrow-right-down-line': porcentajeTiempoDiario > 0,
                    'ri-arrow-right-line': porcentajeTiempoDiario === 0
                  }" class="ms-1 align-middle">
                </i>
              </span>
                </h5>
                <p class="text-muted mb-0">Tiempo Promedio Hoy</p>
              </div>
            </BCol>

            <!-- Tiempo Promedio Mensual -->
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0">
                <h5 class="mb-1">
                  {{ formatoTiempo(tiempoMensual.length > mesIndex ? tiempoMensual[mesIndex] : 0) }}
                  <span
                      :class="{
                  'text-success': porcentajeTiempoMensual < 0,
                  'text-danger': porcentajeTiempoMensual > 0,
                  'text-primary': porcentajeTiempoMensual === 0
                }" class="ms-1 fs-12">
                {{ Math.abs(porcentajeTiempoMensual.toFixed(1)) }}%
                <i
                    :class="{
                    'ri-arrow-right-up-line': porcentajeTiempoMensual < 0,
                    'ri-arrow-right-down-line': porcentajeTiempoMensual > 0,
                    'ri-arrow-right-line': porcentajeTiempoMensual === 0
                  }" class="ms-1 align-middle">
                </i>
              </span>
                </h5>
                <p class="text-muted mb-0">Tiempo promedio al mes de {{mesActual}}</p>
              </div>
            </BCol>

            <!-- Tiempo Promedio Anual -->
            <BCol cols="6" sm="4">
              <div class="p-3 border border-dashed border-start-0 border-end-0">
                <h5 class="mb-1">
                  {{ formatoTiempo(promedioAnual) }}
                  <span
                      :class="{
                  'text-success': porcentajeTiempoAnual < 0,
                  'text-danger': porcentajeTiempoAnual > 0,
                  'text-primary': porcentajeTiempoAnual === 0
                }" class="ms-1 fs-12">
                {{ Math.abs(porcentajeTiempoAnual.toFixed(1)) }}%
                <i
                    :class="{
                    'ri-arrow-right-up-line': porcentajeTiempoAnual < 0,
                    'ri-arrow-right-down-line': porcentajeTiempoAnual > 0,
                    'ri-arrow-right-line': porcentajeTiempoAnual === 0
                  }" class="ms-1 align-middle">
                </i>
              </span>
                </h5>
                <p class="text-muted mb-0">Tiempo promedio anual</p>
              </div>
            </BCol>

          </BRow>
        </BCardHeader>

        <BCard-body class="p-0 pb-2">
          <div>
            <apexchart class="apex-charts" dir="ltr" :series="reportChartTiempo.series" :options="reportChartTiempo.chartOptions" height="309"></apexchart>
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