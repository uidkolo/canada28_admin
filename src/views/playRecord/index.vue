<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" stripe border>
      <el-table-column type="index" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="user_id" label="用户ID" />
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.first_name }} {{ scope.row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qishu" label="投注期数" />
      <el-table-column prop="amount" label="投注金额" />
      <el-table-column label="投注选项">
        <template slot-scope="scope">
          <span>{{ scope.row.number ?`定位（${scope.row.number}）`: scope.row.play_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否中奖" width="100px" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.is_win === 1" class="el-icon-check" style="color: green;" />
          <i v-if="scope.row.is_win === 2" class="el-icon-close" style="color:red" />
          <span v-if="scope.row.is_win === 0">⏳</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下注时间" />
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange" />
  </div>
</template>

<script>
import { getList, remove } from '@/api/playRecord'
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
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { list, total } = await getList({ pageNo: this.pageNo, id: this.id })
      list.map((item) => {
        item.username = '@' + item.username
        item.name = item.first_name + ' ' + item.last_name
        item.createTime = formatTime(new Date(item.create_time))
      })
      this.list = this.list.concat(list)
      this.total = total
      this.listLoading = false
    },
    refresh() {
      this.pageNo = 1
      this.list = []
      this.getList()
    },
    // 翻页
    onPageChange(pageNo) {
      this.pageNo = pageNo
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

<style scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
</style>
