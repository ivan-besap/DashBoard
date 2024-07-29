<template>
  <Layout>
    <PageHeader title="Reportes de Carga" pageTitle="Compañía" />
    
    <div style="margin-top:10px;" class="table-responsive table-card">
      <div class="mb-3" style="text-align: right;">
        <b-button style="background-color: white" @click="exportToCSV" variant="light">Exportar a CSV</b-button>&nbsp;&nbsp;
        <b-button style="background-color: white" @click="exportToExcel" variant="light">Exportar a Excel</b-button>
      </div>
      
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">Inicio de Carga</th>
            <th scope="col">Usuario</th>
            <th scope="col">Cargador</th>
            <th scope="col">ID Cargador</th>
            <th scope="col">Conector</th>
            <th scope="col">Fin Carga</th>
            <th scope="col">Energía</th>
            <th scope="col">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="index">
            <td>{{ item.inicioCarga }}</td>
            <td>{{ item.usuario }}</td>
            <td>{{ item.cargador }}</td>
            <td>{{ item.idCargador }}</td>
            <td>{{ item.conector }}</td>
            <td>{{ item.finCarga }}</td>
            <td>{{ item.energia }}</td>
            <td>{{ item.tiempo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import * as XLSX from 'xlsx';

export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      filterDate: null,
      reportData: [
        { inicioCarga: "2024-07-24 08:30:00", usuario: "Usuario1", cargador: "Cargador1", idCargador: "STG-EMU-00002", conector: "Uno", finCarga: "2024-07-24 09:35:00", energia: "15.98 kWh", tiempo: "01:05:46" },
        { inicioCarga: "2024-07-23 10:20:00", usuario: "Usuario2", cargador: "Cargador2", idCargador: "STG-EMU-00003", conector: "Dos", finCarga: "2024-07-23 11:15:00", energia: "13.47 kWh", tiempo: "00:55:00" },
        { inicioCarga: "2024-07-22 12:00:00", usuario: "Usuario3", cargador: "Cargador3", idCargador: "STG-EMU-00004", conector: "Tres", finCarga: "2024-07-22 13:05:00", energia: "18.76 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-21 14:15:00", usuario: "Usuario4", cargador: "Cargador4", idCargador: "STG-EMU-00005", conector: "Cuatro", finCarga: "2024-07-21 15:20:00", energia: "14.56 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-20 16:30:00", usuario: "Usuario5", cargador: "Cargador5", idCargador: "STG-EMU-00006", conector: "Cinco", finCarga: "2024-07-20 17:45:00", energia: "16.23 kWh", tiempo: "01:15:00" },
        { inicioCarga: "2024-07-19 18:45:00", usuario: "Usuario6", cargador: "Cargador6", idCargador: "STG-EMU-00007", conector: "Seis", finCarga: "2024-07-19 19:50:00", energia: "17.89 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-18 20:00:00", usuario: "Usuario7", cargador: "Cargador7", idCargador: "STG-EMU-00008", conector: "Siete", finCarga: "2024-07-18 21:05:00", energia: "19.45 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-17 22:15:00", usuario: "Usuario8", cargador: "Cargador8", idCargador: "STG-EMU-00009", conector: "Ocho", finCarga: "2024-07-17 23:20:00", energia: "20.12 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-16 23:30:00", usuario: "Usuario9", cargador: "Cargador9", idCargador: "STG-EMU-00010", conector: "Nueve", finCarga: "2024-07-17 00:35:00", energia: "21.56 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-15 01:00:00", usuario: "Usuario10", cargador: "Cargador10", idCargador: "STG-EMU-00011", conector: "Diez", finCarga: "2024-07-15 02:05:00", energia: "22.34 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-14 03:15:00", usuario: "Usuario11", cargador: "Cargador11", idCargador: "STG-EMU-00012", conector: "Once", finCarga: "2024-07-14 04:20:00", energia: "23.78 kWh", tiempo: "01:05:00" },
        { inicioCarga: "2024-07-13 05:30:00", usuario: "Usuario12", cargador: "Cargador12", idCargador: "STG-EMU-00013", conector: "Doce", finCarga: "2024-07-13 06:35:00", energia: "24.56 kWh", tiempo: "01:05:00" },
      ]
    };
  },
  computed: {
    filteredData() {
      if (!this.filterDate) return this.reportData;
      return this.reportData.filter(item => {
        const date = new Date(item.inicioCarga);
        return date.toISOString().startsWith(this.filterDate.toISOString().split('T')[0]);
      });
    }
  },
  methods: {
    exportToCSV() {
      const headers = [
        "Inicio de Carga", "Usuario", "Cargador", "ID Cargador", "Conector", "Fin Carga", "Energía", "Tiempo"
      ];
      const rows = this.filteredData.map(item => [
        item.inicioCarga, item.usuario, item.cargador, item.idCargador, item.conector, item.finCarga, item.energia, item.tiempo
      ]);
      const csvContent = "data:text/csv;charset=utf-8," +
        headers.join(",") + "\n" +
        rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "reportes_de_carga.csv");
      document.body.appendChild(link);
      link.click();
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.filteredData, {
        header: ["inicioCarga", "usuario", "cargador", "idCargador", "conector", "finCarga", "energia", "tiempo"]
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reportes de Carga");
      XLSX.writeFile(wb, "reportes_de_carga.xlsx");
    }
  }
};
</script>

<style>
.flex-shrink-0 {
  display: none;
}

.tama-dark {
  font-size: 15px;
}
</style>
