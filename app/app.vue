<template>
  <GlobalProvider>
    <n-scrollbar
      :content-style="{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
      style="height: 100vh"
      @scroll="siteScroll"
    >
      <SiteNav />
      <Transition name="fade">
        <SiteHeader v-if="statusStore.loginStatus" />
      </Transition>
      <!-- 主内容 -->
      <main v-if="siteLoaded" id="main">
        <Transition name="fade" mode="out-in">
          <!-- 密码验证 -->
          <SiteLogin v-if="!statusStore.loginStatus" />
          <!-- 站点卡片 -->
          <SiteCards v-else />
        </Transition>
      </main>
      <SiteFooter />
      <!-- 回到顶部 -->
      <n-back-top :visibility-height="10" />
    </n-scrollbar>
  </GlobalProvider>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const statusStore = useStatusStore();
const { setLocale } = useI18n();

// 加载状态
const siteLoaded = ref<boolean>(false);

// 验证登录状态
const checkSite = async () => {
  try {
    const result = await $fetch("/api/check", { method: "POST" });
    // 更改登录状态
    statusStore.loginStatus = result.code === 200;
  } catch (error) {
    console.error("error in checkSite", error);
  } finally {
    siteLoaded.value = true;
  }
};

// 页面滚动
const siteScroll = (e: Event) => {
  // 滚动高度
  const scrollTop = (e.target as HTMLElement).scrollTop;
  statusStore.scrollTop = scrollTop;
};

// 站点异常时在标题中显示异常数量
const siteStatusText = computed(() => {
  const { siteTitle } = config.public;
  const status = statusStore.siteStatus;
  if (status !== "error" && status !== "warn") return siteTitle;
  const error = statusStore.siteData?.status?.error || 0;
  const unknown = statusStore.siteData?.status?.unknown || 0;
  return `( ${error + unknown} ) ` + siteTitle;
});

// 站点异常时切换为错误图标
const faviconPath = computed(() =>
  statusStore.siteStatus === "error" || statusStore.siteStatus === "warn"
    ? "/favicon-error.ico"
    : "/favicon.ico",
);

// 响应式更新页面标题、html lang 与图标
useHead(() => ({
  title: siteStatusText.value,
  htmlAttrs: { lang: statusStore.siteLang },
}));
useFavicon(faviconPath);

// 切换站点语言
watch(
  () => statusStore.siteLang,
  (lang) => setLocale(lang),
  { immediate: true },
);

onBeforeMount(checkSite);
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
