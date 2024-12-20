<!-- 站点数据卡片 -->
<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!isEmpty(siteData)" class="site-cards">
      <n-card
        v-for="(site, index) in siteData"
        :key="index"
        :style="{ animationDelay: `${index * 0.1}s` }"
        class="site-item"
        hoverable
      >
        <!-- 信息 -->
        <n-flex class="meta" justify="space-between">
          <n-flex :size="8" class="title" align="center">
            <n-text class="site-name">{{ site.name }}</n-text>
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>
                  {{ siteType[site.type]?.tag || "HTTP" }} /
                  {{ formatInterval(site?.interval) }}
                </n-tag>
              </template>
              <n-text>
                {{
                  `每间隔 ${formatInterval(site?.interval)}，` + siteType[site.type]?.text ||
                  "30s" + "，来判断段站点是否运行正常"
                }}
              </n-text>
            </n-popover>
            <!-- 跳转 -->
            <n-button
              v-if="site?.url"
              :focusable="false"
              size="tiny"
              tertiary
              round
              @click="jumpLink(site.url)"
            >
              <template #icon>
                <Icon name="icon:link" />
              </template>
            </n-button>
          </n-flex>
          <n-flex
            :style="{
              '--bg-color': `var(--${siteStatus[site.status]?.type || 'unknown'}-color)`,
            }"
            class="status"
            align="center"
          >
            <div v-if="site.status !== 0" class="point" />
            <Icon v-else name="icon:pause" />
            <n-text>{{ siteStatus[site.status]?.text }}</n-text>
          </n-flex>
        </n-flex>
        <!-- 每日数据 -->
        <n-flex v-if="site?.days?.length" :size="2" class="timeline" justify="space-between">
          <n-popover v-for="(day, dayIndex) in site.days" :key="day?.date || dayIndex">
            <template #trigger>
              <div
                :style="{
                  backgroundColor: `var(--${getDayStatus(day.percent)}-color)`,
                }"
                class="day"
              />
            </template>
            <div class="day-data">
              <n-text class="date" depth="3">
                {{ day?.date ? formatTime(day.date) : "未知日期" }}
              </n-text>
              <!-- 详细 -->
              <n-text v-if="day?.percent >= 100">
                {{ `当日可用率 ${day?.percent}%` }}
              </n-text>
              <n-text v-else-if="day?.percent > 0 && day?.percent < 100">
                {{
                  `故障 ${day?.down?.times} 次，累计故障时长 ${formatDuration(day?.down?.duration)}，当日可用率 ${day?.percent}%`
                }}
              </n-text>
              <n-text v-else>当日无数据</n-text>
            </div>
          </n-popover>
        </n-flex>
        <!-- 总结 -->
        <n-flex class="summary" justify="space-between">
          <n-text class="date" depth="3">
            {{ formatTime(site?.days?.[0]?.date || 0) }}
          </n-text>
          <n-text v-if="site?.down?.times" depth="3">
            {{
              `最近 ${site?.days?.length} 天内故障 ${site?.down?.times} 次，累计故障时长 ${formatDuration(site?.down?.duration)}，平均可用率 ${site?.percent}%`
            }}
          </n-text>
          <n-text v-else depth="3">
            {{ `最近 ${site?.days?.length} 天内可用率 ${site.percent}%` }}
          </n-text>
          <n-text class="date" depth="3">今日</n-text>
        </n-flex>
      </n-card>
    </div>
    <div
      v-else
      :style="{ '--color': `var(--${statusStore.siteStatus}-color)` }"
      class="site-cards loading"
    >
      <n-card class="site-item" hoverable>
        <Transition name="fade" mode="out-in">
          <n-spin v-if="statusStore.siteStatus !== 'unknown'" />
          <n-result
            v-else
            status="error"
            title="出错啦"
            description="接口调用超限或请求错误，请稍后重试"
          >
            <template #footer>
              <n-button tertiary round @click="refresh"> 重试 </n-button>
            </template>
          </n-result>
        </Transition>
      </n-card>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { SiteStatusType, SiteType } from "~~/types/main";
import { siteType, siteStatus } from "~/assets/data/text";

const statusStore = useStatusStore();

// 全部站点数据
const siteData = computed<SiteStatusType[] | undefined>(() => statusStore.siteData?.data);

// 当天站点状态
const getDayStatus = (percent: number): SiteType => {
  if (percent >= 100) return "normal";
  else if (percent >= 50 && percent < 100) return "warn";
  else if (percent > 0 && percent < 50) return "error";
  else return "unknown";
};

// 重试
const refresh = async () => {
  statusStore.$patch({
    siteStatus: "loading",
    siteData: undefined,
  });
  await getSiteData();
};

onMounted(getSiteData);
</script>

<style lang="scss" scoped>
.site-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 900px;
  margin: 30px auto 20px;
  padding: 0 20px;
  .site-item {
    opacity: 0;
    border-radius: 12px;
    animation: float-up 0.5s forwards;
    overflow: hidden;
    .meta {
      .site-name {
        font-weight: bold;
      }
      .n-tag {
        --n-height: 20px;
        cursor: pointer;
      }
      .status {
        .n-text {
          color: var(--bg-color);
        }
        svg {
          font-size: 22px;
          margin-right: -4px;
          color: var(--bg-color);
        }
      }
      .point {
        position: relative;
        width: 14px;
        height: 14px;
        min-width: 14px;
        background-color: var(--bg-color);
        border-radius: 50%;
        &::after {
          content: "";
          background-color: var(--bg-color);
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
    }
    .timeline {
      margin: 15px 0 10px;
      .day {
        height: 26px;
        flex-grow: 1;
        border-radius: 25px;
        background-color: var(--normal-color);
        transition: transform 0.3s;
        transform-origin: bottom;
        cursor: pointer;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .summary {
      .date {
        width: 100px;
        &:last-child {
          text-align: right;
        }
      }
      .n-text {
        font-size: 13px;
      }
    }
  }
  &.loading {
    .site-item {
      min-height: 200px;
      :deep(.n-card__content) {
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .n-spin-body {
      --n-size: 40px;
      --n-color: var(--color);
    }
  }
}
.day-data {
  display: flex;
  flex-direction: column;
  .date {
    font-size: 12px;
  }
}
</style>
