<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" stripe border>
      <el-table-column type="index" />
      <el-table-column prop="id" label="ID" width="100px" />
      <el-table-column label="自动下注" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.auto_bet" @change="autoBet(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150px" />
      <el-table-column label="名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.first_name }}{{ scope.row.last_name ? `${scope.row.last_name}`:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户总额" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.balance + scope.row.freeze_balance }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="可用余额" width="80px" />
      <el-table-column prop="freeze_balance" label="冻结金额" width="80px" />
      <el-table-column prop="count_today" label="今日流水" width="80px" />
      <el-table-column prop="count" label="历史流水" width="80px" />
      <el-table-column prop="win_today" label="今日盈亏" width="80px" />
      <el-table-column prop="win" label="历史盈亏" width="80px" />
      <el-table-column label="绑定地址(trc20)" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.trc20_address?scope.row.trc20_address:'未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资金密码" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.password?scope.row.password:'not set' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="100px" />
      <el-table-column label="操作" width="260px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="toAccountRecord(scope.row.id)">查看流水</el-button>
          <el-button size="mini" @click="toPlayRecord(scope.row.id)">投注记录</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange" />

    <!-- 创建弹窗 -->
    <el-dialog title="TopUp" :visible.sync="visible" width="400px">
      <el-form :model="form">
        <el-form-item label="Amount">
          <el-input v-model="form.amount" />
        </el-form-item>
        <el-form-item label="是否真实充值（选中则加入统计）">
          <el-switch v-model="form.isStat" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="comfire">Comfirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, topUp, update } from '@/api/user'
import { formatTime } from '@/utils/util'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      visible: false,
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      form: {
        id: '',
        amount: '',
        isStat: false
      }
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { list, total } = await getList({ pageNo: this.pageNo })
      list.map((item) => {
        item.username = '@' + item.username
        item.auto_bet = item.auto_bet == 1
        item.name = item.first_name + ' ' + item.last_name
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
    handleEdit(item) {
      const { id } = item
      this.visible = true
      this.form.id = id
    },
    async comfire() {
      const { amount } = this.form
      if (!amount || amount <= 0) {
        this.$message({
          message: 'Invalid amount',
          type: 'error'
        })
        return false
      }
      const res = await topUp(this.form)
      if (res) {
        this.$message({
          message: 'TopUp success!',
          type: 'success'
        })
        this.visible = false
        this.form.id = ''
        this.form.amount = ''
        this.form.isStat = false
        this.list = []
        this.pageNo = 1
        this.total = 1
        this.getList()
      }
    },
    toAccountRecord(id) {
      this.$router.push({ path: '/accountRecord', query: { id }})
    },
    toPlayRecord(id) {
      this.$router.push({ path: '/playRecord', query: { id }})
    },
    // 自动下注
    autoBet(user) {
      const { id, auto_bet } = user
      this.$confirm('请仔细确认，谨慎操作！', 'Tip', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        const result = await update(id, { auto_bet: auto_bet ? 1 : 0 })
        if (result) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          user.auto_bet = !auto_bet
        }
      }).catch(() => {
        user.auto_bet = !auto_bet
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
