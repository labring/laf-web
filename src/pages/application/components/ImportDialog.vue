<script setup lang="ts">
import * as appAPI from '~/api/application'

const props = defineProps<{
  importDialogVisible: boolean
  app: any
}>()

const emit = defineEmits<{
  showUpdateDialog: (app: any) => void
  getApplications: () => void
  closeImportDialog: (visible: boolean) => void
}>()

let importForm = $ref({
  app: null,
  file: null,
})

watchEffect(() => {
  importForm.app = props.app
})

const importFormRules = {
  app: [{ required: true, message: '没选择应用', trigger: 'blur' }],
  file: [{ required: true, message: '请选择导入文件', trigger: 'blur' }],
}

const onImportFileChanged = (data) => {
  const file = data.raw
  importForm.file = file
}

let importDialogLoading = $ref(false)
const handleImportApp = async () => {
  importDialogLoading = true
  if (!importForm.file || !importForm.app)
    return

  const app = importForm.app
  const file = importForm.file
  const appid = app.appid
  const res = await appAPI.importApplication(appid, file)
  if (res.error) {
    ElMessage.error(`导入失败:${res.error}`)
    return
  }

  // 重启应用
  await appAPI.restartApplicationInstance(app.appid)

  ElMessage.success('导入应用成功!')
  importForm = { app: null, file: null }
  emit('closeImportDialog')
}
</script>

<template>
  <el-dialog v-model="importDialogVisible" title="导入应用">
    <el-form
      ref="importFormRef"
      :rules="importFormRules"
      :model="importForm"
      label-position="left"
      label-width="120px"
      style="width: 300px; margin-left:20px;"
    >
      <el-form-item label="应用" prop="app">
        {{ importForm.app?.name }}
      </el-form-item>
      <el-form-item label="选择应用文件" prop="file">
        <el-upload
          ref="uploader"
          action=""
          :auto-upload="false"
          :multiple="false"
          :show-file-list="true"
          accept=".lapp"
          :limit="1"
          :on-change="onImportFileChanged"
        >
          <el-button slot="trigger" plain size="small" type="primary">
            选取导入文件
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('closeImportDialog')">
        取消
      </el-button>
      <el-button :loading="importDialogLoading" type="primary" @click="handleImportApp">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
