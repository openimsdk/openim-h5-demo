<template>
  <div class="page_container">
    <ContactHeader />
    <ContactMenuList />
    <!-- <ContactFrequentList /> -->
  </div>
</template>

<script name="contact" setup lang='ts'>
import ContactHeader from './components/ContactHeader.vue';
import ContactMenuList from './components/ContactMenuList.vue';
import ContactFrequentList from './components/ContactFrequentList.vue';

const emit = defineEmits([]);
const props = defineProps({});

</script>

<style lang='scss' scoped>

</style>