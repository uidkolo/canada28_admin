<template>
  <div class="app-container">

    <el-card v-loading="listLoading" class="box-card">
      <div slot="header" class="header">
        <span>当前彩票群ID：{{ group_id?group_id:'未绑定' }}</span>
        <el-button v-if="group_id" size="small" type="primary" @click="remove">解绑</el-button>
      </div>
      <div>
        <h3>绑定步骤：</h3>
        <p>① 若已有绑定群组，请先解除绑定</p>
        <p>② 把彩票机器人拉进群组</p>
        <p>③ 把彩票机器人设为管理员</p>
        <p>④ 在群组@机器人</p>
        <p>⑤ 激活成功</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get, remove } from '@/api/group'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      listLoading: false,
      group_id: ''
    }
  },
  created() {
    this.get()
  },
  methods: {
    async get() {
      this.listLoading = true
      const { group_id } = await get()
      this.group_id = group_id
      this.listLoading = false
    },
    async remove() {
      this.$confirm('确定解除当前群组绑定?', 'Tip', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        const result = await remove()
        if (result) {
          this.$message({
            message: '解除绑定成功',
            type: 'success'
          })
          this.get()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.box-card{
  width: 400px;
  margin: 0 auto;
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
