<script>
    import Layout from "@/layouts/main.vue";

    export default {
      components: {
        Layout,
      },
      data() {
        return {
          selectedPlan: 1, // Por defecto, el plan básico está seleccionado
          plans: [
            {
              id: 1,
              name: 'Plan Básico',
              description: 'Prepago',
              weekdays: [
                { time: '8:00 - 14:00', price: '$10' },
                { time: '14:00 - 20:00', price: '$30' },
                { time: '20:00 - 8:00', price: '$40' }
              ],
              weekends: [
                { time: '8:00 - 14:00', price: '$30' },
                { time: '14:00 - 20:00', price: '$40' },
                { time: '20:00 - 8:00', price: '$50' }
              ],
              holiday: { time: 'Todo el día', price: '$30' },
              days: 'Mensual',
              maxPower: 'Apto para toda potencia'
            },
            {
              id: 2,
              name: 'Plan Viajero',
              description: 'Solo tarjeta debito/crédito EvolGreen',
              weekdays: [
                { time: '8:00 - 14:00', price: '$20' },
                { time: '14:00 - 20:00', price: '$35' },
                { time: '20:00 - 8:00', price: '$40' }
              ],
              weekends: [
                { time: '8:00 - 14:00', price: '$20' },
                { time: '14:00 - 20:00', price: '$30' },
                { time: '20:00 - 8:00', price: '$40' }
              ],
              holiday: { time: 'Todo el día', price: '$25' },
              days: 'Mensual',
              maxPower: 'Solo sobre 100kW'
            },
            {
              id: 3,
              name: 'Plan Ahorro',
              description: 'Sólo tarjeta crédito EvolGreen',
              weekdays: [
                { time: '8:00 - 14:00', price: '$5' },
                { time: '14:00 - 20:00', price: '$15' },
                { time: '20:00 - 8:00', price: '$25' }
              ],
              weekends: [
                { time: '8:00 - 14:00', price: '$20' },
                { time: '14:00 - 20:00', price: '$30' },
                { time: '20:00 - 8:00', price: '$38' }
              ],
              holiday: { time: 'Todo el día', price: '$20' },
              days: 'Mensual',
              maxPower: 'Hasta 70kW'
            },
            {
              id: 4,
              name: 'Plan Festivo',
              description: 'Sólo tarjeta crédito EvolGreen',
              weekdays: [
                { time: '8:00 - 14:00', price: '$5' },
                { time: '14:00 - 20:00', price: '$15' },
                { time: '20:00 - 8:00', price: '$25' }
              ],
              weekends: [
                { time: '8:00 - 14:00', price: '$20' },
                { time: '14:00 - 20:00', price: '$30' },
                { time: '20:00 - 8:00', price: '$38' }
              ],
              holiday: { time: 'Todo el día', price: '$10' },
              days: 'Mensual',
              maxPower: 'Apto para toda potencia'
            },
            {
              id: 5,
              name: 'Plan Corredor',
              description: 'Sólo tarjeta débito/crédito EvolGreen',
              weekdays: [
                { time: '8:00 - 17:00', price: '$10' },
                { time: '17:00 - 8:00', price: '$15' }
              ],
              weekends: [
                { time: '8:00 - 20:00', price: '$20' },
                { time: '20:00 - 8:00', price: '$30' }
              ],
              holiday: { time: 'Todo el día', price: '$20' },
              days: 'Mensual',
              maxPower: 'Sobre 100kW'
            }
          ]
        };
      },
      methods: {
        selectPlan(planId) {
          this.selectedPlan = planId;
        },
        getClassByTime(time) {
          if (time.includes('8:00 - 14:00')) return 'text-primary';
          if (time.includes('8:00 - 17:00')) return 'text-primary';
          if (time.includes('8:00 - 20:00')) return 'text-primary';
          if (time.includes('14:00 - 20:00')) return 'text-success';
          if (time.includes('17:00 - 8:00')) return 'text-success';
          if (time.includes('20:00 - 8:00')) return 'text-warning';
          return 'text-muted';
        }
      }
    };
  </script>
    
  <template>
      <Layout>
        <BRow>
          <BCol cols="12">
            <div class="justify-content-between d-flex align-items-center mt-3 mb-4">
            </div>
            <BRow class="row-cols-xxl-5 row-cols-lg-3 row-cols-1">
              <BCol v-for="plan in plans" :key="plan.id" xxl="4">
                <BCard :class="{'selected-plan': selectedPlan === plan.id}" no-body class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1 ms-2" style="text-align: center">
                      <h5 class="card-title mb-1">{{ plan.name }}</h5>
                      <p class="text-muted mb-0">{{ plan.description }}</p>
                    </div>
                  </div>
                  <hr>
                  <p class="text-truncate fs-14 mb-2 text-muted">
                    <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                  </p>
                  <div class="d-flex justify-content-between mb-2" v-for="(price, idx) in plan.weekdays" :key="idx">
                    <p class="text-truncate fs-14 mb-0">
                      <i :class="['mdi mdi-circle align-middle me-2', getClassByTime(price.time)]"></i>{{ price.time }}
                    </p>
                    <p class="text-truncate fs-14 mb-0">{{ price.price }} <span class="text-muted"> por kWh</span></p>
                  </div>
                  <hr>
                  <p class="text-truncate fs-14 mb-2 text-muted">
                    <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                  </p>
                  <div class="d-flex justify-content-between mb-2" v-for="(price, idx) in plan.weekends" :key="idx">
                    <p class="text-truncate fs-14 mb-0">
                      <i :class="['mdi mdi-circle align-middle me-2', getClassByTime(price.time)]"></i>{{ price.time }}
                    </p>
                    <p class="text-truncate fs-14 mb-0">{{ price.price }} <span class="text-muted"> por kWh</span></p>
                  </div>
                  <hr>
                  <p class="text-truncate fs-14 mb-2 text-muted">
                    <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                  </p>
                  <div class="d-flex justify-content-between mb-2">
                    <p class="text-truncate fs-14 mb-0">
                      <i :class="['mdi mdi-circle align-middle me-2', getClassByTime(plan.holiday.time)]"></i>{{ plan.holiday.time }}
                    </p>
                    <p class="text-truncate fs-14 mb-0">{{ plan.holiday.price }} <span class="text-muted"> por kWh</span></p>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <p class="card-text text-muted">Días</p>
                    <p class="card-text ">{{ plan.days }}</p>
                  </div>
                  <div class="d-flex justify-content-between">
                    <p class="card-text text-muted">Potencia Máx</p>
                    <p class="card-text ">{{ plan.maxPower }}</p>
                  </div>
                  <BLink @click="selectPlan(plan.id)" href="javascript:void(0)" class="btn btn-success btn-sm text-black">
                    <strong>{{ selectedPlan === plan.id ? 'Suscrito' : 'Suscríbete!!' }} </strong>
                  </BLink>
                </BCard>
              </BCol>
            </BRow>
          </BCol>
        </BRow>
        </Layout>
</template>
<style scoped>
.selected-plan {
  border: 2px solid green;
}
</style>

