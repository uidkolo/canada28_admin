<template>
  <div class="app-container">

    <el-card v-loading="listLoading" class="box-card">
      <div slot="header" class="header">
        <span>私钥设置</span>
      </div>
      <div v-if="isEdit" class="content">
        <el-input v-model="value" placeholder="请输入私钥" />
        <el-button size="small" type="primary" style="margin-left: 10px;" @click="set">确定</el-button>
        <el-button v-if="privateKey" size="small" plain style="margin-left: 10px;" @click="isEdit=false">取消</el-button>
      </div>
      <div v-else class="value">
        <h3>{{ privateKey }}</h3>
        <el-button icon="el-icon-edit" size="small" type="primary" @click="isEdit=true">设置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get, set } from '@/api/privateKey'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      listLoading: false,
      isEdit: false,
      privateKey: '',
      value: ''
    }
  },
  created() {
    this.get()
  },
  methods: {
    async get() {
      this.listLoading = true
      const { privateKey } = await get()
      this.privateKey = privateKey
      this.listLoading = false
    },
    async set() {
      const result = await set(this.value)
      if (result) {
        this.value = ''
        this.isEdit = false
        this.$message({
          message: '设置成功',
          type: 'success'
        })
        this.get()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box-card{
  width: 400px;
  margin: 0 auto;
  .content{
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .value{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
