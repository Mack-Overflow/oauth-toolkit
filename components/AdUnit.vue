<script setup lang="ts">
const props = defineProps<{
  adSlot: string
  adFormat?: string
  adLayout?: string
  style?: string
}>()

const config = useRuntimeConfig()

onMounted(() => {
  try {
    ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
  } catch (e) {
    // AdSense not loaded (e.g. ad blocker)
  }
})
</script>

<template>
  <ins
    class="adsbygoogle"
    :style="props.style || 'display:block'"
    :data-ad-client="config.public.adsenseId"
    :data-ad-slot="props.adSlot"
    :data-ad-format="props.adFormat || 'auto'"
    :data-ad-layout="props.adLayout"
    data-full-width-responsive="true"
  />
</template>
