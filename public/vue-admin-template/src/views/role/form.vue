<template>
  <el-dialog title="" :visible.sync="show" :close-on-click-modal="false" @close="closeDialog">
    <el-form :model="form">
      <el-form-item label="角色名">
        <el-input v-model="form.name" placeholder="" />
      </el-form-item>

      <el-form-item label="角色标识">
        <el-input v-model="form.flag" placeholder="" />
      </el-form-item>

      <el-form-item label="">
        <el-button type="" @click="form = {}">清 除</el-button>
        <el-button type="success" @click="submit">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { createRole, updateRole, showRole } from '@/api/role'

export default {
  mixins: [dialogMixin],
  props: {
    targetId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    if (this.targetId !== 0) {
      showRole(this.targetId).then(res => {
        this.$set(this.form, 'name', res.data.name)
        this.$set(this.form, 'flag', res.data.flag)
      })
    }
  },
  methods: {
    async submit() {
      this.targetId === 0 ? await createRole(this.form) : await updateRole(this.targetId, this.form)
      this.$message.success('提交成功')
      this.$emit('submitSuccess')
      this.show = false
    }
  }
}
</script>
