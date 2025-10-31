<template>
  <div class="select-wrapper" :class="{'after:rotate-90': isOpen, 'after:-rotate-90': !isOpen}" @click="toggelSelect()">
    <select 
      :value="modelValue"
      @change="(e) => emit('update:modelValue', (e.target as HTMLSelectElement).value)"
      class=" block p-1 rounded-sm text-white bg-gray-700/90 backdrop-blur-sm border border-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-800 transition-all"
      :bind="$attrs"
    >
      <option v-for="option in options" :key="option.value" :value="option.value" >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

interface P {
  options: Array<{label: string, value: string}>;
  modelValue: string | null;
}
let isOpen = ref(false)
function toggelSelect(){
  isOpen.value = isOpen.value ? false : true
}

const props = defineProps<P>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

</script>

<style scoped>
.select-wrapper{
  position: relative;
}
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none; 
  padding-right: 20px;
}
.select-wrapper::after{
  position: absolute;
  content: '<';
  font-weight: 900;
  font-size: 20px;
  line-height: 1;
  color: white;
  transform-origin: 50% 50%;
  width: 15px;
  height: 20px;
  top: 7px;
  right: 5px;
  z-index: 10;
}
</style>
