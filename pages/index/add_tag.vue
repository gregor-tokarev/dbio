<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { helpers, maxLength, required } from "@vuelidate/validators";
import { VueSpinner } from "vue3-spinners";

const router = useRouter();

const formState = reactive({
  text: "",
});

const loading = ref(false);

const v$ = useVuelidate(
  {
    text: {
      required: helpers.withMessage("Пусто (подметил мой сайт)", required),
      maxLength: helpers.withMessage(
        (ctx) => `Максиум ${ctx.$params.max} символов`,
        maxLength(20),
      ),
    },
  },
  formState,
);

async function onSubmit() {
  v$.value.$touch();

  if (v$.value.$error) return;

  loading.value = true;

  try {
    await $fetch("/api/add_tag", {
      method: "POST",
      body: {
        content: formState.text,
      },
    });
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    router.back();
  }
}
</script>

<template>
  <teleport to="body">
    <div
      class="fixed inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-md"
      @click="router.back"
    >
      <div class="space-y-10 bg-[#0F0F0F] p-5 md:w-[700px]" @click.stop>
        <h1 class="text-[28px] text-gray-300">Добавить свое обзывательство</h1>
        <div class="space-y-4">
          <UIInput
            placeholder="Ну пиши.."
            :error="v$.text.$error"
            @keyup.enter="onSubmit"
            @blur="v$.text.$touch"
            v-model="v$.text.$model"
          />
          <div v-if="v$.$dirty" class="text-accent empty:hidden">
            <p v-for="err in v$.$errors">{{ err.$message }}</p>
          </div>
        </div>
        <button
          @click="onSubmit"
          class="flex min-h-[45px] min-w-[175px] justify-center border-0 bg-dark py-2 text-[24px] text-white"
        >
          <template v-if="!loading">Отправить</template>
          <VueSpinner v-else></VueSpinner>
        </button>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
