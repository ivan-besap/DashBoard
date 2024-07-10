<script>
    import Layout from "@/layouts/main.vue";
    
    export default {
      components: {
        Layout,
      },
    };
    </script>
    
    <template>
      <Layout>
        <BRow>
        <BCol cols="12">
          <div class="justify-content-between d-flex align-items-center mt-3 mb-4">
          </div>
          <BRow class="row-cols-xxl-5 row-cols-lg-3 row-cols-1">
            <BCol xxl="4">
              <BCard no-body class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-2" style="text-align: center">
                    <h5 class="card-title mb-1">Plan Básico</h5>
                    <p class="text-muted mb-0">Prepago</p>
                  </div>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$10 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$40 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$40 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$50 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>Todo el día
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Días</p>
                  <p class="card-text ">Mensual</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Potencia Máx</p>
                  <p class="card-text ">Apto para toda potencia</p>
                </div>
                <BLink href="javascript:void(0)" class="btn btn-success btn-sm text-black"><strong>Suscribete!! </strong></BLink>
              </BCard>
            </BCol>
            <BCol xxl="4">
              <BCard no-body class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-2" style="text-align: center">
                    <h5 class="card-title mb-1">Plan Viajero</h5>
                    <p class="text-muted mb-0">Solo tarjeta debito/crédito EvolGreen</p>
                  </div>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$35 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$40 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$40 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>Todo el día
                  </p>
                  <p class="text-truncate fs-14 mb-0">$25 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Días</p>
                  <p class="card-text ">Mensual</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Potencia Máx</p>
                  <p class="card-text ">Solo sobre 100kW</p>
                </div>
                <BLink href="javascript:void(0)" class="btn btn-success btn-sm text-black"><strong>Suscribete!! </strong></BLink>
              </BCard>
            </BCol>
            <BCol xxl="4">
              <BCard no-body class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-2" style="text-align: center">
                    <h5 class="card-title mb-1">Plan Ahorro</h5>
                    <p class="text-muted mb-0">Sólo tarjeta crédito EvolGreen</p>
                  </div>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$5 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$15 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$25 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$38 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>Todo el día
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Días</p>
                  <p class="card-text ">Mensual</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Potencia Máx</p>
                  <p class="card-text ">Hasta 70kW</p>
                </div>
                <BLink href="javascript:void(0)" class="btn btn-success btn-sm text-black"><strong>Suscribete!! </strong></BLink>
              </BCard>
            </BCol>
            <BCol xxl="4">
              <BCard no-body class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-2" style="text-align: center">
                    <h5 class="card-title mb-1">Plan Festivo</h5>
                    <p class="text-muted mb-0">Sólo tarjeta crédito EvolGreen</p>
                  </div>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$5 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$15 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$25 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 14:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>14:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-warning me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$38 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>Todo el día
                  </p>
                  <p class="text-truncate fs-14 mb-0">$10 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Días</p>
                  <p class="card-text ">Mensual</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Potencia Máx</p>
                  <p class="card-text ">Apto para toda potencia</p>
                </div>
                <BLink href="javascript:void(0)" class="btn btn-success btn-sm text-black"><strong>Suscribete!! </strong></BLink>
              </BCard>
            </BCol>
            <BCol xxl="4">
              <BCard no-body class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-2" style="text-align: center">
                    <h5 class="card-title mb-1">Plan Corredor</h5>
                    <p class="text-muted mb-0">Sólo tarjeta débito/crédito EvolGreen</p>
                  </div>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Lunes a Viernes
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 17:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$10 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>17:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$15 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Sábados y Domingos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>8:00 - 20:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-success me-2"></i>20:00 - 8:00
                  </p>
                  <p class="text-truncate fs-14 mb-0">$30 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <p class="text-truncate fs-14 mb-2 text-muted">
                  <i class="mdi mdi-minus align-middle text-white me-2"></i>Festivos
                </p>
                <div class="d-flex justify-content-between mb-2">
                  <p class="text-truncate fs-14 mb-0">
                    <i class="mdi mdi-circle align-middle text-primary me-2"></i>Todo el día
                  </p>
                  <p class="text-truncate fs-14 mb-0">$20 <span class="text-muted"> por kWh</span></p>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Días</p>
                  <p class="card-text ">Mensual</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="card-text text-muted">Potencia Máx</p>
                  <p class="card-text ">Sobre 100kW</p>
                </div>
                <BLink href="javascript:void(0)" class="btn btn-success btn-sm text-black"><strong>Suscribete!! </strong></BLink>
              </BCard>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
        </Layout>
    </template>