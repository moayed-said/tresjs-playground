<template>
    <select 
      :value="modelValue"
      @change="(e) => emit('update:modelValue', (e.target as HTMLSelectElement).value)"
      class=" block p-1 rounded-md text-white bg-gray-700/90 backdrop-blur-sm border border-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-800 transition-all"
      :bind="$attrs"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
</template>
<script setup lang="ts">
interface P {
  options: Array<{label: string, value: string}>;
  modelValue: string | null;
}
const props = defineProps<P>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

</script>
