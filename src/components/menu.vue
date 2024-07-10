<script>
import {
  layoutComputed
} from "@/state/helpers";

export default {
  data() {
    return {
      userRole: null,
      settings: {
        minScrollbarLength: 60,
      },
    };
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
    },
  },

  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },


  mounted() {
    this.loadUserData();
    this.initActiveMenu();
    if (this.rmenu == 'vertical' && this.layoutType == 'twocolumn') {
      document.documentElement.setAttribute("data-layout", "vertical");
    }
    document.getElementById('overlay').addEventListener('click', () => {
      document.body.classList.remove('vertical-sidebar-enable');
    });

    window.addEventListener("resize", () => {
      if (this.layoutType == 'twocolumn') {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize < 767) {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = 'vertical';
          localStorage.setItem('rmenu', 'vertical');
        } else {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = 'twocolumn';
          localStorage.setItem('rmenu', 'twocolumn');
          setTimeout(() => {
            this.initActiveMenu();
          }, 50);

        }
      }
    });
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");

      collapses.forEach((collapse) => {
        // Hide sibling collapses on `show.bs.collapse`
        collapse.addEventListener("show.bs.collapse", (e) => {
          e.stopPropagation();
          let closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            let siblingCollapses =
              closestCollapse.querySelectorAll(".collapse");
            siblingCollapses.forEach((siblingCollapse) => {
              if (siblingCollapse.classList.contains("show")) {
                siblingCollapse.classList.remove("show");
                siblingCollapse.parentElement.firstChild.setAttribute("aria-expanded", "false");
              }
            });
          } else {
            let getSiblings = (elem) => {
              // Setup siblings array and get the first sibling
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              // Loop through each sibling and push to the array
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };
            let siblings = getSiblings(collapse.parentElement);
            siblings.forEach((item) => {
              if (item.childNodes.length > 2) {
                item.firstElementChild.setAttribute("aria-expanded", "false");
                item.firstElementChild.classList.remove("active");
              }
              let ids = item.querySelectorAll("*[id]");
              ids.forEach((item1) => {
                item1.classList.remove("show");
                item1.parentElement.firstChild.setAttribute("aria-expanded", "false");
                item1.parentElement.firstChild.classList.remove("active");
                if (item1.childNodes.length > 2) {
                  let val = item1.querySelectorAll("ul li a");

                  val.forEach((subitem) => {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        // Hide nested collapses on `hide.bs.collapse`
        collapse.addEventListener("hide.bs.collapse", (e) => {
          e.stopPropagation();
          let childCollapses = collapse.querySelectorAll(".collapse");
          childCollapses.forEach((childCollapse) => {
            let childCollapseInstance = childCollapse;
            childCollapseInstance.classList.remove("show");
            childCollapseInstance.parentElement.firstChild.setAttribute("aria-expanded", "false");
          });
        });
      });
    }

  },

  methods: {
    loadUserData() {
      const role = localStorage.getItem('userType');
      console.log(role); // Para verificar que se está obteniendo el rol correctamente
      this.userRole = role;
    },
    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0].offsetTop;
        if (currentPosition > 500)
          if (this.$refs.isSimplebar)
            this.$refs.isSimplebar.value.getScrollElement().scrollTop = currentPosition + 300;
      }
    },

    initActiveMenu() {
      const pathName = window.location.pathname;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const items = Array.from(ul.querySelectorAll("a.nav-link"));
        let activeItems = items.filter((x) => x.classList.contains("active"));
        this.removeActivation(activeItems);
        let matchingMenuItem = items.find((x) => {
          return x.getAttribute("href") === pathName;
        });
        if (matchingMenuItem) {
          this.activateParentDropdown(matchingMenuItem);
        } else {
          var id = pathName.replace("/", "");
          if (id) document.body.classList.add("twocolumn-panel");
          this.activateIconSidebarActive(pathName);
        }
      }
    },

    updateMenu(e, event) {

      document.body.classList.remove("twocolumn-panel");
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const items = Array.from(ul.querySelectorAll(".show"));
        items.forEach((item) => {
          item.classList.remove("show");
        });
      }
      const icons = document.getElementById("two-column-menu");
      if (icons) {
        const activeIcons = Array.from(
          icons.querySelectorAll(".nav-icon.active")
        );
        activeIcons.forEach((item) => {
          item.classList.remove("active");
        });
      }
      document.getElementById(e).classList.add("show");
      event.target.classList.add("active")
      this.activateIconSidebarActive("#" + e);
    },

    removeActivation(items) {
      items.forEach((item) => {
        if (item.classList.contains("menu-link")) {
          if (!item.classList.contains("active")) {
            item.setAttribute("aria-expanded", false);
          }
          item?.nextElementSibling?.classList?.remove("show");
        }
        if (item.classList.contains("nav-link")) {
          if (item.nextElementSibling) {
            item?.nextElementSibling?.classList?.remove("show");
          }
          item.setAttribute("aria-expanded", false);
        }
        item.classList.remove("active");
      });
    },

    activateParentDropdown(item) {
      // navbar-nav menu add active
      item.classList.add("active");
      let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
      if (parentCollapseDiv) {
        // to set aria expand true remaining
        parentCollapseDiv.classList.add("show");
        parentCollapseDiv.parentElement.children[0].classList.add("active");
        parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
        if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
          if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling) {
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling.parentElement.closest(".collapse.menu-dropdown")) {
              const grandparent = parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling.parentElement.closest(".collapse.menu-dropdown");
              this.activateIconSidebarActive("#" + grandparent.getAttribute("id"));
              grandparent.classList.add("show");
            }
          }
          this.activateIconSidebarActive("#" + parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")
            .getAttribute("id"));

          parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
          if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
            parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
          return false;
        }
        this.activateIconSidebarActive("#" + parentCollapseDiv.getAttribute("id"));
        return false;
      }
      return false;
    },

    activateIconSidebarActive(id) {
      var menu = document.querySelector("#two-column-menu .simplebar-content-wrapper a[href='" + id + "'].nav-icon");
      if (menu !== null) {
        menu.classList.add("active");
      }
    },

  },
};
</script>

