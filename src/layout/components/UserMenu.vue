<script lang="ts" setup>
import { useUserStore } from '~/store'
const userStore = useUserStore()
const router = useRouter()

const logOut = async () => {
  await userStore.logOut()
  router.push('/login')
}
</script>

<template>
  <el-dropdown>
    <span class="el-dropdown-link flex items-center">
      {{ userStore.userProfile.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
