<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index" />
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column label="金额" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }} U</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="用户ID" width="110" />
      <el-table-column label="用户名称" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.first_name }}{{ scope.row.last_name?` ${scope.row.last_name}`:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现地址">
        <template slot-scope="scope">
          <span style="margin-right: 10px">{{ scope.row.user_address }}</span>
          <el-button type="info" plain size="mini" round @click="showQrcode(scope.row)">二维码</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提下时间" width="200" />
      <el-table-column label="订单状态" width="110">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="info" plain size="mini" round>无效订单</el-button>
          <el-button v-if="scope.row.status == 1" type="primary" plain size="mini" round>待审核</el-button>
          <el-button v-if="scope.row.status == 2" type="success" plain size="mini" round>已完成</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 1" size="mini" @click="handleDel(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.status == 1" size="mini" @click="update(scope.row.id, 0)">拒绝</el-button>
          <el-button v-if="scope.row.status == 1" type="primary" size="mini" @click="update(scope.row.id, 2)">完成转币</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange" />

    <!-- 二维码弹窗 -->
    <div v-if="qrcodeVisible" class="dialog" @click="qrcodeVisible=false">
      <div class="box">
        <div class="title">{{ dialogTitle }}</div>
        <qrcode :text="user_address" />
      </div>
    </div>

  </div>
</template>

<script>
import { getList, remove, update } from '@/api/order'
import { formatTime } from '@/utils/util'
import qrcode from '@/components/Qrcode'
export default {
  name: 'User',
  components: { qrcode },
  data() {
    return {
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      qrcodeVisible: false,
      dialogTitle: '提币二维码',
      user_address: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { list, total } = await getList({ type: 2, pageNo: this.pageNo })
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
    // 删除订单
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
    },
    // 修改订单状态
    update(id, status) {
      this.$confirm(`${status == 0 ? 'Refuse？' : 'Complete'}`, 'Tip', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        const result = await update(id, {
          status
        })
        if (result) {
          this.$message({
            message: 'Edit success',
            type: 'success'
          })
          this.refresh()
        }
      })
    },
    // 查看二维码
    showQrcode(item) {
      const { user_address, first_name } = item
      this.dialogTitle = `${first_name}`
      this.user_address = user_address
      this.qrcodeVisible = true
    }
  }
}
</script>

<style lang='scss' scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
.dialog{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  left: 0;
  top: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .box{
    background: white;
    .title{
      padding: 10px;
      font-size: 18px;
      border-bottom: 1px solid #cdcdcd;
      text-align: center;
    }
  }
}
</style>
