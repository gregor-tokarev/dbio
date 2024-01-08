<template>
  <input
    type="text"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', $event.currentTarget.value)"
    class="w-full border-0 border-b border-b-gray-400 bg-transparent px-2 py-3 text-[24px] text-gray-500 placeholder-gray-400 outline-0"
    :class="{ '!border-accent': error }"
  />
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
    error: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    error: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
