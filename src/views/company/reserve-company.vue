<script>
    import Layout from "@/layouts/main.vue";
    import PageHeader from "@/components/page-header";
    
    export default {
      components: {
        Layout,
        PageHeader,
      },
    };
    </script>
    
    <template>
      <Layout>
        <PageHeader title="title" pageTitle="items" />
            // Reservas

            <div class="toast fade show" role="alert" aria-live="assertive"
                data-bs-autohide="false" aria-atomic="true">
                <div class="toast-header">
                    <img src="assets/images/logo-sm.png" class="rounded me-2"
                    alt="..." height="20">
                    <span class="fw-semibold me-auto">Velzon</span>
                    <small>06 mins ago</small>
                    <button type="button" class="btn-close"
                    data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Hello, world! This is a toast message.
                </div>            
                <div class="p-3 bg-light">
                    <div class="toast fade show" role="alert" aria-live="assertive"
                        data-bs-autohide="false" aria-atomic="true">
                        <div class="toast-header">
                            <img src="assets/images/logo-sm.png" class="rounded me-2"
                                alt="..." height="20">
                            <span class="fw-semibold me-auto">Velzon</span>
                            <small>11 mins ago</small>
                            <button type="button" class="btn-close"
                                data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Hello, world! This is a toast message.
                        </div>
                    </div>
                </div>
                <div class="toast fade show" role="alert" aria-live="assertive"
                    data-bs-autohide="false" aria-atomic="true">
                    <div class="toast-header">
                        <img src="assets/images/logo-sm.png" class="rounded me-2"
                            alt="..." height="20">
                        <span class="fw-semibold me-auto">Velzon</span>
                        <small>Just now</small>
                        <button type="button" class="btn-close"
                            data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        See? Just like this.
                    </div>
                </div>
                <div class="bg-light" aria-live="polite" aria-atomic="true"
                    style="position: relative; min-height: 200px;">
                    <div class="toast fade show" role="alert" aria-live="assertive"
                        aria-atomic="true" data-bs-toggle="toast"
                        style="position: absolute; top: 16px; right: 16px;">
                        <div class="toast-header">
                            <img src="assets/images/logo-sm.png"
                                class="rounded me-2" alt="..." height="20">
                            <span class="fw-semibold me-auto">Velzon</span>
                            <small>06 mins ago</small>
                            <button type="button" class="btn-close"
                                data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Hello, world! This is a toast message.
                        </div>
                    </div>
                </div>
                <div aria-live="polite" aria-atomic="true"
                    class="bg-light d-flex justify-content-center align-items-center"
                    style="height: 200px;">
                    <div class="toast fade show" role="alert" aria-live="assertive"
                        data-bs-autohide="false" aria-atomic="true">
                        <div class="toast-header">
                            <img src="assets/images/logo-sm.png"
                                class="rounded me-2" alt="..." height="20">
                            <span class="fw-semibold me-auto">Velzon</span>
                            <small>11 mins ago</small>
                            <button type="button" class="btn-close"
                                data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Hello, world! This is a toast message.
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">
                    <BRow>
                        <BCol xl="4">
                            <BCard no-body>
                            <BCardHeader>
                                <h5 class="card-title mb-0">Credit Card - card js plugin</h5>
                            </BCardHeader>
                            <BCardBody>
                                <div class="card-wrapper mb-3">
                                <div class="mx-auto" style="max-width: 350px">
                                    <div class="text-bg-success bg-gradient p-4 rounded-3 mb-3 credit-card">
                                    <div class="d-flex">
                                        <div class="flex-grow-1">
                                        <i class='bx bxs-wallet-alt h1'></i>
                                        </div>
                                    </div>
                                    <div class="card-number fs-20" id="card-num-elem">
                                        •••• •••• •••• ••••
                                    </div>
                                    <div class="mt-4 d-flex justify-content-between">
                                        <div class="cols-4">
                                        <div>
                                            <div id="card-holder-elem" class="fw-medium fs-14">FULL NAME</div>
                                        </div>
                                        </div>
                                        <div class="cols-4 ex-date">
                                        <div>
                                            <div class="text-white-50">Expires</div>
                                            <div class="fw-medium fs-14">
                                            <span id="expiry-month-elem">00</span>
                                            /
                                            <span id="expiry-year-elem">0000</span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <div class="form-container active">
                                <form action="" id="card-form-elem" autocomplete="off">
                                    <div class="mb-3">
                                    <label for="card-number-input" class="form-label">Card Number</label>
                                    <input class="form-control" placeholder="Card number" type="tel" id="card-number-input">
                                    </div>
                                    <div class="mb-3">
                                    <label for="card-name-input" class="form-label">Card Holder</label>
                                    <input class="form-control" placeholder="Full name" type="text" id="card-name-input">
                                    </div>
                                    <BRow>
                                    <BCol sm="6">
                                        <div class="mb-3">
                                        <label for="card-expiry-input" class="form-label">Expiry</label>
                                        <input class="form-control" placeholder="MM/YY" type="tel" id="card-expiry-input">
                                        </div>
                                    </BCol>
                                    <BCol sm="6">
                                        <div class="mb-3">
                                        <label for="card-cvc-input" class="form-label">CVC</label>
                                        <input class="form-control" placeholder="CVC" type="number" id="card-cvc-input">
                                        </div>
                                    </BCol>
                                    </BRow>
                                    <BButton variant="danger" class="w-100" type="submit">Pay Now</BButton>
                                </form>
                                </div>
                            </BCardBody>

                            </BCard>
                        </BCol>
                    </BRow>
                </div>
            </div>

        </Layout>



    </template>