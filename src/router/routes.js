import store from "@/state/store";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/login.vue"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          return next({ name: "default" });
        } else {
          // Continue to the login page
          return next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/account/register.vue"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          return next({ name: "default" });
        } else {
          // Continue to the register page
          return next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/account/forgot-password.vue"),
    meta: {
      title: "Forgot Password",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          return next({ name: "default" });
        } else {
          // Continue to the forgot password page
          return next();
        }
      },
    },
  },
  {
    path: "/",
    name: "default",
    meta: {
      title: "Login",
    },
    component: () => import("../views/account/login.vue"),
    // component: () => import("../views/auth/signin/basic.vue"),
  },
  {
    path: "/dashboard/crypto",
    name: "dashboard-crypto",
    meta: {
      title: "Crypto",
      authRequired: true,
    },
    component: () => import("../views/dashboard/crypto/index"),
  },
  {
    path: "/dashboard/projects",
    name: "dashboard-projects",
    meta: {
      title: "Projects", authRequired: true,
    },
    component: () => import("../views/dashboard/projects/index"),
  },
  {
    path: "/dashboard/crm",
    name: "dashboard-crm",
    meta: {
      title: "CRM", authRequired: true,
    },
    component: () => import("../views/dashboard/crm/index"),
  },
  {
    path: "/dashboard/analytics",
    name: "dashboard-analytics",
    meta: {
      title: "Analytics", authRequired: true,
    },
    component: () => import("../views/dashboard/analytics/index"),
  },
  {
    path: "/dashboard/nft",
    name: "dashboard-nft",
    meta: {
      title: "NFT Dashboard", authRequired: true,
    },
    component: () => import("../views/dashboard/nft/index"),
  },
  {
    path: "/dashboard/job",
    name: "dashboard-job",
    meta: {
      title: "Job Dashboard", authRequired: true,
    },
    component: () => import("../views/dashboard/job/index"),
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      title: "Logout",
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        const savedEmail = localStorage.getItem("email");
        // const savedPassword = localStorage.getItem("password");
        localStorage.clear();
        if (savedEmail) {
          localStorage.setItem("email", savedEmail);
        }
        // if(savedPassword){
        //   localStorage.setItem("password", savedPassword);
        // }
        sessionStorage.clear();
        next();
      },
    },
    component: () => import("../views/auth/logout/basic"),
  },
  {
    path: "/main-calendar",
    name: "main-calendar",
    meta: { title: "Calendar", authRequired: true },
    component: () => import("../views/calendar/main"),
  },
  {
    path: "/month-grid",
    name: "month-grid",
    meta: { title: "Mont Grid", authRequired: true },
    component: () => import("../views/calendar/month"),
  },
  {
    path: "/chat",
    name: "chat",
    meta: { title: "Chat", authRequired: true },
    component: () => import("../views/apps/chat"),
  },
  {
    path: "/apps-file-manager",
    name: "file manager",
    meta: { title: "File Manager", authRequired: true },
    component: () => import("../views/apps/filemanager"),
  },
  {
    path: "/apps-todo",
    name: "To Do List",
    meta: { title: "To Do List", authRequired: true },
    component: () => import("../views/apps/todo"),
  },
  {
    path: "/mailbox",
    name: "mailbox",
    meta: { title: "Mailbox", authRequired: true },
    component: () => import("../views/apps/email/mailbox"),
  },
  {
    path: "/email/email-basic",
    name: "email-basic",
    meta: { title: "Basic Action", authRequired: true },
    component: () => import("../views/apps/email/email-basic"),
  },
  {
    path: "/email/email-ecommerce",
    name: "email-ecommerce",
    meta: { title: "Ecommerce Action", authRequired: true },
    component: () => import("../views/apps/email/email-ecommerce"),
  },
  {
    path: "/apps/nft-auction",
    name: "auction",
    meta: { title: "Live Auction", authRequired: true },
    component: () => import("../views/apps/nft/nft-auction"),
  },
  {
    path: "/apps/nft-collection",
    name: "collection",
    meta: { title: "Collactions", authRequired: true },
    component: () => import("../views/apps/nft/nft-collection"),
  },
  {
    path: "/apps/nft-create",
    name: "create",
    meta: { title: "Create", authRequired: true },
    component: () => import("../views/apps/nft/nft-create"),
  },
  {
    path: "/apps/nft-creators",
    name: "creators",
    meta: { title: "Creators", authRequired: true },
    component: () => import("../views/apps/nft/nft-creators"),
  },
  {
    path: "/apps/nft-explore",
    name: "explore",
    meta: { title: "Explore Now", authRequired: true },
    component: () => import("../views/apps/nft/nft-explore"),
  },
  {
    path: "/apps/nft-item-detail",
    name: "item-detail",
    meta: { title: "Item Detail", authRequired: true },
    component: () => import("../views/apps/nft/nft-item-detail"),
  },
  {
    path: "/apps/nft-marketplace",
    name: "marketplace",
    meta: { title: "Marketplace", authRequired: true },
    component: () => import("../views/apps/nft/nft-marketplace"),
  },
  {
    path: "/apps/nft-ranking",
    name: "ranking",
    meta: { title: "Ranking", authRequired: true },
    component: () => import("../views/apps/nft/nft-ranking"),
  },
  {
    path: "/apps/nft-wallet",
    name: "nft-wallet",
    meta: { title: "Wallet", authRequired: true },
    component: () => import("../views/apps/nft/nft-wallet"),
  },
  {
    path: "/apps/projects-list",
    name: "projects-list",
    meta: { title: "Projects List", authRequired: true },
    component: () => import("../views/apps/projects/list"),
  },
  {
    path: "/apps/projects-overview",
    name: "projects Overview",
    meta: { title: "Projects Overview", authRequired: true },
    component: () => import("../views/apps/projects/overview"),
  },
  {
    path: "/apps/projects-create",
    name: "projects-create",
    meta: { title: "Projects Create", authRequired: true },
    component: () => import("../views/apps/projects/create"),
  },
  {
    path: "/apps/tasks-details",
    name: "tasks-details",
    meta: { title: "Tasks Details", authRequired: true },
    component: () => import("../views/apps/tasks/details"),
  },
  {
    path: "/apps/tasks-kanban",
    name: "tasks-kanban",
    meta: { title: "Tasks Kanban", authRequired: true },
    component: () => import("../views/apps/tasks/kanban"),
  },
  {
    path: "/apps/tasks-list-view",
    name: "tasks-list-view",
    meta: { title: "Taks List", authRequired: true },
    component: () => import("../views/apps/tasks/list-view"),
  },
  {
    path: "/apps/tickets-details",
    name: "tickets-details",
    meta: { title: "Ticket Details", authRequired: true },
    component: () => import("../views/tickets/details"),
  },
  {
    path: "/apps/tickets-list",
    name: "tickets-list",
    meta: { title: "Tickets List", authRequired: true },
    component: () => import("../views/tickets/list"),
  },
  {
    path: "/apps/crm-contacts",
    name: "crm-contacts",
    meta: { title: "CRM Contacts", authRequired: true },
    component: () => import("../views/apps/crm/contacts"),
  },
  {
    path: "/apps/crm-companies",
    name: "crm-companies",
    meta: { title: "CRM companies", authRequired: true },
    component: () => import("../views/apps/crm/companies"),
  },
  {
    path: "/apps/crm-deals",
    name: "crm-deals",
    meta: { title: "CRM Deals", authRequired: true },
    component: () => import("../views/apps/crm/deals"),
  },
  {
    path: "/apps/crm-leads",
    name: "crm-leads",
    meta: { title: "CRM Leads", authRequired: true },
    component: () => import("../views/apps/crm/leads"),
  },
  {
    path: "/ecommerce/customers",
    name: "customers",
    meta: { title: "Customers", authRequired: true },
    component: () => import("../views/apps/ecommerce/customers"),
  },
  {
    path: "/ecommerce/products",
    name: "products",
    meta: { title: "Products", authRequired: true },
    component: () => import("../views/apps/ecommerce/products"),
  },
  {
    path: "/ecommerce/product-details",
    name: "product-detail",
    meta: { title: "Product Details", authRequired: true },
    component: () => import("../views/apps/ecommerce/product-details"),
  },
  {
    path: "/ecommerce/orders",
    name: "orders",
    meta: { title: "Orders", authRequired: true },
    component: () => import("../views/apps/ecommerce/orders"),
  },
  {
    path: "/ecommerce/order-details",
    name: "order-details",
    meta: { title: "Order Details", authRequired: true },
    component: () => import("../views/apps/ecommerce/order-details"),
  },
  {
    path: "/ecommerce/add-product",
    name: "add-product",
    meta: { title: "Create Product", authRequired: true },
    component: () => import("../views/apps/ecommerce/add-product"),
  },
  {
    path: "/ecommerce/shopping-cart",
    name: "shopping cart",
    meta: { title: "Shopping Cart", authRequired: true },
    component: () => import("../views/apps/ecommerce/shopping-cart"),
  },
  {
    path: "/ecommerce/checkout",
    name: "checkout",
    meta: { title: "Check Out", authRequired: true },
    component: () => import("../views/apps/ecommerce/checkout"),
  },
  {
    path: "/ecommerce/sellers",
    name: "sellers",
    meta: { title: "Sellers", authRequired: true },
    component: () => import("../views/apps/ecommerce/sellers"),
  },
  {
    path: "/ecommerce/seller-details",
    name: "seller-details",
    meta: { title: "Seller Details", authRequired: true },
    component: () => import("../views/apps/ecommerce/seller-details"),
  },
  {
    path: "/crypto/buy-sell",
    name: "buy/sell",
    meta: { title: "Buy & Sell", authRequired: true },
    component: () => import("../views/apps/crypto/buy-sell"),
  },
  {
    path: "/crypto/kyc",
    name: "kyc",
    meta: { title: "KYC Application", authRequired: true },
    component: () => import("../views/apps/crypto/kyc"),
  },
  {
    path: "/crypto/ico",
    name: "ico",
    meta: { title: "ICO List", authRequired: true },
    component: () => import("../views/apps/crypto/ico"),
  },
  {
    path: "/crypto/orders",
    name: "crypto-orders",
    meta: { title: "Orders", authRequired: true },
    component: () => import("../views/apps/crypto/orders"),
  },
  {
    path: "/crypto/wallet",
    name: "wallet",
    meta: { title: "My Wallet", authRequired: true },
    component: () => import("../views/apps/crypto/wallet"),
  },
  {
    path: "/crypto/transactions",
    name: "transactions",
    meta: { title: "Transactions", authRequired: true },
    component: () => import("../views/apps/crypto/transactions"),
  },
  {
    path: "/invoices/detail/:id?",
    name: "invoice-detail",
    meta: { title: "Invoice Details", authRequired: true },
    component: () => import("../views/apps/invoices/details"),
  },
  {
    path: "/invoices/list",
    name: "invoice-list",
    meta: { title: "Invoice List", authRequired: true },
    component: () => import("../views/apps/invoices/list"),
  },
  {
    path: "/invoices/create",
    name: "invoice-create",
    meta: { title: "Create Invoice", authRequired: true },
    component: () => import("../views/apps/invoices/create"),
  },
  {
    path: "/jobs/application",
    name: "job-application",
    meta: { title: "Job Application", authRequired: true },
    component: () => import("../views/apps/jobs/application"),
  },
  {
    path: "/jobs/candidate-grid",
    name: "job-candidate-grid",
    meta: { title: "Candidate Grid", authRequired: true },
    component: () => import("../views/apps/jobs/candidate-grid"),
  },
  {
    path: "/jobs/candidate-lists",
    name: "job-candidate-lists",
    meta: { title: "Candidate Lists", authRequired: true },
    component: () => import("../views/apps/jobs/candidate-lists"),
  },
  {
    path: "/jobs/categories",
    name: "job-categories",
    meta: { title: "Job Categories", authRequired: true },
    component: () => import("../views/apps/jobs/categories"),
  },
  {
    path: "/jobs/companies-list",
    name: "job-companies-list",
    meta: { title: "Companies List", authRequired: true },
    component: () => import("../views/apps/jobs/companies-list"),
  },
  {
    path: "/jobs/details",
    name: "job-details",
    meta: { title: "Job Details", authRequired: true },
    component: () => import("../views/apps/jobs/details"),
  },
  {
    path: "/jobs/grid-lists",
    name: "job-grid-lists",
    meta: { title: "Grid Lists", authRequired: true },
    component: () => import("../views/apps/jobs/grid-lists"),
  },
  {
    path: "/jobs/lists",
    name: "job-lists",
    meta: { title: "Job Lists", authRequired: true },
    component: () => import("../views/apps/jobs/lists"),
  },
  {
    path: "/jobs/new",
    name: "job-new",
    meta: { title: "New Job", authRequired: true },
    component: () => import("../views/apps/jobs/new"),
  },
  {
    path: "/jobs/statistics",
    name: "job-statistics",
    meta: { title: "Job Statistics", authRequired: true },
    component: () => import("../views/apps/jobs/statistics"),
  },
  {
    path: "/apps-api-key",
    name: "API Key",
    meta: { title: "API Key", authRequired: true },
    component: () => import("../views/apps/apikey"),
  },

  {
    path: "/ui/alerts",
    name: "Alerts",
    meta: {
      title: "Alerts", authRequired: true,
    },
    component: () => import("../views/ui/alerts"),
  },
  {
    path: "/ui/buttons",
    name: "Buttons",
    meta: {
      title: "Buttons", authRequired: true,
    },
    component: () => import("../views/ui/buttons"),
  },
  {
    path: "/ui/cards",
    name: "Cards",
    meta: { title: "Cards", authRequired: true },
    component: () => import("../views/ui/cards"),
  },
  {
    path: "/ui/carousel",
    name: "Carousel",
    meta: { title: "Carousel", authRequired: true },
    component: () => import("../views/ui/carousel"),
  },
  {
    path: "/ui/dropdowns",
    name: "Dropdowns",
    meta: { title: "Dropdowns", authRequired: true },
    component: () => import("../views/ui/dropdowns"),
  },
  {
    path: "/ui/grid",
    name: "Grid",
    meta: { title: "Grid", authRequired: true },
    component: () => import("../views/ui/grid"),
  },
  {
    path: "/ui/images",
    name: "Images",
    meta: { title: "Images", authRequired: true },
    component: () => import("../views/ui/images"),
  },
  {
    path: "/ui/modals",
    name: "Modals",
    meta: { title: "Modals", authRequired: true },
    component: () => import("../views/ui/modals"),
  },
  {
    path: "/ui/offcanvas",
    name: "offcanvas",
    meta: { title: "Offcanvas", authRequired: true },
    component: () => import("../views/ui/offcanvas"),
  },
  {
    path: "/ui/progress",
    name: "Progress",
    meta: { title: "Progress", authRequired: true },
    component: () => import("../views/ui/progress"),
  },
  {
    path: "/ui/placeholders",
    name: "Placeholders",
    meta: { title: "Placeholders", authRequired: true },
    component: () => import("../views/ui/placeholders"),
  },
  {
    path: "/ui/accordions",
    name: "accordions",
    meta: { title: "Accordions", authRequired: true },
    component: () => import("../views/ui/accordions"),
  },
  {
    path: "/ui/tabs",
    name: "tabs",
    meta: { title: "Tabs", authRequired: true },
    component: () => import("../views/ui/tabs"),
  },
  {
    path: "/ui/typography",
    name: "Typography",
    meta: { title: "Typography", authRequired: true },
    component: () => import("../views/ui/typography"),
  },
  {
    path: "/ui/embed-video",
    name: "embed-video",
    meta: { title: "Embed Video", authRequired: true },
    component: () => import("../views/ui/embed-video"),
  },
  {
    path: "/ui/ribbons",
    name: "ribbons",
    meta: { title: "Ribbons", authRequired: true },
    component: () => import("../views/ui/ribbons"),
  },
  {
    path: "/ui/lists",
    name: "lists",
    meta: { title: "Lists", authRequired: true },
    component: () => import("../views/ui/lists"),
  },
  {
    path: "/ui/links",
    name: "links",
    meta: { title: "Links", authRequired: true },
    component: () => import("../views/ui/links"),
  },
  {
    path: "/ui/utilities",
    name: "utilities",
    meta: { title: "Utilities", authRequired: true },
    component: () => import("../views/ui/utilities"),
  },
  {
    path: "/ui/notifications",
    name: "notifications",
    meta: { title: "Notifications", authRequired: true },
    component: () => import("../views/ui/notifications"),
  },
  {
    path: "/ui/general",
    name: "General",
    meta: { title: "General", authRequired: true },
    component: () => import("../views/ui/general"),
  },
  {
    path: "/ui/colors",
    name: "Colors",
    meta: { title: "Colors", authRequired: true },
    component: () => import("../views/ui/colors"),
  },
  {
    path: "/ui/badges",
    name: "badges",
    meta: { title: "Badges", authRequired: true },
    component: () => import("../views/ui/badges"),
  },
  {
    path: "/ui/media",
    name: "media",
    meta: { title: "Media", authRequired: true },
    component: () => import("../views/ui/media"),
  },
  {
    path: "/widgets",
    name: "widgets",
    meta: { title: "Widgets", authRequired: true },
    component: () => import("../views/widgets/index"),
  },
  {
    path: "/icons/boxicons",
    name: "boxicons-icon",
    meta: { title: "Boxicons", authRequired: true },
    component: () => import("../views/icons/boxicons"),
  },
  {
    path: "/icons/materialdesign",
    name: "Material Design",
    meta: { title: "Material Design", authRequired: true },
    component: () => import("../views/icons/materialdesign"),
  },
  {
    path: "/icons/feather",
    name: "feather",
    meta: { title: "Feather", authRequired: true },
    component: () => import("../views/icons/feather"),
  },
  {
    path: "/icons/lineawesome",
    name: "lineawesome",
    meta: { title: "Line Awesome", authRequired: true },
    component: () => import("../views/icons/lineawesome"),
  },
  {
    path: "/icons/remix",
    name: "remix",
    meta: { title: "Remix", authRequired: true },
    component: () => import("../views/icons/remix"),
  },
  {
    path: "/icons/crypto",
    name: "crypto",
    meta: { title: "Crypto", authRequired: true },
    component: () => import("../views/icons/crypto"),
  },
  {
    path: "/tables/basic",
    name: "basic-table",
    meta: { title: "Basic Table", authRequired: true },
    component: () => import("../views/tables/basic"),
  },
  {
    path: "/tables/gridjs",
    name: "gridjs",
    meta: { title: "Grid JS", authRequired: true },
    component: () => import("../views/tables/grid/index"),
  },
  {
    path: "/form/advanced",
    name: "form-advanced",
    meta: { title: "Form Advance", authRequired: true },
    component: () => import("../views/forms/advanced"),
  },
  {
    path: "/form/elements",
    name: "form-elements",
    meta: { title: "Form Elements", authRequired: true },
    component: () => import("../views/forms/elements"),
  },
  {
    path: "/form/layouts",
    name: "Form Layouts",
    meta: { title: "Form Layouts", authRequired: true },
    component: () => import("../views/forms/layouts"),
  },
  {
    path: "/form/editors",
    name: "Form Editors",
    meta: { title: "Form Editors", authRequired: true },
    component: () => import("../views/forms/editors"),
  },
  {
    path: "/form/file-uploads",
    name: "File Uploads",
    meta: { title: "File Uploads", authRequired: true },
    component: () => import("../views/forms/file-uploads"),
  },
  {
    path: "/form/validation",
    name: "Form Validation",
    meta: { title: "Form Validation", authRequired: true },
    component: () => import("../views/forms/validation"),
  },
  {
    path: "/form/wizard",
    name: "Form Wizard",
    meta: { title: "Form Wizard", authRequired: true },
    component: () => import("../views/forms/wizard"),
  },
  {
    path: "/form/masks",
    name: "form-mask",
    meta: { title: "Form Mask", authRequired: true },
    component: () => import("../views/forms/masks"),
  },
  {
    path: "/form/pickers",
    name: "form-pickers",
    meta: { title: "Form Picker", authRequired: true },
    component: () => import("../views/forms/pickers"),
  },
  {
    path: "/form/range-sliders",
    name: "form-range-slider",
    meta: { title: "Form Range Slider", authRequired: true },
    component: () => import("../views/forms/range-sliders"),
  },
  {
    path: "/form/select",
    name: "form-select",
    meta: { title: "Form Select", authRequired: true },
    component: () => import("../views/forms/select"),
  },
  {
    path: "/form/checkboxs-radios",
    name: "form-checkboxs-radio",
    meta: { title: "Checkboxs & Radios", authRequired: true },
    component: () => import("../views/forms/checkboxs-radios"),
  },
  {
    path: "/landing",
    name: "landing",
    meta: { title: "Landing", authRequired: true },
    component: () => import("../views/landing/index"),
  },
  {
    path: "/nft-landing",
    name: "nft-landing",
    meta: { title: "NFT Landing", authRequired: true },
    component: () => import("../views/landing/nft-landing"),
  },
  {
    path: "/job-landing",
    name: "job-landing",
    meta: { title: "Job Landing", authRequired: true },
    component: () => import("../views/landing/job-landing"),
  },
  {
    path: "/pages/starter",
    name: "starter",
    meta: { title: "Starter", authRequired: true },
    component: () => import("../views/pages/starter"),
  },
  {
    path: "/pages/profile",
    name: "profile",
    meta: { title: "Profile", authRequired: true },
    component: () => import("../views/pages/profile/simple"),
  },
  {
    path: "/pages/profile-setting",
    name: "profile-setting",
    meta: { title: "Setting", authRequired: true },
    component: () => import("../views/pages/profile/setting"),
  },
  {
    path: "/pages/maintenance",
    name: "maintenance",
    meta: { title: "Maintanance", authRequired: true },
    component: () => import("../views/pages/maintenance"),
  },
  {
    path: "/pages/coming-soon",
    name: "coming-soon",
    meta: { title: "Comming Soon", authRequired: true },
    component: () => import("../views/pages/coming-soon"),
  },
  {
    path: "/pages/timeline",
    name: "timeline",
    meta: { title: "Timeline", authRequired: true },
    component: () => import("../views/pages/timeline"),
  },
  {
    path: "/pages/faqs",
    name: "FAQs",
    meta: { title: "FAQs", authRequired: true },
    component: () => import("../views/pages/faqs"),
  },
  {
    path: "/pages/pricing",
    name: "pricing",
    meta: { title: "Pricing", authRequired: true },
    component: () => import("../views/pages/pricing"),
  },
  {
    path: "/pages/team",
    name: "team",
    meta: { title: "Team", authRequired: true },
    component: () => import("../views/pages/team"),
  },
  {
    path: "/pages/search-results",
    name: "search-results",
    meta: { title: "Search Results", authRequired: true },
    component: () => import("../views/pages/search-results"),
  },
  {
    path: "/pages/sitemap",
    name: "sitemap",
    meta: { title: "Sitemap", authRequired: true },
    component: () => import("../views/pages/sitemap"),
  },
  {
    path: "/pages/privacy-policy",
    name: "privacy-policy",
    meta: { title: "Privacy Policy", authRequired: true },
    component: () => import("../views/pages/privacy-policy"),
  },
  {
    path: "/pages/term-conditions",
    name: "term-conditions",
    meta: { title: "Term Conditions", authRequired: true },
    component: () => import("../views/pages/term-conditions"),
  },
  {
    path: "/charts/chartjs",
    name: "chartjs-chart",
    meta: { title: "Chartjs", authRequired: true },
    component: () => import("../views/charts/chartjs/index"),
  },
  {
    path: "/charts/echart",
    name: "echart",
    meta: { title: "Echarts", authRequired: true },
    component: () => import("../views/charts/echart/index"),
  },
  {
    path: '/charts/apex-line',
    name: 'line',
    meta: {
      title: "Line Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/line/index')
  },
  {
    path: '/charts/apex-area',
    name: 'area-chart',
    meta: {
      title: "Area Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/area/index')
  },
  {
    path: '/charts/apex-bar',
    name: 'bar-chart',
    meta: {
      title: "Bar Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/bar/index')
  },
  {
    path: '/charts/apex-column',
    name: 'column-chart',
    meta: {
      title: "Column Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/column/index')
  },

  {
    path: '/charts/apex-mixed',
    name: 'mixed-chart',
    meta: {
      title: "Mixed Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/mixed/index')
  },
  {
    path: '/charts/apex-range-area',
    name: 'range-area-chart',
    meta: {
      title: "Range Area Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/rangearea/index')
  },
  {
    path: '/charts/apex-funnel',
    name: 'funnel-chart',
    meta: {
      title: "Funnel Charts", authRequired: true,
    },
    component: () => import('../views/charts/apex/funnel/index')
  },
  {
    path: '/charts/apex-candlestick',
    name: 'candlestick',
    meta: {
      title: "Candlestick", authRequired: true,
    },
    component: () => import('../views/charts/apex/candlestick/index')
  },
  {
    path: '/charts/apex-boxplot',
    name: 'boxplot',
    meta: {
      title: "Boxplot", authRequired: true,
    },
    component: () => import('../views/charts/apex/boxplot/index')
  },
  {
    path: '/charts/apex-bubble',
    name: 'bubble',
    meta: {
      title: "Bubble Chart", authRequired: true,
    },
    component: () => import('../views/charts/apex/bubble/index')
  },
  {
    path: '/charts/apex-scatter',
    name: 'scatter',
    meta: {
      title: "Scatter", authRequired: true,
    },
    component: () => import('../views/charts/apex/scatter/index')
  },
  {
    path: '/charts/apex-heatmap',
    name: 'heatmap',
    meta: {
      title: "Heatmap", authRequired: true,
    },
    component: () => import('../views/charts/apex/heatmap/index')
  },
  {
    path: '/charts/apex-treemap',
    name: 'treemap',
    meta: {
      title: "Treemap", authRequired: true,
    },
    component: () => import('../views/charts/apex/treemap/index')
  },
  {
    path: '/charts/apex-pie',
    name: 'pie',
    meta: {
      title: "Apex Pie", authRequired: true,
    },
    component: () => import('../views/charts/apex/pie/index')
  },
  {
    path: '/charts/apex-radialbar',
    name: 'radialbar',
    meta: {
      title: "Apex Radialbar", authRequired: true,
    },
    component: () => import('../views/charts/apex/radiabar/index')
  },
  {
    path: '/charts/apex-radar',
    name: 'radar',
    meta: {
      title: "Apex Radar", authRequired: true,
    },
    component: () => import('../views/charts/apex/radar/index')
  },
  {
    path: '/charts/apex-polararea',
    name: 'polararea',
    meta: {
      title: "Polararea", authRequired: true,
    },
    component: () => import('../views/charts/apex/polararea/index')
  },
  {
    path: '/advance-ui/animation',
    name: 'animation',
    meta: {
      title: "Animation", authRequired: true,
    },
    component: () => import('../views/advance-ui/animation')
  },
  {
    path: '/advance-ui/highlight',
    name: 'highlight',
    meta: {
      title: "Highlight", authRequired: true,
    },
    component: () => import('../views/advance-ui/highlight')
  },
  {
    path: '/advance-ui/scrollbar',
    name: 'scrollbar',
    meta: {
      title: "Scrollbar", authRequired: true,
    },
    component: () => import('../views/advance-ui/scrollbar')
  },
  {
    path: '/advance-ui/scrollspy',
    name: 'scrollspy',
    meta: {
      title: "Scrollspy", authRequired: true,
    },
    component: () => import('../views/advance-ui/scrollspy')
  },
  {
    path: '/advance-ui/sweetalerts',
    name: 'sweetalerts',
    meta: {
      title: "Sweet Alerts", authRequired: true,
    },
    component: () => import('../views/advance-ui/sweetalerts')
  },
  {
    path: '/advance-ui/swiper',
    name: 'Swiper Slider',
    meta: {
      title: "Swiper", authRequired: true,
    },
    component: () => import('../views/advance-ui/swiper')
  },
  {
    path: '/auth/signin-basic',
    name: 'signin-basic',
    meta: {
      title: "Signin Basic", authRequired: true,
    },
    component: () => import('../views/auth/signin/basic')
  },
  {
    path: '/auth/signin-cover',
    name: 'signin-cover',
    meta: {
      title: "Signin Cover", authRequired: true,
    },
    component: () => import('../views/auth/signin/cover')
  },
  {
    path: '/auth/signup-basic',
    name: 'signup-basic',
    meta: {
      title: "Signup Basic", authRequired: true,
    },
    component: () => import('../views/auth/signup/basic')
  },
  {
    path: '/auth/signup-cover',
    name: 'signup-cover',
    meta: {
      title: "Signup Cover", authRequired: true,
    },
    component: () => import('../views/auth/signup/cover')
  },
  {
    path: '/auth/reset-pwd-basic',
    name: 'reset-pwd-basic',
    meta: {
      title: "Reset Password", authRequired: true,
    },
    component: () => import('../views/auth/reset/basic')
  },
  {
    path: '/auth/reset-pwd-cover',
    name: 'reset-pwd-cover',
    meta: {
      title: "Reset Password", authRequired: true,
    },
    component: () => import('../views/auth/reset/cover')
  },
  {
    path: '/auth/create-pwd-basic',
    name: 'create-pwd-basic',
    meta: {
      title: "create Password", authRequired: true,
    },
    component: () => import('../views/auth/create/basic')
  },
  {
    path: '/auth/create-pwd-cover',
    name: 'create-pwd-cover',
    meta: {
      title: "create Password", authRequired: true,
    },
    component: () => import('../views/auth/create/cover')
  },
  {
    path: '/auth/lockscreen-basic',
    name: 'lock-screen-basic',
    meta: {
      title: "Lock Screen", authRequired: true,
    },
    component: () => import('../views/auth/lockscreen/basic')
  },
  {
    path: '/auth/lockscreen-cover',
    name: 'lock-screen-cover',
    meta: {
      title: "Lock Screen", authRequired: true,
    },
    component: () => import('../views/auth/lockscreen/cover')
  },
  {
    path: '/auth/twostep-basic',
    name: 'twostep-basic',
    meta: {
      title: "Two Step Auth", authRequired: true,
    },
    component: () => import('../views/auth/twostep/basic')
  }, {
    path: '/auth/twostep-cover',
    name: 'twostep-cover',
    meta: {
      title: "Two Step Auth", authRequired: true,
    },
    component: () => import('../views/auth/twostep/cover')
  },
  {
    path: '/auth/404',
    name: '404',
    meta: {
      title: "Error 404", authRequired: true,
    },
    component: () => import('../views/auth/errors/404')
  },
  {
    path: '/auth/500',
    name: '500',
    meta: {
      title: "Error 500", authRequired: true,
    },
    component: () => import('../views/auth/errors/500')
  },
  {
    path: '/auth/404-basic',
    name: '404-basic',
    meta: {
      title: "Error 404", authRequired: true,
    },
    component: () => import('../views/auth/errors/404-basic')
  },
  {
    path: '/auth/404-cover',
    name: '404-cover',
    meta: {
      title: "Error 404", authRequired: true,
    },
    component: () => import('../views/auth/errors/404-cover')
  },
  {
    path: '/auth/ofline',
    name: 'ofline',
    meta: {
      title: "Offline", authRequired: true,
    },
    component: () => import('../views/auth/errors/ofline')
  },
  {
    path: '/auth/logout-basic',
    name: 'logout-basic',
    meta: {
      title: "Logout", authRequired: true,
    },
    component: () => import('../views/auth/logout/basic')
  },
  {
    path: '/auth/logout-cover',
    name: 'logout-cover',
    meta: {
      title: "Logout", authRequired: true,
    },
    component: () => import('../views/auth/logout/cover')
  },
  {
    path: '/auth/success-msg-basic',
    name: 'success-msg-basic',
    meta: {
      title: "Success Message", authRequired: true,
    },
    component: () => import('../views/auth/success-msg/basic')
  },
  {
    path: '/auth/success-msg-cover',
    name: 'success-msg-cover',
    meta: {
      title: "Success Message", authRequired: true,
    },
    component: () => import('../views/auth/success-msg/cover')
  },
  {
    path: "/maps/google",
    name: "Google Maps",
    meta: {
      title: "Google Maps", authRequired: true,
    },
    component: () => import("../views/maps/google"),
  },
  {
    path: "/maps/leaflet",
    name: "Leaflet Maps",
    meta: { title: "Leaflet Maps", authRequired: true },
    component: () => import("../views/maps/leaflet/index"),
  },
  {
    path: "/client/account-client",
    name: "Account Client",
    meta: { title: "Cuenta", authRequired: true },
    component: () => import("../views/client/account-client"),
  },
  {
    path: "/client/dashboard-client",
    name: "Dashboard Client",
    meta: { title: "Dashboard", authRequired: true },
    component: () => import("../views/client/dashboard-client"),
  },
  {
    path: "/client/profile-client",
    name: "Profile Client",
    meta: { title: "Perfil", authRequired: true },
    component: () => import("../views/client/profile-client"),
  },
  {
    path: "/client/reserve-client",
    name: "Reserve Client",
    meta: { title: "Reserva", authRequired: true },
    component: () => import("../views/client/reserve-client"),
  },
  {
    path: "/client/stations",
    name: "Stations",
    meta: { title: "Estaciones", authRequired: true },
    component: () => import("../views/client/stations"),
  },
  {
    path: "/client/subscription-plan",
    name: "Subscription Plan",
    meta: { title: "Suscripcion Plan", authRequired: true },
    component: () => import("../views/client/subscription-plan"),
  },
  {
    path: "/company/account-company",
    name: "Account Company",
    meta: { title: "Cuenta", authRequired: true },
    component: () => import("../views/company/account-company"),
  },
  {
    path: "/company/dashboard-company",
    name: "Dashboard Company",
    meta: { title: "Dashboard", authRequired: true },
    component: () => import("../views/company/dashboard-company"),
  },
  {
    path: "/company/stations-company",
    name: "Profile Company",
    meta: { title: "Perfil", authRequired: true },
    component: () => import("../views/company/stations-company"),
  },
  {
    path: "/company/stationsList-company",
    name: "Lista Estaciones",
    meta: { title: "ListaEstaciones", authRequired: true },
    component: () => import("../views/company/listaEstaciones.vue"),
  },
  {
    path: "/company/charger-models",
    name: "Modelos Cargador",
    meta: { title: "ModelosCargador", authRequired: true },
    component: () => import("../views/company/modelos.vue"),
  },
  {
    path: "/company/mantenimientos",
    name: "Mantenimientos",
    meta: { title: "Mantenimientos", authRequired: true },
    component: () => import("../views/company/mantenimientos.vue"),
  },
  {
    path: "/company/editar-mantenimiento/:id",
    name: "Editar Mantenimiento",
    meta: { title: "EditarMantenimiento", authRequired: true },
    component: () => import("../views/company/editar-mantenimiento.vue"),
  },
  {
    path: "/company/charger-manufacturer",
    name: "Fabricantes Cargador",
    meta: { title: "FabricantesCargador", authRequired: true },
    component: () => import("../views/company/fabricantes.vue"),
  },
  {
    path: "/company/editar-fabricante/:id",
    name: "Editar Fabricante",
    meta: { title: "EditarFabricante", authRequired: true },
    component: () => import("../views/company/editar-fabricante.vue"),
  },
  {
    path: "/company/editar-modelo/:id",
    name: "Editar Modelo",
    meta: { title: "EditarModelo", authRequired: true },
    component: () => import("../views/company/editar-modelo.vue"),
  },
  {
    path: "/company/cargadores-company",
    name: "Cargadores",
    meta: { title: "Cargadores", authRequired: true },
    component: () => import("../views/company/cargadores-company"),
  },
    {
    path: "/company/suscription-company",
    name: "Subscription Company",
    meta: { title: "Suscripcion Plan", authRequired: true },
    component: () => import("../views/company/suscription-company"),
  },

  {
    path: "/company/profile-company",
    name: "Perfil Company",
    meta: { title: "Perfil Company", authRequired: true },
    component: () => import("../views/company/profile-company"),
  },

  {
    path: "/company/create-stations-company",
    name: "Crear Company",
    meta: { title: "Crear Company", authRequired: true },
    component: () => import("../views/company/create-stations-company"),
  },

  {
    path: "/company/empleados-company",
    name: "Empleados",
    meta: { title: "Empleados", authRequired: true },
    component: () => import("../views/company/empleados-company"),
  },

  {
    path: "/company/create-empleados-company",
    name: "Crear Empleados",
    meta: { title: "Crear Empleados", authRequired: true },
    component: () => import("../views/company/create-empleados-company"),
  },

  {
    path: "/company/plan-company",
    name: "Planes",
    meta: { title: "Planes", authRequired: true },
    component: () => import("../views/company/plan-company"),
  },

  {
    path: "/company/asignar-plan",
    name: "Asignar Plan",
    meta: { title: "Asignar Plan", authRequired: true },
    component: () => import("../views/company/asignar-plan"),
  },

  {
    path: "/company/asignar-RFID",
    name: "Asignar RFID",
    meta: { title: "Asignar RFID", authRequired: true },
    component: () => import("../views/company/asignar-RFID"),
  },

  {
    path: "/company/tarjetas-rfid",
    name: "Tarjetas RFID",
    meta: { title: "Tarjetas RFID", authRequired: true },
    component: () => import("../views/company/tarjetas-rfid.vue"),
  },
  {
    path: "/company/editar-tarjeta-rfid/:id",
    name: "Editar Tarjeta RFID",
    meta: { title: "Editar Tarjeta RFID", authRequired: true },
    component: () => import("../views/company/editar-tarjeta-rfid.vue"),
  },

  {
    path: "/company/crear-tarjeta-rfid",
    name: "Crear Tarjeta RFID",
    meta: { title: " Crear Tarjeta RFID", authRequired: true },
    component: () => import("../views/company/crear-tarjeta-rfid.vue"),
  },

  {
    path: "/company/comandos-ocpp",
    name: "Comandos OCPP",
    meta: { title: " Comandos OCPP", authRequired: true },
    component: () => import("../views/company/comandos-ocpp.vue"),
  },

  {
    path: "/company/flotas",
    name: "Flotas",
    meta: { title: "Flotas", authRequired: true },
    component: () => import("../views/company/flotas.vue"),
  },

  {
    path: "/company/create-flota",
    name: "Crear Flota",
    meta: { title: "Crear Flota", authRequired: true },
    component: () => import("../views/company/crear-flota.vue"),
  },

  {
    path: "/company/asignar-vehiculos",
    name: "Asignar Vehículos",
    meta: { title: "Asignar Vehículos", authRequired: true },
    component: () => import("../views/company/asignar-vehiculo.vue"),
  },

  {
    path: "/company/editar-flota/:id",
    name: "Editar Flota",
    meta: { title: "Editar Flota", authRequired: true },
    component: () => import("../views/company/editar-flota.vue"),
  },

  
  {
    path: "/company/crear-planes",
    name: "Crear Planes",
    meta: { title: " Crear Planes", authRequired: true },
    component: () => import("../views/company/crear-planes"),
  },

  {
    path: "/company/detalles-terminal",
    name: "Detalles de Terminal",
    meta: { title: " Detalles de Terminal", authRequired: true },
    component: () => import("../views/company/detalles-terminal"),
  },
  {
    path: "/company/reporte-ventas",
    name: "Reporte Ventas",
    meta: { title: "Reporte Ventas", authRequired: true },
    component: () => import("../views/company/reporte-ventas-estacion.vue"),
  },
  {
    path: "/company/crear-cargador",
    name: "Crear Cargador",
    meta: { title: " Crear Cargador", authRequired: true },
    component: () => import("../views/company/crear-cargador"),
  },
  {
    path: "/company/carga-inteligente",
    name: "Carga Inteligente",
    meta: { title: "Carga Inteligente", authRequired: true },
    component: () => import("../views/company/carga-inteligente.vue"),
  },
  {
    path: "/company/crear-fabricante-cargador",
    name: "Crear Fabricante Cargador",
    meta: { title: " Crear Cargador", authRequired: true },
    component: () => import("../views/company/crear-fabricante-cargador.vue"),
  },
  {
    path: "/company/crear-modelo-cargador",
    name: "Crear Modelo Cargador",
    meta: { title: " Crear Cargador", authRequired: true },
    component: () => import("../views/company/crear-modelo-cargador.vue"),
  },
  {
    path: "/company/detalles-de-carga",
    name: "Detalles de Carga",
    meta: { title: "Detalles de Carga", authRequired: true },
    component: () => import("../views/company/detalles-de-carga"),
  },
  {
    path: "/company/roles",
    name: "Roles",
    meta: { title: "Roles", authRequired: true },
    component: () => import("../views/company/roles"),
  },

  {
    path: "/company/tarifas",
    name: "Tarifas",
    meta: { title: "Tarifas", authRequired: true },
    component: () => import("../views/company/tarifas"),
  },

  {
    path: "/company/crear-tarifas",
    name: "Crear Tarifas",
    meta: { title: "Crear Tarifas", authRequired: true },
    component: () => import("../views/company/crear-tarifas"),
  },
  {
    path: "/company/cargas",
    name: "Cargas",
    meta: { title: "Cargas", authRequired: true },
    component: () => import("../views/company/cargas.vue"),
  },

  {
    path: "/company/cargas-por-cargador",
    name: "Registro de Cargas",
    meta: { title: "Registro de Cargas", authRequired: true },
    component: () => import("../views/company/registro-cargas-cargador.vue"),
  },

  {
    path: "/company/detalles-de-carga",
    name: "Detalles de  Cargas",
    meta: { title: "Detalles de Cargas", authRequired: true },
    component: () => import("../views/company/detalles-de-carga"),
  },

  {
    path: "/company/cargas-por-terminal",
    name: "Cargas por Terminal",
    meta: { title: "Cargas por Terminal", authRequired: true },
    component: () => import("../views/company/cargas-por-terminal"),
  }

  ,
  {
    path: "/company/cargas-por-vehiculo",
    name: "Cargas por Usuario",
    meta: { title: "Cargas por Terminal", authRequired: true },
    component: () => import("../views/company/cargas-por-flota.vue"),
  },
  {
    path: "/company/errores-por-conector",
    name: "Errores por Conector",
    meta: { title: "Errores por Conector", authRequired: true },
    component: () => import("../views/company/errores-por-conector"),
  }

  ,
  {
    path: "/company/alarmas-diarias",
    name: "Alarmas Diarias",
    meta: { title: "Alarmas Diarias", authRequired: true },
    component: () => import("../views/company/alarmas-diarias"),
  }

  ,
  // {
  //   path: "/company/errores",
  //   name: "Errores",
  //   meta: { title: "Errores", authRequired: true },
  //   component: () => import("../views/company/errores"),
  // }

  {
    path: "/company/vehiculos",
    name: "Vehiculos",
    meta: { title: "Vehiculos", authRequired: true },
    component: () => import("../views/company/vehiculos.vue"),
  },
  {
    path: "/company/crear-vehiculo",
    name: "Crear Vehiculo",
    meta: { title: "Crear Vehiculo", authRequired: true },
    component: () => import("../views/company/crear-vehiculo.vue"),
  }
  ,
  {
    path: "/company/crear-rol",
    name: "Crear Rol",
    meta: { title: "Crear Rol", authRequired: true },
    component: () => import("../views/company/crear-rol"),
  },
  {
    path: "/company/asignar-tarifas",
    name: "Asignar Tarifas",
    meta: { title: "Asignar Tarifas", authRequired: true },
    component: () => import("../views/company/asignar-tarifas"),
  },

  {
    path: "/company/editar-tarifa/:id",
    name: "Editar Tarifa",
    meta: { title: "Editar Tarifa", authRequired: true },
    component: () => import("../views/company/editar-tarifa"),
  }


  ,

  {
    path: "/company/editar-plan",
    name: "Editar Plan",
    meta: { title: "Editar Plan", authRequired: true },
    component: () => import("../views/company/editar-plan"),
  }

  ,

  {
    path: "/company/editar-empleados/:id", 
    name: "EditarEmpleados", 
    meta: { title: "Editar Empleados", authRequired: true },
    component: () => import("../views/company/editar-empleados"),
  }
  
  ,

  {
    path: "/company/editar-roles/:id",
    name: "Editar Roles",
    meta: { title: "Editar Roles", authRequired: true },
    component: () => import("../views/company/editar-roles"),
  }

  ,

  {
    path: "/company/editar-estacion/:id",
    name: "Editar Estacion",
    meta: { title: "Editar Estacion", authRequired: true },
    component: () => import("../views/company/editar-estacion"),
  },

  {
    path: "/company/editar-cargador/:id",
    name: "Editar Cargador",
    meta: { title: "Editar Cargador", authRequired: true },
    component: () => import("../views/company/editar-cargador"),
  }

  ,

  {
    path: "/company/editar-conector/:id",
    name: "Editar Conector",
    meta: { title: "Editar Conector", authRequired: true },
    component: () => import("../views/company/editar-conector"),
  }

  ,

  {
    path: "/company/conector",
    name: "Conector",
    meta: { title: " Conector", authRequired: true },
    component: () => import("../views/company/conector"),
  }
  ,

  {
    path: "/company/crear-conector",
    name: "Crear Conector",
    meta: { title: " Crear Conector", authRequired: true },
    component: () => import("../views/company/crear-conector"),
  },

  {
    path: "/company/crear-tipo-conector",
    name: "Crear Tipo Conector",
    meta: { title: " Crear Tipo Conector", authRequired: true },
    component: () => import("../views/company/crear-tipo-conector.vue"),
  }

  ,

  {
    path: "/company/alertas-correos",
    name: "Alertas Correos",
    meta: { title: " Alertas Correos", authRequired: true },
    component: () => import("../views/company/alertas-correos"),
  }

  ,


  {
    path: '/company/editar-vehiculo/:id',
    name: 'Editar Vehiculo',
    meta: { title: " Editar Vehiculo", authRequired: true },
    component: () => import('../views/company/editar-vehiculo.vue')
  }

  ,

  {
    path: "/company/mantenimiento-cargador",
    name: "Mantenimiento Cargador",
    meta: { title: "Mantenimiento Cargador", authRequired: true },
    component: () => import("../views/company/mantenimiento-cargador"),
  }

  ,

  {
    path: "/company/asignar-mantenimiento",
    name: "Asignar Mantenimiento Cargador",
    meta: { title: " Asignar Mantenimiento Cargador", authRequired: true },
    component: () => import("../views/company/asignar-mantenimiento"),
  }

  


  
];