<template>
  <BContainer fluid>
    <div id="two-column-menu"></div>

    <template v-if="layoutType === 'vertical' || layoutType === 'semibox'">
      <!--        MENU COMPAÑIA-->
      <ul v-if="userRole === 'company'" class="navbar-nav h-100" id="navbar-nav">
        <li class="menu-title">
          <span data-key="t-menu"> {{ $t("t-menu") }}</span>
        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/dashboard-company" >
            <i class="ri-dashboard-2-line"></i>
            <span data-key="t-dashboards"> Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/profile-company" >
            <i class="ri-home-office-fill"></i>
            <span data-key="t-dashboards"> Compañia</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/empleados-company" >
            <i class="ri-group-fill"></i>
            <span data-key="t-dashboards"> Empleados</span>
          </a>

        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/stations-company" >
            <i class="ri-battery-charge-line"></i>
            <span data-key="t-dashboards"> Estaciones de Carga</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/cargadores-company" >
            <i class="ri-charging-pile-2-fill"></i>
            <span data-key="t-dashboards"> Cargadores</span>
          </a>

        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/plan-company" >
            <i class="ri-survey-line"></i>
            <span data-key="t-dashboards"> Planes</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#sidebarlanding" data-bs-toggle="collapse" role="button" aria-expanded="false"
             aria-controls="sidebarlanding" data-key="t-projects">
            <i class="ri-sticky-note-line"></i>
            <span data-key="t-landing">Registros</span>
          </a>
          <div class="collapse menu-dropdown" id="sidebarlanding">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <span data-key="t-landing">Cargas</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <a href="/company/detalles-de-carga" >
                    <span data-key="t-landing">Detalles de Cargas</span>
                  </a>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <span data-key="t-landing">Cargas por usuario</span>
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <span data-key="t-landing">Cargas por terminal</span>
                </router-link>
              </li>


              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <span data-key="t-landing">Alarmas por cargador</span>
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="nav-link menu-link" target="" to="#">
                  <span data-key="t-landing">Errores de conector</span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>

