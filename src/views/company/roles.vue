<template>
  <Layout>
    <PageHeader title="Roles" pageTitle="items" />
  
    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="/company/crear-rol">Crear Roles</a>
    </BButton>
  
    <div class="table-responsive table-card">
      <table class="table table-nowrap table-striped-columns mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Permisos</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="#" class="fw-semibold">Administrador</a></td>
            <td>
              <div class="permisos-wrapper">
                <span class="badge border border-dark text-body tama-dark">Cargadores - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Cargadores - Borrar</span>
                <span class="badge border border-dark text-body tama-dark">Cargadores - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Cargas por terminal - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Comandos OCPP - Cargador</span>
                <span class="badge border border-dark text-body tama-dark">Comandos OCPP - Conector</span>
                <span class="badge border border-dark text-body tama-dark">Conductores - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Conductores - Inhabilitar</span>
                <span class="badge border border-dark text-body tama-dark">Conductores - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Configuraciones de cargador - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Control de potencia - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Control de potencia - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Control de potencia - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Dashboard - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Inhabilitaciones programadas - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Inhabilitaciones programadas - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Inhabilitaciones programadas - Ver</span>
                <span class="badge border border-dark text-body tama-dark">OCPP - Editar configuraciones</span>
                <span class="badge border border-dark text-body tama-dark">OCPP - Ver configuraciones</span>
                <span class="badge border border-dark text-body tama-dark">Peak Shaving - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Peak Shaving - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Peak Shaving - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Registros de Carga - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Roles - Borrar</span>
                <span class="badge border border-dark text-body tama-dark">Roles - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Roles - Editar</span>
                <span class="badge border border-dark text-body tama-dark">Roles - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Tecles - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Terminales - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Ubicaciones - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Ubicaciones - Ver</span>
              </div>
            </td>
            <td>
              <BButton variant="danger" type="button" id="sa-warning" @click="confirm">
                Eliminar
              </BButton>
            </td>
          </tr>
          <tr>
            <td><a href="#" class="fw-semibold">Electrobombero</a></td>
            <td>
              <div class="permisos-wrapper">
                <span class="badge border border-dark text-body tama-dark">Cargadores - Crear</span>
                <span class="badge border border-dark text-body tama-dark">Comandos OCPP - Conector</span>
                <span class="badge border border-dark text-body tama-dark">Control de potencia - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Dashboard - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Terminales - Ver</span>
              </div>
            </td>
            <td>
              <BButton variant="danger" type="button" id="sa-warning" @click="confirm">
                Eliminar
              </BButton>
            </td>
          </tr>
          <tr>
            <td><a href="#" class="fw-semibold">Reporte</a></td>
            <td>
              <div class="permisos-wrapper">
                <span class="badge border border-dark text-body tama-dark">Cargadores por usuario</span>
                <span class="badge border border-dark text-body tama-dark">Cargadores por terminal</span>
                <span class="badge border border-dark text-body tama-dark">Cargadores - Borrar</span>
                <span class="badge border border-dark text-body tama-dark">Cargas por terminal - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Control de potencia - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Dashboard - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Registros de Carga - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Roles - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Tecles - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Terminales - Ver</span>
                <span class="badge border border-dark text-body tama-dark">Ubicaciones - Ver</span>
              </div>
            </td>
            <td>
              <BButton variant="danger" type="button" id="sa-warning" @click="confirm">
                Eliminar
              </BButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";

export default {
  components: {
    Layout,
    PageHeader,
  },
  methods: {
    showAlert() {
      Swal.fire("Any fool can use a computer!");
    },
    titleText() {
      Swal.fire("The Internet?", "That thing is still around?", "question");
    },
    successmsg() {
      Swal.fire("Good job!", "You clicked the button!", "success");
    },
    position() {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    confirm() {
      Swal.fire({
        title: "Desea eliminar el Rol?",
        text: "No podrás revertirlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Eliminado!", "El Rol ha sido eliminado.", "success");
        }
      });
    },
    cancel() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger ml-2",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            swalWithBootstrapButtons.fire(
              "Deleted!",
              "Your file has been deleted.",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Your imaginary file is safe :)",
              "error"
            );
          }
        });
    },
    saError() {
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong!",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-primary w-xs mt-2",
        },
        buttonsStyling: false,
        footer: '<BLink href="">Why do I have this issue?</BLink>',
        showCloseButton: true,
      });
    },
    content() {
      Swal.fire({
        imageUrl: "https://placeholder.pics/svg/300x1500",
        imageHeight: 1500,
        imageAlt: "A tall image",
      });
    },
    custom() {
      const ipAPI = "//api.ipify.org?format=json";

      Swal.queue([
        {
          title: "Your public IP",
          confirmButtonText: "Show my public IP",
          text: "Your public IP will be received via AJAX request",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return fetch(ipAPI)
              .then((response) => response.json())
              .then((data) => Swal.insertQueueStep(data.ip))
              .catch(() => {
                Swal.insertQueueStep({
                  icon: "error",
                  title: "Unable to get your public IP",
                });
              });
          },
        },
      ]);
    },
    steps() {
      const steps = ["1", "2", "3"];
      const swalQueueStep = Swal.mixin({
        confirmButtonText: "Forward",
        cancelButtonText: "Backward",
        progressSteps: steps,
        input: "text",
        inputAttributes: {
          required: true,
        },
        validationMessage: "This field is required",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-secondary ml-1",
          nextButton: "btn btn-primary",
          prevButton: "btn btn-secondary ml-1",
        },
        buttonsStyling: false,
      });

      (async () => {
        const values = [];
        let currentStep;

        for (currentStep = 0; currentStep < steps.length; ) {
          const result = await swalQueueStep.fire({
            title: `Question ${steps[currentStep]}`,
            inputValue: values[currentStep],
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,
          });

          if (result.value) {
            values[currentStep] = result.value;
            currentStep++;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            currentStep--;
          } else {
            break;
          }
        }

        if (currentStep === steps.length) {
          Swal.fire(JSON.stringify(values));
        }
      })();
    },
    restore() {
      Swal.fire({
        title: "Restorable pop-up",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save it`,
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    },
  },
};
</script>

<style scoped>
.table-card .badge.tama-dark {
  font-size: 1rem;
  padding: 0.6em;
}
.permisos-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
</style>
