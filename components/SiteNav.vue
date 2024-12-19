<!-- 导航栏 -->
<template>
  <nav
    id="nav"
    :class="{ scroll: statusStore.scrollTop > 0 }"
    :style="{ color: iconColor }"
  >
    <div class="nav-content">
      <span class="logo">{{ config.public.siteTitle }}</span>
      <n-flex align="center" justify="end">
        <!-- 明暗切换 -->
        <Transition name="fade" mode="out-in">
          <n-button
            :key="themeIcon"
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
            @click="toggleTheme"
          >
            <template #icon>
              <Icon :name="themeIcon" />
            </template>
          </n-button>
        </Transition>
        <!-- 菜单 -->
        <n-dropdown trigger="click" :options="navMenu">
          <n-button
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
          >
            <template #icon>
              <Icon name="icon:menu" />
            </template>
          </n-button>
        </n-dropdown>
      </n-flex>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { DropdownOption } from "naive-ui";

const colorMode = useColorMode();
const config = useRuntimeConfig();
const statusStore = useStatusStore();

// 导航栏菜单
const navMenu: DropdownOption[] = [
  {
    key: "about",
    label: "关于本站",
    icon: renderIcon("icon:info"),
  },
];

// 模式图标
const themeIcon = computed(() => `icon:${colorMode.preference}-mode`);

// 图标颜色
const iconColor = computed<string | undefined>(() =>
  statusStore.loginStatus && statusStore.scrollTop === 0 ? "#fff" : undefined,
);

// 切换明暗模式
const toggleTheme = () => {
  const themeList = ["light", "dark", "system"];
  colorMode.preference =
    themeList[(themeList.indexOf(colorMode.preference) + 1) % 3];
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .logo {
    font-size: 20px;
    font-weight: bold;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    @media (max-width: 512px) {
      font-size: 16px;
    }
  }
  &.scroll {
    background-color: var(--main-card-color);
    border-bottom: solid 1px var(--mian-border-color);
    box-shadow: 0px 0px 8px 4px var(--main-box-shadow);
    .nav-content {
      padding: 12px 20px;
    }
  }
}
</style>
