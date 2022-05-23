<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { formatSpec } from '~/utils'
import * as appAPI from '~/api/application'

const props = defineProps<{
  type: string
  isVisible: boolean
  app: any
  specs: any[]
}>()

const emit = defineEmits<{
  closeCreateDialog: () => void
  getApplications: () => void
}>()

const initCreateForm = () => ({
  _id: '',
  appid: '',
  name: '',
  spec: '',
})

let appForm = $ref<{
  _id?: string
  appid?: string
  name: string
  spec: string
}>(initCreateForm())

watchEffect(() => {
  const { _id, name, spec, appid } = props.app
  appForm = {
    _id,
    appid,
    name,
    spec,
  }
})

const formRef = $ref<FormInstance>()
const formRules = {
  name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
  ],
  spec: [
    { required: true, message: '请选择应用规格', trigger: 'change' },
  ],
}

let createFormLoading = $ref(false)
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl)
    return

  formEl.validate(async (valid: boolean) => {
    if (!valid)
      return

    createFormLoading = true
    const { appid, name, spec } = appForm
    let res = null
    if (props.type === 'create')
      res = await appAPI.createApplication({ name, spec })
    else
      res = await appAPI.updateApplication({ appid, name })

    createFormLoading = false
    if (res.code) {
      ElMessage.error(res.error)
      return
    }

    createFormLoading = false
    emit('closeCreateDialog')
    ElMessage.success('操作成功！')
    appForm = initCreateForm()
    emit('getApplications')
  })
}
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="type === 'update' ? '编辑应用' : '创建应用'"
  >
    <el-form
      ref="formRef"
      :model="appForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="appForm.name" placeholder="应用名称" />
      </el-form-item>
      <el-form-item v-show="type === 'create'" label="选择规格" prop="spec">
        <el-radio-group v-model="appForm.spec">
          <el-tooltip v-for="spec in specs" :key="spec.name" placement="bottom">
            <template #content>
              {{ formatSpec(spec).text }}
            </template>
            <el-radio :label="spec.name" border>
              <div style="display:inline-block;">
                {{ spec.label }}
              </div>
            </el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('closeCreateDialog')">
        取 消
      </el-button>
      <el-button type="primary" :loading="createFormLoading" @click="handleSubmit(formRef)">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>
