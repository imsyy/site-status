<!-- 站点状态 -->
<template>
  <header id="header">
    <!-- 背景 -->
    <Transition name="fade" mode="in-out">
      <div
        :key="statusStore.siteStatus"
        :style="{ background: `var(--${statusStore.siteStatus}-cover)` }"
        :class="['status-cover', statusStore.siteStatus]"
      />
    </Transition>
    <div class="status-content">
      <!-- 状态内容 -->
      <div class="site-status">
        <!-- 状态文本 -->
        <div class="status-text">
          <div class="point" />
          <Transition name="fade" mode="out-in">
            <div :key="statusStore.siteStatus" class="text">
              <span class="title">
                {{ siteGlobalText[statusStore.siteStatus] }}
              </span>
              <span v-if="statusStore.siteStatus === 'loading'" class="tip">
                请稍等片刻 ...
              </span>
              <span
                v-else-if="statusStore.siteStatus === 'unknown'"
                class="tip"
              >
                这可能是临时性问题，请刷新后重试
              </span>
              <!-- 更新频率 -->
              <n-flex v-else :size="0" class="tip" align="center">
                <span>
                  更新于
                  {{
                    formatTime(statusStore.siteData?.timestamp || 0, {
                      showTime: true,
                      showOnlyTimeIfToday: true,
                    })
                  }}
                </span>
                <span>将于 {{ nextUpdateTime }} 后刷新</span>
                <n-button
                  :focusable="false"
                  color="#fff"
                  quaternary
                  circle
                  @click="refresh"
                >
                  <template #icon>
                    <Icon name="icon:refresh" />
                  </template>
                </n-button>
              </n-flex>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <!-- 波纹 -->
    <svg
      class="waves-area"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z"
        />
      </defs>
      <g class="parallax">
        <use href="#gentle-wave" x="48" y="0" />
        <use href="#gentle-wave" x="48" y="3" />
        <use href="#gentle-wave" x="48" y="5" />
        <use href="#gentle-wave" x="48" y="7" />
      </g>
    </svg>
  </header>
</template>

<script setup lang="ts">
import { siteGlobalText } from "~/assets/data/text";

const statusStore = useStatusStore();

// 倒计时
const updateTime = ref<number>(300);

// 更新倒计时
const nextUpdateTime = computed(() => {
  const time = updateTime.value;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return minutes > 0 ? `${minutes} 分 ${seconds} 秒` : `${seconds} 秒`;
});

// 更新数据
const refresh = async () => {
  await getSiteData();
};

// 执行倒计时
const { pause: pauseTime, resume: resumeTime } = useIntervalFn(
  async () => {
    if (updateTime.value > 0) updateTime.value--;
    if (updateTime.value === 0) {
      pauseTime();
      statusStore.siteStatus = "loading";
      await getSiteData();
      updateTime.value = 300;
      resumeTime();
    }
  },
  1000,
  { immediate: true },
);
</script>

<style lang="scss" scoped>
header {
  position: relative;
  height: 44vh;
  width: 100%;
  color: white;
  .status-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 400% !important;
    background: var(--loading-cover);
    z-index: -1;
    transition: filter 0.3s;
    filter: var(--cover-filter);
  }
  .status-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px 80px;
    .site-status {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 20px;
      height: 100%;
      .status-text {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .point {
          position: relative;
          width: 40px;
          height: 40px;
          min-width: 40px;
          background-color: #fff;
          border-radius: 50%;
          margin-right: 30px;
          &::after {
            content: "";
            background-color: #ffffff80;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 50%;
            opacity: 1;
            z-index: -1;
            animation: breathing 1.5s ease infinite;
            transition: background-color 1s;
          }
        }
        .text {
          display: flex;
          flex-direction: column;
          .title {
            font-size: 40px;
            font-weight: bold;
          }
          .tip {
            font-size: 14px;
            opacity: 0.8;
            .n-button {
              --n-height: 22px;
              margin-left: 10px;
            }
            span {
              &:first-child {
                &::after {
                  content: "|";
                  font-size: 12px;
                  margin: 0 8px;
                  opacity: 0.6;
                }
              }
            }
          }
        }
      }
    }
  }
  .waves-area {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    pointer-events: none;
    @media (max-width: 512px) {
      height: 40px;
    }
    .parallax {
      > use {
        animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, fill;
      }

      > use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
        fill: rgba(var(--cover-fill-color), 0.741);
      }

      > use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
        fill: rgba(var(--cover-fill-color), 0.51);
      }

      > use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
        fill: rgba(var(--cover-fill-color), 0.212);
      }

      > use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
        fill: var(--main-bg-color);
      }
    }
  }
}
</style>
