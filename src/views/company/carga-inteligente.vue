<script setup>
import {onMounted, ref} from 'vue';
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';
import PageHeader from "@/components/page-header.vue";
import Layout from "@/layouts/main.vue";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import axios from "axios";

const route = useRoute();
const chargerId = ref(route.params.chargerId); // Obtener el ID del cargador desde la URL
const configuraciones = ref([]);
const tienePerfil = ref(false);
const ocppid = ref(route.query.charger); // Obtener el ocppid de la URL

const formatISODate = (date) => {
  if (!date || date === "" || date === null || date === undefined) return null; // Evitar valores vacíos

  if (date.match(/^\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2}$/)) {
    return date + "Z"; // Añadir "Z" si falta
  }

  // Extraer correctamente la fecha sin afectar la zona horaria
  const parsedDate = new Date(date + "T00:00:00Z"); // Asegurar que se cree con la hora correcta en UTC

  if (isNaN(parsedDate.getTime())) {
    console.error("Fecha inválida detectada:", date);
    return null;
  }

  return parsedDate.toISOString(); // Devuelve "YYYY-MM-DDT00:00:00.000Z"
};



const cargarPerfil = async () => {
  try {
    const response = await axios.get(`http://localhost:8088/api/profile-charger/${chargerId.value}`);
    if (response.status === 200) {
      tienePerfil.value = true;
      const perfil = response.data;

      configuraciones.value = [
        { nombre: "connectorId",            valor: perfil.connectorId, descripcion: "Número del conector donde se aplicará la configuración. Ejemplo conector 1 , 2 o 3 , etc..." },
        { nombre: "csChargingProfiles",     esTitulo: true },
        { nombre: "chargingProfileId",      valor: perfil.chargingProfileId,  parent: "csChargingProfiles", descripcion: "Identificador único del perfil de carga. Ejemplo: Número entero entre el 1 y el 15, como el 10" },
        { nombre: "stackLevel",             valor: perfil.stackLevel, parent: "csChargingProfiles", descripcion: "Prioridad del perfil de carga en la pila de perfiles, mientras mayor sea el número mas prioritario será, el mínimo valor es 0, el cargador siempre utilizará el perfil que tenga el mayor stackLevel, se utiliza par aplicar o agrupar varios perfiles de carga sin eliminar otros." },
        { nombre: "chargingProfilePurpose", valor: perfil.chargingProfilePurpose, parent: "csChargingProfiles", descripcion: "Propósito del perfil de carga. Si se selecciona  ChargePointMaxProfile el cargador utilizará la maxima potencia o corriente disponible para un punto de carga completo. Si selecciona TxProfile tendrá restricciones que el punto de cobro impondrá en la transacción actual, un perfil con este propósito DEBE dejar de ser válido cuando finalice la transacción. Si selecciona TxDefaultProfile es un perfil predeterminado que se utilizará para nuevas transacciones." },
        { nombre: "chargingProfileKind",    valor: perfil.chargingProfileKind, parent: "csChargingProfiles", descripcion: "Tipo de perfil de carga (absoluto, relativo, recurrente). Si se selecciona Absolute los períodos de programación son relativos a un punto fijo en el tiempo definido en la programación. Si selecciona Recurrente, la programación se reinicia periódicamente en el primer período de programación. Si se selecciona Relativo, los periodos de programación son relativos a un punto de inicio específico de la situación (como el inicio de una transacción), que está determinado por el punto de carga." },
        { nombre: "recurrencyKind",         valor: perfil.recurrencyKind, esOpcional:true, parent: "csChargingProfiles", descripcion: "Frecuencia de repetición del perfil de carga" },
        { nombre: "validFrom",              valor: perfil.validFrom ,  esOpcional:true, parent: "csChargingProfiles", esFecha: true, descripcion: "Fecha en el que el perfil comienza a ser válido. Si no se indica, el perfil es válido en cuanto el punto de carga lo recibe." },
        { nombre: "validTo",                valor: perfil.validTo , esOpcional:true,parent: "csChargingProfiles", esFecha: true, descripcion: "Fecha en el que el perfil deja de ser válido. Si no está presente, el perfil es válido hasta que se lo reemplace por otro perfil" },
        { nombre: "chargingSchedule",       esTitulo: true, parent: "csChargingProfiles" },
        { nombre: "duration",              valor: perfil.duration, esOpcional:true, parent: "chargingSchedule", descripcion: "Duración del cronograma de carga en segundos. Si se deja en blanco, el último período continuará indefinidamente o hasta el final de la transacción, en caso de que no se indique startSchedule. Importante: algunos puntos de carga requieren este campo." },
        { nombre: "startSchedule",         valor: perfil.startSchedule, esOpcional:true, parent: "chargingSchedule", esFecha: true, descripcion: "Fecha de punto de inicio de un cronograma absoluto. Si no se especifica, el cronograma será relativo al inicio de la carga." },
        { nombre: "chargingRateUnit",      valor: perfil.chargingRateUnit, parent: "chargingSchedule", descripcion: "Unidad de carga. W: Watts (potencia) define la potencia máxima permitida en el punto de carga. A: Amperios (corriente) define la corriente máxima permitida por fase." },
        { nombre: "minChargingRate",       valor: perfil.minChargingRate, esOpcional:true, parent: "chargingSchedule", descripcion: "Tasa de carga mínima admitida por el vehículo eléctrico. Este parámetro está pensado para que lo utilice un algoritmo de carga inteligente local para optimizar la asignación de energía si un proceso de carga es ineficiente a tasas de carga más bajas. Acepta como máximo una fracción de un dígito (p. ej., “8,1”). Algunos vehículos dejan de cargarse o entran en modo de suspensión si la tasa de carga es demasiado baja. Este parámetro establece una potencia mínima para que la carga permanezca activa en el nivel más mínimo." },
        { nombre: "chargingSchedulePeriod", esTitulo: true, parent: "chargingSchedule" },
        { nombre: "startPeriod",            valor: perfil.startPeriod, parent: "chargingSchedulePeriod", descripcion: "Inicio del período, en segundos desde el inicio de la programación. El valor de StartPeriod también define la hora de finalización del período anterior." },
        { nombre: "limite",                  valor: perfil.limite, parent: "chargingSchedulePeriod", descripcion: "Límite de velocidad de carga durante el período programado, en la chargingRateUnit correspondiente , por ejemplo, en amperios o vatios. Acepta como máximo una fracción de un dígito (por ejemplo, “8,1”)." },
        { nombre: "numberPhases",           valor: perfil.numberPhases,  esOpcional:true, parent: "chargingSchedulePeriod", descripcion: "La cantidad de fases que se pueden usar para la carga. Si se necesitan varias fases, se asumirá numberPhases=3 a menos que se indique otro número." },
      ];
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      tienePerfil.value = false;
      configuraciones.value = [
        { nombre: "connectorId",            valor: "", descripcion: "Número del conector donde se aplicará la configuración. Ejemplo conector 1 , 2 o 3 , etc..." },
        { nombre: "csChargingProfiles",     esTitulo: true },
        { nombre: "chargingProfileId",      valor: "",  parent: "csChargingProfiles", descripcion: "Identificador único del perfil de carga. Ejemplo: Número entero entre el 1 y el 15, como el 10" },
        { nombre: "stackLevel",             valor:"", parent: "csChargingProfiles", descripcion: "Prioridad del perfil de carga en la pila de perfiles, mientras mayor sea el número mas prioritario será, el mínimo valor es 0, el cargador siempre utilizará el perfil que tenga el mayor stackLevel, se utiliza par aplicar o agrupar varios perfiles de carga sin eliminar otros." },
        { nombre: "chargingProfilePurpose", valor: "", parent: "csChargingProfiles", descripcion: "Propósito del perfil de carga. Si se selecciona  ChargePointMaxProfile el cargador utilizará la maxima potencia o corriente disponible para un punto de carga completo. Si selecciona TxProfile tendrá restricciones que el punto de cobro impondrá en la transacción actual, un perfil con este propósito DEBE dejar de ser válido cuando finalice la transacción. Si selecciona TxDefaultProfile es un perfil predeterminado que se utilizará para nuevas transacciones." },
        { nombre: "chargingProfileKind",    valor: "", parent: "csChargingProfiles", descripcion: "Tipo de perfil de carga (absoluto, relativo, recurrente). Si se selecciona Absolute los períodos de programación son relativos a un punto fijo en el tiempo definido en la programación. Si selecciona Recurrente, la programación se reinicia periódicamente en el primer período de programación. Si se selecciona Relativo, los periodos de programación son relativos a un punto de inicio específico de la situación (como el inicio de una transacción), que está determinado por el punto de carga." },
        { nombre: "recurrencyKind",         valor: "", esOpcional:true, parent: "csChargingProfiles", descripcion: "Frecuencia de repetición del perfil de carga" },
        { nombre: "validFrom",              valor: "" ,  esOpcional:true, parent: "csChargingProfiles", esFecha: true, descripcion: "Fecha en el que el perfil comienza a ser válido. Si no se indica, el perfil es válido en cuanto el punto de carga lo recibe." },
        { nombre: "validTo",                valor: "", esOpcional:true,parent: "csChargingProfiles", esFecha: true, descripcion: "Fecha en el que el perfil deja de ser válido. Si no está presente, el perfil es válido hasta que se lo reemplace por otro perfil" },
        { nombre: "chargingSchedule",       esTitulo: true, parent: "csChargingProfiles" },
        { nombre: "duration",              valor: "", esOpcional:true, parent: "chargingSchedule", descripcion: "Duración del cronograma de carga en segundos. Si se deja en blanco, el último período continuará indefinidamente o hasta el final de la transacción, en caso de que no se indique startSchedule. Importante: algunos puntos de carga requieren este campo." },
        { nombre: "startSchedule",         valor: "", esOpcional:true, parent: "chargingSchedule", esFecha: true, descripcion: "Fecha de punto de inicio de un cronograma absoluto. Si no se especifica, el cronograma será relativo al inicio de la carga." },
        { nombre: "chargingRateUnit",      valor: "", parent: "chargingSchedule", descripcion: "Unidad de carga. W: Watts (potencia) define la potencia máxima permitida en el punto de carga. A: Amperios (corriente) define la corriente máxima permitida por fase." },
        { nombre: "minChargingRate",       valor: "", esOpcional:true, parent: "chargingSchedule", descripcion: "Tasa de carga mínima admitida por el vehículo eléctrico. Este parámetro está pensado para que lo utilice un algoritmo de carga inteligente local para optimizar la asignación de energía si un proceso de carga es ineficiente a tasas de carga más bajas. Acepta como máximo una fracción de un dígito (p. ej., “8,1”). Algunos vehículos dejan de cargarse o entran en modo de suspensión si la tasa de carga es demasiado baja. Este parámetro establece una potencia mínima para que la carga permanezca activa en el nivel más mínimo." },
        { nombre: "chargingSchedulePeriod", esTitulo: true, parent: "chargingSchedule" },
        { nombre: "startPeriod",            valor:"", parent: "chargingSchedulePeriod", descripcion: "Inicio del período, en segundos desde el inicio de la programación. El valor de StartPeriod también define la hora de finalización del período anterior." },
        { nombre: "limite",                  valor: "", parent: "chargingSchedulePeriod", descripcion: "Límite de velocidad de carga durante el período programado, en la chargingRateUnit correspondiente , por ejemplo, en amperios o vatios. Acepta como máximo una fracción de un dígito (por ejemplo, “8,1”)." },
        { nombre: "numberPhases",           valor: "",  esOpcional:true, parent: "chargingSchedulePeriod", descripcion: "La cantidad de fases que se pueden usar para la carga. Si se necesitan varias fases, se asumirá numberPhases=3 a menos que se indique otro número." },
      ];
    } else {
      Swal.fire("Error", "Error al cargar el perfil de carga.", "error");
    }
  }
};