<!--        MENU CLIENTE-->
      <ul v-else-if="userRole === 'client'" class="navbar-nav h-100" id="navbar-nav">
        <li class="menu-title">
          <span data-key="t-menu"> {{ $t("t-menu") }}</span>
        </li>
        <li class="nav-item">
          <router-link to="/client/dashboard-client" class="nav-link custom-abc" data-key="t-analytics">
            <i class="mdi mdi-view-dashboard text-muted fs-16 align-middle me-1"></i>
            {{ $t("Dashboard") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/client/profile-client" class="nav-link custom-abc" data-key="t-analytics">
            <i class="mdi mdi-account text-muted fs-16 align-middle me-1"></i>
            {{ $t("Perfil") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/client/subscription-plan" class="nav-link custom-abc" data-key="t-analytics">
            <i class="mdi mdi-nature text-muted fs-16 align-middle me-1"></i>
            {{ $t("Planes") }}
          </router-link>
        </li>
      </ul>

<!--        COSAS TEMPLATE-->

<!--        <div>
        <li class="menu-title">
          <span data-key="t-menu"> {{ $t("t-menu") }}</span>
        </li>
        <li class="nav-item">
          <a class="nav-link menu-link" href="/company/dashboard-company" >
            <i class="ri-dashboard-2-line"></i>
            <span data-key="t-dashboards"> Dashboard</span>
          </a>
          <div class="collapse menu-dropdown" id="sidebarDashboards">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link to="/dashboard/analytics" class="nav-link custom-abc" data-key="t-analytics">
                  {{ $t("t-analytics") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard/crm" class="nav-link" data-key="t-crm">
                  {{ $t("t-crm") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link" data-key="t-ecommerce">
                  {{ $t("t-ecommerce") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard/crypto" class="nav-link" data-key="t-crypto">
                  {{ $t("t-crypto") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard/projects" class="nav-link" data-key="t-projects">
                  {{ $t("t-projects") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard/nft" class="nav-link" data-key="t-nft">
                  {{ $t("t-nft") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dashboard/job" class="nav-link" data-key="t-job">
                  {{ $t("t-job") }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        &lt;!&ndash; end Dashboard Menu &ndash;&gt; -->
<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--            aria-controls="sidebarApps">-->
<!--            <i class="ri-apps-2-line"></i>-->
<!--            <span data-key="t-apps"> {{ $t("t-apps") }}</span>-->
<!--          </a>-->
<!--          <div class="collapse menu-dropdown" id="sidebarApps">-->
<!--            <ul class="nav nav-sm flex-column">-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link menu-link" href="#sidebarCalendar" data-bs-toggle="collapse" role="button"-->
<!--                  aria-expanded="false" aria-controls="sidebarCalendar" data-key="t-calendar">-->
<!--                  {{ $t("t-calendar") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarCalendar">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/main-calendar" class="nav-link" data-key="t-main-calender"> {{-->
<!--                        $t("t-main-calender") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/month-grid" class="nav-link" data-key="t-month-grid"> {{ $t("t-month-grid") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link to="/chat" class="nav-link" data-key="t-chat">-->
<!--                  {{ $t("t-chat") }}-->
<!--                </router-link>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebaremail" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebaremail" data-key="t-projects">-->
<!--                  {{ $t("t-email") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebaremail">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/mailbox" class="nav-link" data-key="t-mailbox">-->
<!--                        {{ $t("t-mailbox") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <a class="nav-link" href="#sidebarsubemail" data-bs-toggle="collapse" role="button"-->
<!--                        aria-expanded="false" aria-controls="sidebarsubemail" data-key="t-projects">-->
<!--                        {{ $t("t-email-templates") }}-->
<!--                      </a>-->
<!--                      <div class="collapse menu-dropdown" id="sidebarsubemail">-->
<!--                        <ul class="nav nav-sm flex-column">-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/email/email-basic" class="nav-link" data-key="t-products">-->
<!--                              {{ $t("t-basic-action") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/email/email-ecommerce" class="nav-link" data-key="t-products">-->
<!--                              {{ $t("t-ecommerce-action") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                        </ul>-->
<!--                      </div>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarEcommerce" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarEcommerce" data-key="t-ecommerce">-->
<!--                  {{ $t("t-ecommerce") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarEcommerce">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/products" class="nav-link" data-key="t-products">-->
<!--                        {{ $t("t-products") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/product-details" class="nav-link" data-key="t-product-Details">-->
<!--                        {{ $t("t-product-Details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/add-product" class="nav-link" data-key="t-create-product">-->
<!--                        {{ $t("t-create-product") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/orders" class="nav-link" data-key="t-orders">-->
<!--                        {{ $t("t-orders") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/order-details" class="nav-link" data-key="t-order-details">-->
<!--                        {{ $t("t-order-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/customers" class="nav-link" data-key="t-customers">-->
<!--                        {{ $t("t-customers") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/shopping-cart" class="nav-link" data-key="t-shopping-cart">-->
<!--                        {{ $t("t-shopping-cart") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/checkout" class="nav-link" data-key="t-checkout">-->
<!--                        {{ $t("t-checkout") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/sellers" class="nav-link" data-key="t-sellers">-->
<!--                        {{ $t("t-sellers") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/ecommerce/seller-details" class="nav-link" data-key="t-sellers-details">-->
<!--                        {{ $t("t-sellers-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarProjects" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarProjects" data-key="t-projects">-->
<!--                  {{ $t("t-projects") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarProjects">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/projects-list" class="nav-link" data-key="t-list">-->
<!--                        {{ $t("t-list") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/projects-overview" class="nav-link" data-key="t-overview">-->
<!--                        {{ $t("t-overview") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/projects-create" class="nav-link" data-key="t-create-project">-->
<!--                        {{ $t("t-create-project") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarTasks" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarTasks" data-key="t-tasks">-->
<!--                  {{ $t("t-tasks") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarTasks">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/tasks-kanban" class="nav-link" data-key="t-kanbanboard">-->
<!--                        {{ $t("t-kanbanboard") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/tasks-list-view" class="nav-link" data-key="t-list-view">-->
<!--                        {{ $t("t-list-view") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/tasks-details" class="nav-link" data-key="t-task-details">-->
<!--                        {{ $t("t-task-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarCRM" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarCRM" data-key="t-crm">-->
<!--                  {{ $t("t-crm") }}-->

<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarCRM">-->

<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/crm-contacts" class="nav-link" data-key="t-contacts">-->
<!--                        {{ $t("t-contacts") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/crm-companies" class="nav-link" data-key="t-companies">-->
<!--                        {{ $t("t-companies") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/crm-deals" class="nav-link" data-key="t-deals">-->
<!--                        {{ $t("t-deals") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/crm-leads" class="nav-link" data-key="t-leads">-->
<!--                        {{ $t("t-leads") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarCrypto" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarCrypto" data-key="t-crypto">-->
<!--                  {{ $t("t-crypto") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarCrypto">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/transactions" class="nav-link" data-key="t-transactions">-->
<!--                        {{ $t("t-transactions") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/buy-sell" class="nav-link" data-key="t-buy-sell">-->
<!--                        {{ $t("t-buy-sell") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/orders" class="nav-link" data-key="t-orders">-->
<!--                        {{ $t("t-orders") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/wallet" class="nav-link" data-key="t-my-wallet">-->
<!--                        {{ $t("t-my-wallet") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/ico" class="nav-link" data-key="t-ico-list">-->
<!--                        {{ $t("t-ico-list") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/crypto/kyc" class="nav-link" data-key="t-kyc-application">-->
<!--                        {{ $t("t-kyc-application") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarInvoices" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarInvoices" data-key="t-invoices">-->
<!--                  {{ $t("t-invoices") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarInvoices">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/invoices/list" class="nav-link" data-key="t-list-view">-->
<!--                        {{ $t("t-list-view") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/invoices/detail" class="nav-link" data-key="t-details">-->
<!--                        {{ $t("t-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/invoices/create" class="nav-link" data-key="t-create-invoice">-->
<!--                        {{ $t("t-create-invoice") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarTickets" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarTickets" data-key="t-supprt-tickets">-->
<!--                  {{ $t("t-supprt-tickets") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarTickets">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/tickets-list" class="nav-link" data-key="t-list-view">-->
<!--                        {{ $t("t-list-view") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/tickets-details" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-ticket-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#nftmarketplace" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="nftmarketplace" data-key="t-supprt-tickets">-->
<!--                  {{ $t("t-nft-marketplace") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="nftmarketplace">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-marketplace" class="nav-link" data-key="t-list-view">-->
<!--                        {{ $t("t-marketplace") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-explore" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-explore-now") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-auction" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-live-auction") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-item-detail" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-item-details") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-collection" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-collections") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-creators" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-creators") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-ranking" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-ranking") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-wallet" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-wallet-connect") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/apps/nft-create" class="nav-link" data-key="t-ticket-details">-->
<!--                        {{ $t("t-create-nft") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link to="/apps-file-manager" class="nav-link" data-key="t-file-manager">-->
<!--                  {{ $t("t-file-manager") }}-->
<!--                </router-link>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link to="/apps-todo" class="nav-link" data-key="t-to-do">-->
<!--                  {{ $t("t-to-do") }}-->
<!--                </router-link>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#jobs" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="jobs" data-key="t-jobs">-->
<!--                  {{ $t("t-jobs") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="jobs">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/jobs/statistics" class="nav-link" data-key="t-statistics">-->
<!--                        {{ $t("t-statistics") }}-->
<!--                      </router-link>-->
<!--                    </li>-->

<!--                    <li class="nav-item">-->
<!--                      <a class="nav-link" href="#sidebarjoblist" data-bs-toggle="collapse" role="button"-->
<!--                        aria-expanded="false" aria-controls="sidebarjoblist" data-key="t-projects">-->
<!--                        {{ $t("t-job-lists") }}-->
<!--                      </a>-->
<!--                      <div class="collapse menu-dropdown" id="sidebarjoblist">-->
<!--                        <ul class="nav nav-sm flex-column">-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/jobs/lists" class="nav-link" data-key="t-lists">-->
<!--                              {{ $t("t-lists") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/jobs/grid-lists" class="nav-link" data-key="t-grid">-->
<!--                              {{ $t("t-grid") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/jobs/details" class="nav-link" data-key="t-overview">-->
<!--                              {{ $t("t-overview") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                        </ul>-->
<!--                      </div>-->
<!--                    </li>-->

<!--                    <li class="nav-item">-->
<!--                      <a class="nav-link" href="#sidebarcandidatelists" data-bs-toggle="collapse" role="button"-->
<!--                        aria-expanded="false" aria-controls="sidebarcandidatelists" data-key="t-projects">-->
<!--                        {{ $t("t-candidate-lists") }}-->
<!--                      </a>-->
<!--                      <div class="collapse menu-dropdown" id="sidebarcandidatelists">-->
<!--                        <ul class="nav nav-sm flex-column">-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/jobs/candidate-lists" class="nav-link" data-key="t-lists">-->
<!--                              {{ $t("t-list-view") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                          <li class="nav-item">-->
<!--                            <router-link to="/jobs/candidate-grid" class="nav-link" data-key="t-grid">-->
<!--                              {{ $t("t-grid-view") }}-->
<!--                            </router-link>-->
<!--                          </li>-->
<!--                        </ul>-->
<!--                      </div>-->
<!--                    </li>-->

<!--                    <li class="nav-item">-->
<!--                      <router-link to="/jobs/application" class="nav-link" data-key="t-application">-->
<!--                        {{ $t("t-application") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/jobs/new" class="nav-link" data-key="t-new">-->
<!--                        {{ $t("t-new-job") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/jobs/companies-list" class="nav-link" data-key="t-companies-list">-->
<!--                        {{ $t("t-companies-list") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/jobs/categories" class="nav-link" data-key="t-job-categories">-->
<!--                        {{ $t("t-job-categories") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link to="/apps-api-key" class="nav-link" data-key="t-api-key">-->
<!--                  {{ $t("t-api-key") }}-->
<!--                </router-link>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </li>-->

<!--        <li class="menu-title">-->
<!--          <i class="ri-more-fill"></i>-->
<!--          <span data-key="t-pages">{{ $t("t-pages") }}</span>-->
<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="#sidebarAuth" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--            aria-controls="sidebarAuth">-->
<!--            <i class="ri-account-circle-line"></i>-->
<!--            <span data-key="t-authentication">{{-->
<!--              $t("t-authentication")-->
<!--            }}</span>-->
<!--          </a>-->
<!--          <div class="collapse menu-dropdown" id="sidebarAuth">-->
<!--            <ul class="nav nav-sm flex-column">-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarSignIn" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarSignIn" data-key="t-signin">{{ $t("t-signin") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarSignIn">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/signin-basic" class="nav-link" data-key="t-basic">{{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/signin-cover" class="nav-link" data-key="t-cover">{{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarSignUp" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarSignUp" data-key="t-signup">{{ $t("t-signup") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarSignUp">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/signup-basic" class="nav-link" data-key="t-basic">{{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/signup-cover" class="nav-link" data-key="t-cover">{{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarResetPass" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarResetPass" data-key="t-password-reset">-->
<!--                  {{ $t("t-password-reset") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarResetPass">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/reset-pwd-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/reset-pwd-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarcreatepassword" data-bs-toggle="collapse" role="button"-->
<!--                  aria-expanded="false" aria-controls="sidebarcreatepassword" data-key="t-lock-screen">-->
<!--                  {{ $t("t-password-create") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarcreatepassword">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/create-pwd-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/create-pwd-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarLockScreen" data-bs-toggle="collapse" role="button"-->
<!--                  aria-expanded="false" aria-controls="sidebarLockScreen" data-key="t-lock-screen">-->
<!--                  {{ $t("t-lock-screen") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarLockScreen">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/lockscreen-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/lockscreen-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarLogout" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarLogout" data-key="t-logout">-->
<!--                  {{ $t("t-logout") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarLogout">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/logout-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/logout-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarSuccessMsg" data-bs-toggle="collapse" role="button"-->
<!--                  aria-expanded="false" aria-controls="sidebarSuccessMsg" data-key="t-success-message">-->
<!--                  {{ $t("t-success-message") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarSuccessMsg">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/success-msg-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/success-msg-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarTwoStep" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarTwoStep" data-key="t-two-step-verification">-->
<!--                  {{ $t("t-two-step-verification") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarTwoStep">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/twostep-basic" class="nav-link" data-key="t-basic">-->
<!--                        {{ $t("t-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/twostep-cover" class="nav-link" data-key="t-cover">-->
<!--                        {{ $t("t-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarErrors" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                  aria-controls="sidebarErrors" data-key="t-errors">-->
<!--                  {{ $t("t-errors") }}-->
<!--                </a>-->
<!--                <div class="collapse menu-dropdown" id="sidebarErrors">-->
<!--                  <ul class="nav nav-sm flex-column">-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/404-basic" class="nav-link" data-key="t-404-basic">-->
<!--                        {{ $t("t-404-basic") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/404-cover" class="nav-link" data-key="t-404-cover">-->
<!--                        {{ $t("t-404-cover") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/404" class="nav-link" data-key="t-404-alt">-->
<!--                        {{ $t("t-404-alt") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/500" class="nav-link" data-key="t-500">-->
<!--                        {{ $t("t-500") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                    <li class="nav-item">-->
<!--                      <router-link to="/auth/ofline" class="nav-link" data-key="t-offline-page">-->
<!--                        {{ $t("t-offline-page") }}-->
<!--                      </router-link>-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->

<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="/company/profile-company" >-->
<!--            <i class="ri-home-office-fill"></i>-->
<!--            <span data-key="t-dashboards"> Compañia</span>-->
<!--          </a>-->

<!--        </li>-->


<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="/company/empleados-company" >-->
<!--            <i class="ri-group-fill"></i>-->
<!--            <span data-key="t-dashboards"> Empleados</span>-->
<!--          </a>-->

<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="/company/stations-company" >-->
<!--            <i class="ri-battery-charge-line"></i>-->
<!--            <span data-key="t-dashboards"> Estaciones de Carga</span>-->
<!--          </a>-->

<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="/company/cargadores-company" >-->
<!--            <i class="ri-charging-pile-2-fill"></i>-->
<!--            <span data-key="t-dashboards"> Cargadores</span>-->
<!--          </a>-->

<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="/company/plan-company" >-->
<!--            <i class="ri-survey-line"></i>-->
<!--            <span data-key="t-dashboards"> Planes</span>-->
<!--          </a>-->

<!--        </li>-->
<!--        <li class="nav-item">-->
<!--          <a class="nav-link" href="#sidebarlanding" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--            aria-controls="sidebarlanding" data-key="t-projects">-->
<!--            <i class="ri-sticky-note-line"></i>-->
<!--            <span data-key="t-landing">Registros</span>-->
<!--          </a>-->
<!--          <div class="collapse menu-dropdown" id="sidebarlanding">-->
<!--            <ul class="nav nav-sm flex-column">-->
<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <span data-key="t-landing">Cargas</span>-->
<!--                </router-link>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <a href="/company/detalles-de-carga" >-->
<!--                  <span data-key="t-landing">Detalles de Cargas</span>-->
<!--                  </a>-->
<!--                </router-link>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <span data-key="t-landing">Cargas por usuario</span>-->
<!--                </router-link>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <span data-key="t-landing">Cargas por terminal</span>-->
<!--                </router-link>-->
<!--              </li>-->


<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <span data-key="t-landing">Alarmas por cargador</span>-->
<!--                </router-link>-->
<!--              </li>-->

<!--              <li class="nav-item">-->
<!--                <router-link class="nav-link menu-link" target="" to="#">-->
<!--                  <span data-key="t-landing">Errores de conector</span>-->
<!--                </router-link>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </li>-->

<!--        <li class="nav-item">-->
<!--          <a class="nav-link menu-link" href="#sidebarMultilevel" data-bs-toggle="collapse" role="button"-->
<!--            aria-expanded="false" aria-controls="sidebarMultilevel">-->
<!--            <i class="ri-share-line"></i>-->
<!--            <span data-key="t-multi-level">{{ $t("t-multi-level") }}</span>-->
<!--          </a>-->
<!--          <div class="collapse menu-dropdown" id="sidebarMultilevel">-->
<!--            <ul class="nav nav-sm flex-column">-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" data-key="t-level-1.1">-->
<!--                  {{ $t("t-level-1.1") }}-->
<!--                </a>-->
<!--              </li>-->
<!--              <li class="nav-item">-->
<!--                <a class="nav-link" href="#sidebarAccount" data-bs-toggle="collapse" role="button" aria-expanded="false"-->
<!--                aria-controls="sidebarAccount" data-key="t-level-1.2">-->
<!--                {{ $t("t-level-1.2") }}-->
<!--              </a>-->
<!--              <div class="collapse menu-dropdown" id="sidebarAccount">-->
<!--                <ul class="nav nav-sm flex-column">-->
<!--                  <li class="nav-item">-->
<!--                    <a class="nav-link" data-key="t-level-2.1">-->
<!--                      {{ $t("t-level-2.1") }}-->
<!--                    </a>-->
<!--                  </li>-->
<!--                  <li class="nav-item">-->
<!--                    <a class="nav-link" href="#sidebarlevel" data-bs-toggle="collapse" role="button"-->
<!--                      aria-expanded="false" aria-controls="sidebarlevel" data-key="t-level-2.2">-->
<!--                      {{ $t("t-level-2.2") }}-->
<!--                    </a>-->
<!--                    <div class="collapse menu-dropdown" id="sidebarlevel">-->
<!--                      <ul class="nav nav-sm flex-column">-->
<!--                        <li class="nav-item">-->
<!--                          <a class="nav-link" data-key="t-level-3.1">-->
<!--                            {{ $t("t-level-3.1") }}-->
<!--                          </a>-->
<!--                        </li>-->
<!--                        <li class="nav-item">-->
<!--                          <a class="nav-link" data-key="t-level-3.2">-->
<!--                            {{ $t("t-level-3.2") }}-->
<!--                          </a>-->
<!--                        </li>-->
<!--                      </ul>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </li>-->
  </template>
</BContainer></template>