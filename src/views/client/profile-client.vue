<script>
/*import Multiselect from "@vueform/multiselect";*/
import "@vueform/multiselect/themes/default.css";
/*import flatPickr from "vue-flatpickr-component";*/
import "flatpickr/dist/flatpickr.css";
import axios from 'axios';
import Layout from "@/layouts/main.vue";

export default {
  data() {
    return {
      dealsStatus: [
        {
          id: 1,
          name: "Quilpue",
          date: "May 20, 2024",
          img: require("@/assets/images/logo-estacion.png"),
          representativeName: "Estación Quilpue",
          badgeClass: "success",
          status: "Disponible",
          statusValue: "$1000",
        },
        {
          id: 2,
          name: "Viña del Mar",
          date: "Jun 12, 2024",
          img: require("@/assets/images/logo-estacion.png"),
          representativeName: "Estación Vergara",
          badgeClass: "warning",
          status: "Disponible",
          statusValue: "$1500",
        },
        {
          id: 3,
          name: "Valparaíso",
          date: "Abr 27, 2024",
          img: require("@/assets/images/logo-estacion.png"),
          representativeName: "Estación la Polvora",
          badgeClass: "danger",
          status: "No Disponible",
          statusValue: "$780",
        },
        {
          id: 4,
          name: "Valparaíso",
          date: "Jun 08, 2024",
          img: require("@/assets/images/logo-estacion.png"),
          representativeName: "Estación Playa Ancha",
          badgeClass: "success",
          status: "Terminando",
          statusValue: "$890",
        },
        {
          id: 5,
          name: "Santiago",
          date: "May 30, 2024",
          img: require("@/assets/images/logo-estacion.png"),
          representativeName: "Estación Providencia",
          badgeClass: "info",
          status: "Llena",
          statusValue: "$1020",
        },
      ],
      activeTab: 'home',
      value: ['javascript'],
      date: null,
      client: null,  // Añadir un campo para almacenar los datos del cliente
    };
  },
  components: {
    Layout,
    /*Multiselect,*/
    /*flatPickr*/
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
      console.log(`Active tab set to: ${tabName}`);
    },
    goToTab(tabName) {
      this.activeTab = tabName; // Actualiza el tab activo
    },
    async getUser() {
      try {
        const response = await axios.get('http://localhost:8080/api/clients/current');
        this.client = response.data;
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    },
    changepass() {
      var data = {
        password: document.getElementById('oldpasswordInput').value,
        new_password: document.getElementById('newpasswordInput').value,
        confirm_password: document.getElementById('confirmpasswordInput').value
      };
      axios.patch('https://api-node.themesbrand.website/updatepassword', data).then((data) => {
        console.log(data);
      }).catch((e) => {
        console.log(e);
      });
    },
    updatedata() {
      var userid = localStorage.getItem('userid');
      var data = {
        first_name: document.getElementById('firstnameInput').value,
        last_name: document.getElementById('lastnameInput').value,
        phone: document.getElementById('phonenumberInput').value,
        email: document.getElementById('emailInput').value,
        joining_date: document.getElementById('dateinput').value,
        skills: document.getElementById('skillsinput').value,
        designation: document.getElementById('designationInput').value,
        website: document.getElementById('websiteInput1').value,
        city: document.getElementById('cityInput').value,
        country: document.getElementById('countryInput').value,
        zipcode: document.getElementById('zipcodeInput').value,
        Description: document.getElementById('exampleFormControlTextarea').value,
      };
      axios.patch('https://api-node.themesbrand.website/user/' + userid, data).then((data) => {
        console.log(data);
      }).catch((e) => {
        console.log(e);
      });
    }
  },
  mounted() {
    this.getUser(); // Llamar a getUser() cuando el componente se monte
  }
};
</script>