// Llamar a la función cuando se carga la vista
onMounted(() => {
  cargarPerfil();
});

const enviarPerfilAlCargador = async () => {
  try {
    if (!ocppid.value) {
      Swal.fire("Error", "No se encontró el OCPP ID del cargador.", "error");
      return;
    }

    // Construcción del JSON con todos los valores
    let perfilCargador = configuraciones.value.reduce((acc, config) => {
      if(config.esFecha){
        if(config.valor){
          (config.valor = config.valor + "Z")
        }
      }
      if (config.valor !== undefined && config.valor !== null && config.valor !== "") {
        const key = config.nombre === "limite" ? "limit" : config.nombre;
        acc[key] = config.valor;
      }
      return acc;
    }, {});

    // Construir el array de chargingSchedulePeriod en lugar de un objeto indexado
    let chargingSchedulePeriod = [];
    if (perfilCargador.startPeriod !== undefined && perfilCargador.limit !== undefined) {
      chargingSchedulePeriod.push({
        startPeriod: perfilCargador.startPeriod,
        limit: perfilCargador.limit,
        ...(perfilCargador.numberPhases !== undefined && { numberPhases: perfilCargador.numberPhases })
      });
    }

    // Construcción del JSON OCPP compatible
    let data = {
      connectorId: perfilCargador.connectorId,
      csChargingProfiles: {
        chargingProfileId: perfilCargador.chargingProfileId,
        stackLevel: perfilCargador.stackLevel,
        chargingProfilePurpose: perfilCargador.chargingProfilePurpose,
        chargingProfileKind: perfilCargador.chargingProfileKind,
        ...(perfilCargador.validFrom && { validFrom: perfilCargador.validFrom }),
        ...(perfilCargador.validTo && { validTo: perfilCargador.validTo }),
        ...(perfilCargador.recurrencyKind && { recurrencyKind: perfilCargador.recurrencyKind }),
        chargingSchedule: {
          chargingRateUnit: perfilCargador.chargingRateUnit,
          ...(perfilCargador.startSchedule && { startSchedule: perfilCargador.startSchedule }),
          ...(perfilCargador.minChargingRate && { minChargingRate: perfilCargador.minChargingRate }),
          ...(perfilCargador.duration && { duration: perfilCargador.duration }),
          chargingSchedulePeriod
        }
      }
    };

    const response = await axios.post(`https://app.evolgreen.com/api/set-charging-profile`, data, {
      params: { chargePointId: ocppid.value },
      headers: { "Content-Type": "application/json" }
    });

    if (response.data.status === "Accepted") {
      Swal.fire("Éxito", "El perfil de carga se asignó correctamente al cargador.", "success");
    } else if (response.data.status === "Rejected") {
      Swal.fire("Error", "Hubo un problema al asignar el perfil de carga.", "error");
    } else {
      Swal.fire("Advertencia", "Respuesta inesperada del servidor.", "warning");
    }
  } catch (error) {
    console.error("Error al enviar el perfil de carga:", error);
    Swal.fire("Error", "Ocurrió un error al asignar el perfil de carga.", "error");
  }
};

