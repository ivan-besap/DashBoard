<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: {
    Layout,
    PageHeader,
  },

  data() {
    return {
      plans: []
    };
  },

  mounted() {
    this.fetchPlans();
  },

  methods: {
    async fetchPlans() {
      try {
        const response = await axios.get('http://localhost:8080/api/plans');
        this.plans = response.data;
        console.log(this.plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Planes" pageTitle="Dashboard" />

    <BButton style="margin-bottom: 45px;" pill variant="success" class="waves-effect waves-light">
      <a href="create-plan">Crear Plan</a>
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
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Días</th>
            <th scope="col">Costo</th>
            <th scope="col">Total KWh</th>
            <th scope="col">Total Costo</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                <label class="form-check-label" for="cardtableCheck01"></label>
              </div>
            </td>
            <td><a href="#" class="fw-semibold">{{ plan.id }}</a></td>
            <td>{{ plan.name }}</td>
            <td>{{ plan.description }}</td>
            <td>{{ plan.days }}</td>
            <td>{{ plan.cost }}</td>
            <td>{{ plan.totalKWh }}</td>
            <td>{{ plan.totalCost }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-light">Detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>
