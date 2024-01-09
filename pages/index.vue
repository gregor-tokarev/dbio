<script setup lang="ts">
import {
  breakpointsTailwind,
  useBreakpoints,
  useLocalStorage,
} from "@vueuse/core";

const { data: tags, refresh } = await useFetch("/api/get_tags", {
  cache: "no-cache",
});

const tagEls = ref<HTMLElement[]>([]);

const breakpoints = useBreakpoints(breakpointsTailwind);

const focusedTagId = ref<number | null>(null);
watch(focusedTagId, (value) => {
  if (!process.client) return;

  if (value) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "unset";
  }
});

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

const reactions = useLocalStorage<Record<string, string | null>>(
  "reactions",
  {},
);

const focusedTagReaction = computed(() => {
  if (!focusedTagId.value) return;

  return reactions.value[focusedTagId.value];
});

async function reactionRequest(
  reaction: "like" | "dislike",
  action: "remove" | "add",
) {
  return $fetch(
    `/api/${action === "remove" ? "remove_reaction" : "add_reaction"}`,
    {
      method: "patch",
      body: {
        tagId: focusedTagId.value,
        reaction,
      },
    },
  );
}

async function togglLike() {
  if (!focusedTag.value || !focusedTagId.value) return;

  if (focusedTagReaction.value === "like") {
    focusedTag.value.likesCount -= 1;
    reactions.value[focusedTagId.value] = null;
    await reactionRequest("like", "remove");
  } else if (focusedTagReaction.value === "dislike") {
    focusedTag.value.dislikesCount -= 1;
    focusedTag.value.likesCount += 1;
    reactions.value[focusedTagId.value] = "like";

    await Promise.all([
      reactionRequest("dislike", "remove"),
      reactionRequest("like", "add"),
    ]);
  } else {
    focusedTag.value.likesCount += 1;
    reactions.value[focusedTagId.value] = "like";
    await reactionRequest("like", "add");
  }

  focusedTagId.value = null;
}
async function togglDislike() {
  if (!focusedTag.value || !focusedTagId.value) return;

  if (focusedTagReaction.value === "dislike") {
    focusedTag.value.dislikesCount -= 1;
    reactions.value[focusedTagId.value] = null;
    await reactionRequest("dislike", "remove");
  } else if (focusedTagReaction.value === "like") {
    focusedTag.value.likesCount -= 1;
    focusedTag.value.dislikesCount += 1;
    reactions.value[focusedTagId.value] = "dislike";

    await Promise.all([
      reactionRequest("like", "remove"),
      reactionRequest("dislike", "add"),
    ]);
  } else {
    focusedTag.value.dislikesCount += 1;
    reactions.value[focusedTagId.value] = "dislike";
    await reactionRequest("dislike", "add");
  }
  focusedTagId.value = null;
}
</script>

<template>
  <div class="mx-5 mt-[50px] md:mt-[80px]">
    <div class="flex flex-wrap justify-between gap-y-5">
      <p
        v-for="t in tags"
        ref="tagEls"
        :key="t.id"
        @click="focusedTagId = t.id"
        class="cursor-pointer text-[32px] text-white transition-transform hover:scale-105 md:text-[64px]"
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
      class="fixed bottom-5 left-2.5 right-2.5 z-50 flex h-[42px] w-[calc(100%-20px)] overflow-hidden rounded-md md:w-[230px] md:-translate-x-1/2"
      :style="{
        left: breakpoints.isGreaterOrEqual('md')
          ? `${focusedTagBounding.left + focusedTagBounding.width / 2}px`
          : 'unset',
        top: breakpoints.isGreaterOrEqual('md')
          ? `${focusedTagBounding.top + focusedTagBounding.height + 10}px`
          : 'unset',
      }"
    >
      <div
        @click="togglDislike"
        class="flex grow cursor-pointer items-center justify-center bg-[#B2443C]/40 text-[24px] text-gray-200"
        :class="{ '!text-accent': focusedTagReaction === 'dislike' }"
      >
        <nuxt-icon name="dislike"></nuxt-icon>
      </div>
      <div
        @click="togglLike"
        class="flex grow cursor-pointer items-center justify-center space-x-2 bg-[#52B742]/40 text-[24px] text-gray-200"
        :class="{ '!text-accent': focusedTagReaction === 'like' }"
      >
        <p>{{ focusedTag.likesCount }}</p>
        <nuxt-icon name="like"></nuxt-icon>
      </div>
    </div>
  </teleport>
  <teleport to="body">
    <nuxt-link
      to="add_tag"
      class="fixed bottom-5 right-5 flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-full bg-accent transition-colors hover:bg-accent-dark md:bottom-10 md:right-10"
    >
      <nuxt-icon
        name="pen"
        class="text-gray-100 [&>svg]:!h-10 [&>svg]:!w-10"
      ></nuxt-icon>
    </nuxt-link>
  </teleport>
  <nuxt-page></nuxt-page>
</template>

<style scoped></style>