<template>
  <Layout>
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img src="@/assets/images/profile-bg.jpg" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input id="profile-foreground-img-file-input" type="file" class="profile-foreground-img-file-input" />
              <label for="profile-foreground-img-file-input" class="profile-photo-edit btn btn-light">
                <i class="ri-image-edit-line align-bottom me-1"></i> Change
                Cover
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BRow>
      <BCol xxl="3">
        <BCard no-body class="mt-n5">
          <BCardBody class="p-4">
            <div class="text-center">
              <div class="
                  profile-user
                  position-relative
                  d-inline-block
                  mx-auto
                  mb-4
                ">
                <img src="@/assets/images/users/avatar-8.jpg" class="
                    rounded-circle
                    avatar-xl
                    img-thumbnail
                    user-profile-image
                  " alt="user-profile-image" />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input id="profile-img-file-input" type="file" class="profile-img-file-input" />
                  <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="ri-camera-fill"></i>
                    </span>
                  </label>
                </div>
              </div>
              <h5 class="fs-16 mb-1">{{ client ? client.firstName + ' ' + client.lastName : 'Nombre del Usuario' }}</h5>
              <p class="text-muted mb-0">{{ client ? client.email : 'Correo del Usuario' }}</p>
            </div>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Mis Autos</h5>
              </div>
              <div class="flex-shrink-0">
                <BLink href="javascript:void(0);" class="badge bg-light text-primary fs-12">
                  <i class="ri-add-fill align-bottom me-1"></i> Add
                </BLink>
              </div>
            </div>
            <div class="mt-6">
              <div class="space-y-4">
                <div class="bg-dark p-4 rounded-lg">
                  <img src="https://i.blogs.es/efcca7/screenshot/1366_521.jpg" alt="Tesla Model X" class="mb-2 img-fluid rounded" @click="goToTab('autos')" style="cursor: pointer;" />
                  <div class="text-white mb-2">
                    <strong>Modelo:</strong> <span style="color: #7ae6ac;">{{ client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].model : '' }}</span>
                  </div>
                  <div class="text-white mb-2">
                    <strong>Capacidad Total:</strong> <span style="color: #7ae6ac;"> {{ client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].capacityFullPower : '' }} kWh </span>
                  </div>
                </div>
              </div>
            </div>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Mis Planes</h5>
              </div>
              <div class="flex-shrink-0">
                <BLink href="javascript:void(0);" class="badge bg-light text-primary fs-12">
                  <i class="ri-add-fill align-bottom me-1"></i> Add
                </BLink>
              </div>
            </div>
            <div class="mt-6">
              <div class="space-y-4">
                <div class="bg-dark p-4 rounded-lg">
                  <img src="@/assets/images/plan-basico.png"  alt="Tesla Model X" class="mb-2 img-fluid rounded" @click="goToTab('planes')" style="cursor: pointer; width: 100%; height: auto;" />
                  <div class="text-white mb-2">
                    <strong>Nombre:</strong> <span style="color: #7ae6ac;">{{ client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].name : '' }}</span>
                  </div>
                  <div class="text-white mb-2">
                    <strong>Costo:</strong> <span style="color: #7ae6ac;"> ${{ client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].cost : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol xxl="9">
        <BCard no-body class="mt-xxl-n5">
          <BCardBody class="p-4 pt-2">
            <BNav :active-tab="activeTab">
              <BTabs nav-class="nav-tabs-custom rounded border-bottom-0">
              <BTab class="nav-item" title="Perfil" :active="activeTab === 'home'" @click="setActiveTab('home')">
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="firstnameInput" placeholder="Enter your firstname" :value="client ? client.firstName : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="lastnameInput" placeholder="Enter your lastname" :value="client ? client.lastName : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Numero de Telefono</label>
                        <input type="text" class="form-control" id="phonenumberInput" placeholder="Enter your phone number" :value="client ? client.phone : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Email</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" :value="client ? client.email : ''" />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton type="submit" variant="secondary" @click="updatedata">
                          Updates
                        </BButton>
                        <BButton type="button" variant="soft-danger">
                          Cancel
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
              <BTab class="nav-item" title="Ubicacion" :active="activeTab === 'ubicacion'" @click="setActiveTab('ubicacion')">
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Ciudad</label>
                        <input type="text" class="form-control" id="cityInput" placeholder="City" :value="client && client.account[0].locations[0].city ? client.account[0].locations[0].city : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="regionInput" class="form-label">Region</label>
                        <input type="text" class="form-control" id="regionInput" placeholder="Region"
                               :value="client && client.account[0].locations[0].country ? client.account[0].locations[0].region : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label">Pais</label>
                        <input type="text" class="form-control" id="countryInput" placeholder="Country"
                               :value="client && client.account[0].locations[0].country ? client.account[0].locations[0].country : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="addressInput" class="form-label">Direccion</label>
                        <input type="text" class="form-control" id="addressInput" placeholder="Address"
                               :value="client && client.account[0].locations[0].country ? client.account[0].locations[0].address : ''" />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton type="submit" variant="secondary" @click="updatedata">
                          Updates
                        </BButton>
                        <BButton type="button" variant="soft-danger">
                          Cancel
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
              <BTab class="nav-item" title="Autos" :active="activeTab === 'autos'" @click="setActiveTab('autos')">
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">Patente</label>
                        <input type="text" class="form-control" id="firstnameInput" placeholder="Enter your firstname" :value=" client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].licensePlate : '' " />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Modelo</label>
                        <input type="text" class="form-control" id="lastnameInput" placeholder="Enter your lastname" :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].model : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Vin</label>
                        <input type="text" class="form-control" id="phonenumberInput" placeholder="Enter your phone number" :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].vin : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Color</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].color : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Fabricante</label>
                        <input type="text" class="form-control" id="cityInput" placeholder="City" :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].brand : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="regionInput" class="form-label">Año</label>
                        <input type="text" class="form-control" id="regionInput" placeholder="Region"
                               :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].manufactureYear : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label">Capacidad Total (kWh)</label>
                        <input type="text" class="form-control" id="countryInput" placeholder="Country"
                               :value="client && client.account[0] && client.account[0].cars[0] ? client.account[0].cars[0].capacityFullPower : ''" />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton type="submit" variant="secondary" @click="updatedata">
                          Updates
                        </BButton>
                        <BButton type="button" variant="soft-danger">
                          Cancel
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
              <BTab class="nav-item" title="Plan" :active="activeTab === 'planes'" @click="setActiveTab('planes')">
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="firstnameInput" placeholder="Enter your firstname" :value=" client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].name : ''" />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Descripción</label>
                        <input type="text" class="form-control" id="lastnameInput" placeholder="Enter your lastname" :value="client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].description : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Días</label>
                        <input type="text" class="form-control" id="phonenumberInput" placeholder="Enter your phone number" :value="client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].days : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Costo</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" :value="client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].cost : ''" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Total kWh</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" :value="client && client.account[0] && client.account[0].plans[0] ? client.account[0].plans[0].totalKWh : ''" />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton type="submit" variant="secondary" @click="updatedata">
                          Updates
                        </BButton>
                        <BButton type="button" variant="soft-danger">
                          Cancel
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
<!--              <BTab title="Change Password">
                <form action="javascript:void(0);">
                  <BRow class="g-2 pt-4">
                    <BCol lg="4">
                      <div>
                        <label for="oldpasswordInput" class="form-label">Old Password*</label>
                        <input type="password" class="form-control" id="oldpasswordInput"
                          placeholder="Enter current password" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div>
                        <label for="newpasswordInput" class="form-label">New Password*</label>
                        <input type="password" class="form-control" id="newpasswordInput"
                          placeholder="Enter new password" />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div>
                        <label for="confirmpasswordInput" class="form-label">Confirm Password*</label>
                        <input type="password" class="form-control" id="confirmpasswordInput"
                          placeholder="Confirm password" />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3">
                        <BLink href="javascript:void(0);" class="link-primary text-decoration-underline">Forgot
                          Password
                          ?</BLink>
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton type="submit" variant="secondary" @click="changepass">
                          Change Password
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
                <div class="mt-4 mb-3 border-bottom pb-2">
                  <div class="float-end">
                    <BLink href="javascript:void(0);" class="link-primary">All Logout</BLink>
                  </div>
                  <h5 class="card-title">Login History</h5>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="flex-shrink-0 avatar-sm">
                    <div class="avatar-title bg-light text-primary rounded-3 fs-18">
                      <i class="ri-smartphone-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6>iPhone 12 Pro</h6>
                    <p class="text-muted mb-0">
                      Los Angeles, United States - March 16 at 2:47PM
                    </p>
                  </div>
                  <div>
                    <BLink href="javascript:void(0);">Logout</BLink>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="flex-shrink-0 avatar-sm">
                    <div class="avatar-title bg-light text-primary rounded-3 fs-18">
                      <i class="ri-tablet-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6>Apple iPad Pro</h6>
                    <p class="text-muted mb-0">
                      Washington, United States - November 06 at 10:43AM
                    </p>
                  </div>
                  <div>
                    <BLink href="javascript:void(0);">Logout</BLink>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="flex-shrink-0 avatar-sm">
                    <div class="avatar-title bg-light text-primary rounded-3 fs-18">
                      <i class="ri-smartphone-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6>Galaxy S21 Ultra 5G</h6>
                    <p class="text-muted mb-0">
                      Conneticut, United States - June 12 at 3:24PM
                    </p>
                  </div>
                  <div>
                    <BLink href="javascript:void(0);">Logout</BLink>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 avatar-sm">
                    <div class="avatar-title bg-light text-primary rounded-3 fs-18">
                      <i class="ri-macbook-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6>Dell Inspiron 14</h6>
                    <p class="text-muted mb-0">
                      Phoenix, United States - July 26 at 8:10AM
                    </p>
                  </div>
                  <div>
                    <BLink href="javascript:void(0);">Logout</BLink>
                  </div>
                </div>
              </BTab>-->
