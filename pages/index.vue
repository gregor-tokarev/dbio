<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const { data: tags, refresh } = await useFetch("/api/get_tags");

const tagEls = ref<HTMLElement[]>([]);

const focusedTagId = ref<number | null>(null);
const focusedTag = computed(() => {
  return tags.value.find((t) => t.id === focusedTagId.value);
});

const focusedTagEl = computed<HTMLElement | undefined>(() => {
  if (focusedTagId.value === null) return;

  const idx = tags.value.findIndex((t) => t.id === focusedTagId.value);
  return tagEls.value[idx];
});

const focusedTagBounding = computed(() => {
  if (!focusedTagEl.value) return;

  return focusedTagEl.value?.getBoundingClientRect();
});

const reactions = useLocalStorage<Record<string, string>>("reactions", {});

async function togglLike() {
  if (!focusedTag.value) return;

  focusedTag.value.likesCount += 1;

  reactions.value[focusedTagId.value] = "like";

  await $fetch("/api/add_reaction", {
    method: "PATCH",
    body: {
      tagId: focusedTagId.value,
      reaction: "like",
    },
  });

  focusedTagId.value = null;
}
async function togglDislike() {
  if (!focusedTag.value) return;

  reactions.value[focusedTagId.value] = "dislike";

  await $fetch("/api/add_reaction", {
    method: "PATCH",
    body: {
      tagId: focusedTagId.value,
      reaction: "dislike",
    },
  });

  focusedTagId.value = null;
}
</script>

<template>
  <div class="mx-5">
    <div class="flex">
      <p
        v-for="t in tags"
        ref="tagEls"
        :key="t.id"
        @click="focusedTagId = t.id"
        class="cursor-pointer text-[64px] text-white transition-transform hover:scale-105"
        :class="{ 'z-50 scale-105': t.id === focusedTagId }"
      >
        {{ t.content }}
      </p>
    </div>
    <div
      v-if="focusedTagId"
      @click="focusedTagId = null"
      class="fixed inset-0 z-10 bg-black/10 backdrop-blur-md"
    ></div>
  </div>
  <teleport to="body">
    <div
      v-if="focusedTag && focusedTagBounding"
      class="fixed z-50 flex h-[42px] w-[230px] -translate-x-1/2 overflow-hidden rounded-md"
      :style="{
        left: `${focusedTagBounding.left + focusedTagBounding.width / 2}px`,
        top: `${focusedTagBounding.top + focusedTagBounding.height + 10}px`,
      }"
    >
      <div
        @click="togglDislike"
        class="flex grow cursor-pointer items-center justify-center bg-[#B2443C]/40 text-[24px] text-gray-200"
      >
        <nuxt-icon name="dislike"></nuxt-icon>
      </div>
      <div
        @click="togglLike"
        class="flex grow cursor-pointer items-center justify-center space-x-2 bg-[#52B742]/40 text-[24px] text-gray-200"
      >
        <p>{{ focusedTag.likesCount }}</p>
        <nuxt-icon name="like"></nuxt-icon>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
