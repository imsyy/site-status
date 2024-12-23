<!-- 站点登录 -->
<template>
  <div class="site-login">
    <n-card class="login-content" hoverable>
      <n-alert :show-icon="false">
        {{ $t("login.tip") }}
      </n-alert>
      <n-form ref="formRef" :model="formData" :rules="formRules">
        <n-form-item :label="$t('login.password')" path="password">
          <n-input
            v-model:value="formData.password"
            :placeholder="$t('login.placeholder')"
            type="password"
            show-password-on="mousedown"
            @keyup.enter="toLogin"
          />
        </n-form-item>
      </n-form>
      <n-button
        :loading="loading"
        :disabled="loading"
        type="primary"
        @click="toLogin"
      >
        {{ $t("login.submit") }}
      </n-button>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from "naive-ui";
import SHA256 from "crypto-js/sha256";

const { t } = useI18n();
const statusStore = useStatusStore();

// 表单数据
const formRef = ref<FormInst>();
const formData = ref<{ password: string }>({ password: "" });
const formRules: FormRules = {
  password: {
    required: true,
    message: t("login.placeholder"),
    trigger: ["input", "blur"],
  },
};
const loading = ref<boolean>(false);

// 尝试登录
const toLogin = useDebounce(
  async () => {
    try {
      // 校验表单
      await formRef.value?.validate();
      loading.value = true;
      // 随机延时 - 开发环境
      const delay = Math.floor(Math.random() * 1000) + 500;
      await sleep(delay);
      // 尝试登录
      const password = SHA256(formData.value.password).toString();
      await $fetch("/api/verify", { method: "POST", body: { password } });
      statusStore.loginStatus = true;
      window.$message.success(t("login.success"));
    } catch (error) {
      console.error("error in login", error);
      window.$message.error(t("login.error"));
    } finally {
      loading.value = false;
    }
  },
  300,
  { leading: true, trailing: false },
);
</script>

<style lang="scss" scoped>
.site-login {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .login-content {
    max-width: 480px;
    width: 100%;
    margin: 0 20px;
    border-radius: 12px;
    .n-alert {
      margin-bottom: 20px;
      text-align: center;
    }
    .n-button {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