<!--              <BTab title="Experience">
                <form>
                  <div id="newlink">
                    <div id="1">
                      <BRow class="pt-4">
                        <BCol lg="12">
                          <div class="mb-3">
                            <label for="jobTitle" class="form-label">Job Title</label>
                            <input type="text" class="form-control" id="jobTitle" placeholder="Job title"
                              value="Lead Designer / Developer" />
                          </div>
                        </BCol>
                        <BCol lg="6">
                          <div class="mb-3">
                            <label for="companyName" class="form-label">Company Name</label>
                            <input type="text" class="form-control" id="companyName" placeholder="Company name"
                              value="Themesbrand" />
                          </div>
                        </BCol>
                        <BCol lg="6">
                          <div class="mb-3">
                            <label for="experienceYear" class="form-label">Experience Years</label>
                            <BRow>
                              <BCol lg="5">
                                <Multiselect class="form-control" v-model="value2" :close-on-select="true"
                                  :searchable="true" :create-option="true" :options="[
                                    { value: '', label: 'Select years' },
                                    { value: 'Choice 1', label: '2001' },
                                    { value: 'Choice 2', label: '2002' },
                                    { value: 'Choice 3', label: '2003' },
                                    { value: 'Choice 4', label: '2004' },
                                    { value: 'Choice 5', label: '2005' },
                                    { value: 'Choice 6', label: '2006' },
                                    { value: 'Choice 7', label: '2007' },
                                    { value: 'Choice 8', label: '2008' },
                                    { value: 'Choice 9', label: '2009' },
                                    { value: 'Choice 10', label: '2010' },
                                    { value: 'Choice 11', label: '2011' },
                                    { value: 'Choice 12', label: '2012' },
                                    { value: 'Choice 13', label: '2013' },
                                    { value: 'Choice 14', label: '2014' },
                                    { value: 'Choice 15', label: '2015' },
                                    { value: 'Choice 16', label: '2016' },
                                    { value: 'Choice 17', label: '2017' },
                                    { value: 'Choice 18', label: '2018' },
                                    { value: 'Choice 19', label: '2019' },
                                    { value: 'Choice 20', label: '2020' },
                                    { value: 'Choice 21', label: '2021' },
                                    { value: 'Choice 22', label: '2022' }


                                  ]" />
                              </BCol>
                              <BCol cols="auto" class="align-self-center">to</BCol>
                              <BCol lg="5">


                                <Multiselect class="form-control" v-model="value1" :close-on-select="true"
                                  :searchable="true" :create-option="true" :options="[
                                    { value: '', label: 'Select years' },
                                    { value: 'Choice 1', label: '2001' },
                                    { value: 'Choice 2', label: '2002' },
                                    { value: 'Choice 3', label: '2003' },
                                    { value: 'Choice 4', label: '2004' },
                                    { value: 'Choice 5', label: '2005' },
                                    { value: 'Choice 6', label: '2006' },
                                    { value: 'Choice 7', label: '2007' },
                                    { value: 'Choice 8', label: '2008' },
                                    { value: 'Choice 9', label: '2009' },
                                    { value: 'Choice 10', label: '2010' },
                                    { value: 'Choice 11', label: '2011' },
                                    { value: 'Choice 12', label: '2012' },
                                    { value: 'Choice 13', label: '2013' },
                                    { value: 'Choice 14', label: '2014' },
                                    { value: 'Choice 15', label: '2015' },
                                    { value: 'Choice 16', label: '2016' },
                                    { value: 'Choice 17', label: '2017' },
                                    { value: 'Choice 18', label: '2018' },
                                    { value: 'Choice 19', label: '2019' },
                                    { value: 'Choice 20', label: '2020' },
                                    { value: 'Choice 21', label: '2021' },
                                    { value: 'Choice 22', label: '2022' }


                                  ]" />
                              </BCol>
                            </BRow>
                          </div>
                        </BCol>
                        <BCol lg="12">
                          <div class="mb-3">
                            <label for="jobDescription" class="form-label">Job Description</label>
                            <textarea class="form-control" id="jobDescription" rows="3" placeholder="Enter description">
