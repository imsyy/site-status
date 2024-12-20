<template>
  <footer id="footer">
    <n-flex class="link" align="center">
      <n-button
        v-for="(item, key, index) in linkData"
        :key="index"
        :focusable="false"
        quaternary
        circle
        @click="jumpLink(item)"
      >
        <template #icon>
          <Icon :name="`icon:${key}`" />
        </template>
      </n-button>
    </n-flex>
    <n-flex :size="4" class="text" align="center" vertical>
      <n-p depth="3">
        <n-text depth="3" @click="jumpLink(linkData.github)">SiteStatus</n-text>
        Version {{ version }}
      </n-p>
      <n-p depth="3">
        基于
        <n-text depth="3" @click="jumpLink('https://uptimerobot.com/')"> UptimeRobot </n-text>
        接口 | 检测频率 5 分钟
      </n-p>
      <n-p depth="3">
        Copyright &copy; 2020 - {{ new Date().getFullYear() }}
        <n-text depth="3" @click="jumpLink(linkData.home)"> IMSYY </n-text>
        <n-text v-if="siteIcp" depth="3" @click="jumpLink('https://beian.miit.gov.cn/')">
          | {{ siteIcp }}
        </n-text>
      </n-p>
    </n-flex>
  </footer>
</template>

<script setup lang="ts">
const { public: configPublic } = useRuntimeConfig();
const { siteIcp, version } = configPublic;

const linkData = {
  github: "https://github.com/imsyy/site-status",
  home: "https://www.imsyy.top",
  email: "mailto:one@imsyy.top",
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 90px;
  margin-top: auto;
  z-index: 100;
  .text {
    margin-top: 12px;
    .n-p,
    .n-text {
      margin: 0;
      font-size: 13px;
      line-height: 26px;
    }
    .n-text {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: var(--normal-color);
      }
    }
  }
}
</style>
