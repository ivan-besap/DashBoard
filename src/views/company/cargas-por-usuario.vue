<template>
    <Layout>
      <PageHeader title="Detalles de Eventos" pageTitle="Dashboard" />
  
      <!-- Botón para agregar evento (reemplazado el enlace por una ruta) -->
      <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
        <router-link to="/crear-evento">Agregar Evento</router-link>
      </BButton>
  
      <div class="table-responsive table-card">
        <table class="table table-nowrap table-striped-columns mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                  <label class="form-check-label" for="cardtableCheck"></label>
                </div>
              </th>
              <th scope="col">Fecha</th>
              <th scope="col">ID Cargador</th>
              <th scope="col">Modelo</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Tipo Evento</th>
              <th scope="col">Resultado</th>
            
            </tr>
          </thead>
          <tbody>
            <tr v-for="evento in eventos" :key="evento.id">
              <td>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" :id="'cardtableCheck' + evento.id">
                  <label class="form-check-label" :for="'cardtableCheck' + evento.id"></label>
                </div>
              </td>
              <td>{{ evento.fecha }}</td>
              <td>{{ evento.idCargador }}</td>
              <td>{{ evento.modelo }}</td>
              <td>{{ evento.ubicacion }}</td>
              <td>{{ evento.tipoEvento }}</td>
              <td>{{ evento.resultado }}</td>
            
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  </template>
  
  <script>
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  
  export default {
    components: {
      Layout,
      PageHeader,
    },
  
    data() {
      return {
        eventos: [
          {
            id: 1,
            fecha: '2024-07-04 16:56:28',
            idCargador: 11288853532857,
            modelo: 'WEEYU_M3B_Demo',
            ubicacion: 'Vicente Reyes 224, Viña del Mar, Valparaiso',
            tipoEvento: 'Notificación',
            resultado: 'Aceptada'
          },
          // Aquí puedes agregar más eventos con sus respectivos detalles
        ]
      };
    }
  };
  </script>
  
  <style>
  .flex-shrink-0 {
    display: none;
  }
  </style>
  