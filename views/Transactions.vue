<!-- eslint-disable vue/multi-word-component-names -->
<template>
      <AppBreadcrumb breadcrumb="Transactions" />

  <main>
 <transaction-table/>

  </main>
</template>

<script setup lang="ts">
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue';
import TransactionTable from '@/components/transactions/transactionTable.vue';
</script>
