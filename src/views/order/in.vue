<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index" />
      <el-table-column prop="id" label="ID" />
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }} U</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="用户ID" />
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.first_name }} {{ scope.row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="From address" prop="转入地址" />
      <el-table-column prop="createTime" label="到账时间" />
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="info" plain size="mini" round>无效订单</el-button>
          <el-button v-if="scope.row.status == 1" type="primary" plain size="mini" round>待审核</el-button>
          <el-button v-if="scope.row.status == 2" type="success" plain size="mini" round>已完成</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange" />

  </div>
</template>

<script>
import { getList, remove } from '@/api/order'
import { formatTime } from '@/utils/util'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { list, total } = await getList({ type: 1, pageNo: this.pageNo })
      list.map((item) => {
        item.createTime = formatTime(new Date(item.create_time))
      })
      this.list = this.list.concat(list)
      this.total = total
      this.listLoading = false
    },
    // 翻页
    onPageChange(pageNo) {
      this.pageNo = pageNo
      this.list = []
      this.getList()
    },
    // 刷新列表
    refresh() {
      this.pageNo = 1
      this.list = []
      this.getList()
    },
    // 删除
    handleDel(id) {
      this.$confirm('It cannot be restored after being deleted?', 'Tip', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        const result = await remove(id)
        if (result) {
          this.$message({
            message: 'Del success',
            type: 'success'
          })
          this.refresh()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
</style>
