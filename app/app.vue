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

// 加载状态
const siteLoaded = ref<boolean>(false);

// 验证状态
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

// 监听站点状态
watch(
  () => statusStore.siteStatus,
  (status) => {
    const { siteTitle } = config.public;
    // 错误总数
    const error = statusStore.siteData?.status?.error || 0;
    const unknown = statusStore.siteData?.status?.unknown || 0;
    // 更改信息
    useHead({
      // 更改标题
      title:
        status === "error" || status === "warn"
          ? `${error + unknown} 异常 | ` + siteTitle
          : siteTitle,
    });
  },
);

onMounted(checkSite);
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