You always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you're working with reputable font websites. </textarea>
                          </div>
                        </BCol>
                        <div class="hstack gap-2 justify-content-end">
                          <BLink class="btn btn-danger" href="javascript:void(0);">Delete</BLink>
                        </div>
                      </BRow>
                    </div>
                  </div>
                  <div id="newForm" style="display: none"></div>
                  <BCol lg="12">
                    <div class="hstack gap-2">
                      <BButton type="button" variant="primary">
                        Update
                      </BButton>
                      <BLink href="javascript:void(0);" class="btn btn-secondary">Add New</BLink>
                    </div>
                  </BCol>
                </form>
              </BTab>-->
<!--              <BTab title="Privacy Policy">
                <div class="mb-4 pb-2 pt-4">
                  <h5 class="card-title text-decoration-underline mb-3">
                    Security:
                  </h5>
                  <div class="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                    <div class="flex-grow-1">
                      <h6 class="fs-14 mb-1">Two-factor Authentication</h6>
                      <p class="text-muted">
                        Two-factor authentication is an enhanced security
                        meansur. Once enabled, you'll be required to give two
                        types of identification when you log into Google
                        Authentication and SMS are Supported.
                      </p>
                    </div>
                    <div class="flex-shrink-0 ms-sm-3">
                      <BLink href="javascript:void(0);" class="btn btn-sm btn-primary">Enable Two-facor Authentication
                      </BLink>
                    </div>
                  </div>
                  <div class="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                    <div class="flex-grow-1">
                      <h6 class="fs-14 mb-1">Secondary Verification</h6>
                      <p class="text-muted">
                        The first factor is a password and the second commonly
                        includes a text with a code sent to your smartphone, or
                        biometrics using your fingerprint, face, or retina.
                      </p>
                    </div>
                    <div class="flex-shrink-0 ms-sm-3">
                      <BLink href="javascript:void(0);" class="btn btn-sm btn-primary">Set up secondary method</BLink>
                    </div>
                  </div>
                  <div class="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                    <div class="flex-grow-1">
                      <h6 class="fs-14 mb-1">Backup Codes</h6>
                      <p class="text-muted mb-sm-0">
                        A backup code is automatically generated for you when
                        you turn on two-factor authentication through your iOS
                        or Android Twitter app. You can also generate a backup
                        code on twitter.com.
                      </p>
                    </div>
                    <div class="flex-shrink-0 ms-sm-3">
                      <BLink href="javascript:void(0);" class="btn btn-sm btn-primary">Generate backup codes</BLink>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <h5 class="card-title text-decoration-underline mb-3">
                    Application Notifications:
                  </h5>
                  <ul class="list-unstyled mb-0">
                    <li class="d-flex">
                      <div class="flex-grow-1">
                        <label for="directMessage" class="form-check-label fs-14">Direct messages</label>
                        <p class="text-muted">
                          Messages from people you follow
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="directMessage" checked />
                        </div>
                      </div>
                    </li>
                    <li class="d-flex mt-2">
                      <div class="flex-grow-1">
                        <label class="form-check-label fs-14" for="desktopNotification">
                          Show desktop notifications
                        </label>
                        <p class="text-muted">
                          Choose the option you want as your default setting.
                          Block a site: Next to "Not allowed to send
                          notifications," click Add.
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="desktopNotification"
                            checked />
                        </div>
                      </div>
                    </li>
                    <li class="d-flex mt-2">
                      <div class="flex-grow-1">
                        <label class="form-check-label fs-14" for="emailNotification">
                          Show email notifications
                        </label>
                        <p class="text-muted">
                          Under Settings, choose Notifications. Under Select an
                          account, choose the account to enable notifications
                          for.
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="emailNotification" />
                        </div>
                      </div>
                    </li>
                    <li class="d-flex mt-2">
                      <div class="flex-grow-1">
                        <label class="form-check-label fs-14" for="chatNotification">
                          Show chat notifications
                        </label>
                        <p class="text-muted">
                          To prevent duplicate mobile notifications from the
                          Gmail and Chat apps, in settings, turn off Chat
                          notifications.
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="chatNotification" />
                        </div>
                      </div>
                    </li>
                    <li class="d-flex mt-2">
                      <div class="flex-grow-1">
                        <label class="form-check-label fs-14" for="purchaesNotification">
                          Show purchase notifications
                        </label>
                        <p class="text-muted">
                          Get real-time purchase alerts to protect yourself from
                          fraudulent charges.
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="purchaesNotification" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 class="card-title text-decoration-underline mb-3">
                    Delete This Account:
                  </h5>
                  <p class="text-muted">
                    Go to the Data & Privacy section of your profile Account.
                    Scroll to "Your data & privacy options." Delete your Profile
                    Account. Follow the instructions to delete your account :
                  </p>
                  <div>
                    <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password"
                      value="make@321654987" style="max-width: 265px" />
                  </div>
                  <div class="hstack gap-2 mt-3">
                    <BLink href="javascript:void(0);" class="btn btn-soft-danger">Close & Delete This Account</BLink>
                    <BLink href="javascript:void(0);" class="btn btn-light">Cancel</BLink>
                  </div>
                </div>
              </BTab>-->
            </BTabs>
            </BNav>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardHeader class="align-items-center d-flex py-0">
            <BCardTitle class="mb-0 flex-grow-1">Mis Estaciones</BCardTitle>
            <div class="flex-shrink-0">
              <BDropdown variant="link" class="card-header-dropdown" toggle-class="text-reset dropdown-btn arrow-none"
                         menu-class="dropdown-menu-end" aria-haspopup="true" :offset="{ alignmentAxis: 25, crossAxis: 0, mainAxis: 0 }">
                <template #button-content> <span class="text-muted">01 Mar 2024 - 21 Jun 2024<i
                    class="mdi mdi-chevron-down ms-1"></i></span>
                </template>
                <BDropdownItem>Today</BDropdownItem>
                <BDropdownItem>Last Week</BDropdownItem>
                <BDropdownItem>Last Month</BDropdownItem>
                <BDropdownItem>Current Year</BDropdownItem>
              </BDropdown>
            </div>
          </BCardHeader>

          <BCardBody>
            <div class="table-responsive table-card">
              <table class="table table-borderless table-hover table-nowrap align-middle mb-0">
                <thead class="table-light">
                <tr class="text-muted">
                  <th scope="col">Ubicación</th>
                  <th scope="col" style="width: 20%">Última Carga</th>
                  <th scope="col">Nombre</th>
                  <th scope="col" style="width: 16%">Status</th>
                  <th scope="col" style="width: 12%">Costo por kWh</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(item, index) of dealsStatus" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.date }}</td>
                  <td>
                    <img :src="`${item.img}`" alt="" class="avatar-xs me-2" />
                    <BLink href="#javascript: void(0);" class="text-body fw-medium">{{ item.representativeName }}</BLink>
                  </td>
                  <td>
                <span
                    :class="{ 'badge bg-success-subtle text-success p-2': item.status == 'Disponible', 'badge bg-warning-subtle text-warning p-2': item.status == 'Llena', 'badge bg-danger-subtle text-danger p-2': item.status == 'No Disponible', 'badge bg-info-subtle text-info p-2': item.status == 'Terminando' }">{{
                    item.status }}</span>
                  </td>
                  <td>
                    <div class="text-nowrap">{{ item.statusValue }}</div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>