const guardarPerfil = async () => {
  // Verificar que todos los campos obligatorios estén llenos
  const camposVacios = configuraciones.value.filter(config => !config.esOpcional && (config.valor === "" || config.valor === null || config.valor === undefined) && !config.esTitulo);

  if (camposVacios.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: `Debe completar los siguientes campos: ${camposVacios.map(c => c.nombre).join(", ")}`,
    });
    return; // No continuar si hay campos vacíos
  }

  try {
    // Construcción del objeto perfilCargador
    const perfilCargador = configuraciones.value.reduce((acc, config) => {
      if (config.valor !== undefined && config.valor !== null) {
        acc[config.nombre] = config.esFecha ? formatISODate(config.valor) : config.valor;
      }
      return acc;
    }, {});

    // Enviar los datos al backend usando POST
    const response = await axios.post(`http://localhost:8088/api/profile-charger/${chargerId.value}`, perfilCargador,
        {
          headers: { "Content-Type": "application/json" }
        }
    );

    if (response.status === 200) {
      Swal.fire("Éxito", "Perfil de carga guardado correctamente", "success").then(() => {
        location.reload(); // Recargar la vista después de cerrar el SweetAlert
      });
    } else {
      Swal.fire("Error", "Hubo un problema al guardar el perfil de carga", "error");
    }

  } catch (error) {
    console.error("Error al enviar perfil:", error.response?.data || error.message);
    Swal.fire("Error", "Hubo un problema al guardar el perfil de carga", "error");
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Perfil de carga" pageTitle="Compañía" />
    <div class="container">
      <BCard no-body class="card-body">
        <BCardBody>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
              <tr>
                <th>Nombre</th>
                <th>Valor</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(config, index) in configuraciones" :key="index">
                <!-- Títulos -->
                <tr v-if="config.esTitulo">
                  <td colspan="2" class="table-subtitle">
                    <strong>{{ config.nombre }}</strong>
                  </td>
                </tr>
                <!-- Configuraciones normales -->
                <tr v-else>
                  <td :class="{ 'nested': config.parent }">
                    {{ config.nombre }}
                    <span :class="{ 'text-danger': !config.esOpcional, 'text-success': config.esOpcional }">
                      ({{ config.esOpcional ? 'Opcional' : 'Obligatorio' }})
                    </span>

                    <!-- Ícono de ayuda con MDI -->
                    <i
                        class="mdi mdi-help-circle-outline info-icon"
                        :id="'popover-target-' + index">
                    </i>

                    <!-- Popover con BootstrapVueNext -->
                    <BPopover
                        :target="'popover-target-' + index"
                        triggers="hover focus"
                        placement="bottom"
                    >
                      <strong>{{ config.nombre }}</strong><br>
                      {{ config.descripcion }}
                    </BPopover>
                  </td>
                  <td>
                    <!-- Si es una fecha, mostrar DatePicker -->
                    <template v-if="config.esFecha">
                      <flat-pickr v-model="config.valor" class="form-control"/>
                    </template>

                    <!-- Si es chargingProfilePurpose, mostrar Select -->
                    <template v-else-if="config.nombre === 'chargingProfilePurpose'">
                      <select v-model="config.valor" class="form-control"
                              :class="{ 'is-invalid': !config.esOpcional && (!config.valor || config.valor === '') }">
                        <option value="ChargePointMaxProfile">ChargePointMaxProfile</option>
                        <option value="TxDefaultProfile">TxDefaultProfile</option>
                        <option value="TxProfile">TxProfile</option>
                      </select>
                    </template>

                    <template v-else-if="config.nombre === 'chargingProfileKind'">
                      <select v-model="config.valor" class="form-control"
                              :class="{ 'is-invalid': !config.esOpcional && (!config.valor || config.valor === '') }">
                        <option value="Absolute">Absolute</option>
                        <option value="Recurring">Recurring</option>
                        <option value="Relative">Relative</option>
                      </select>
                    </template>

                    <template v-else-if="config.nombre === 'recurrencyKind'">
                      <select v-model="config.valor" class="form-control"
                              :class="{ 'is-invalid': !config.esOpcional && (!config.valor || config.valor === '') }">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                      </select>
                    </template>

                    <template v-else-if="config.nombre === 'chargingRateUnit'">
                      <select v-model="config.valor" class="form-control"
                              :class="{ 'is-invalid': !config.esOpcional && (!config.valor || config.valor === '') }">
                        <option value="A">A</option>
                        <option value="W">W</option>
                      </select>
                    </template>

                    <!-- Para los demás campos, input normal -->
                    <template v-else>
                      <input type="text"
                             class="form-control"
                             v-model="config.valor"
                             :class="{ 'is-invalid': !config.esOpcional && (config.valor === '' || config.valor === null || config.valor === undefined) }" />
                    </template>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <div v-if="tienePerfil">
              <BButton variant="success" @click="enviarPerfilAlCargador">
                Enviar Perfil al Cargador
              </BButton>
            </div>

            <div class="ms-auto">
              <BButton variant="primary" @click="guardarPerfil">Guardar Perfil</BButton>
              <BButton variant="light" class="ms-2" @click="$router.push('/company/cargadores-company')">
                Volver
              </BButton>
            </div>
          </div>

        </BCardBody>
      </BCard>
    </div>
  </Layout>
</template>

<style scoped>
.table-subtitle {
  background-color: #f8f9fa;
  text-align: left;
  font-size: 16px;
  padding: 10px;
}
.nested {
  padding-left: 20px;
  font-weight: normal;
}
.text-end {
  text-align: right;
}
.is-invalid {
  border: 2px solid red;
}
</style>
