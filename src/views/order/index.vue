<template>
  <div class="app-container">

    <el-table :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column label="金额" width="100">
        <template slot-scope="scope">
          <span>￥{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column label="订单状态" width="100">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" round v-if="scope.row.status == 0">待支付</el-button>
          <el-button type="success" size="mini" round v-else>已成功</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="160"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange">
    </el-pagination>

  </div>
</template>

<script>
import { getList, remove } from "@/api/order";
import { formatTime } from "@/utils/util";
export default {
  name: "User",
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      dialogTitle: '创建订单',
      createVisible: false,
      isEdit: false,
      editIndex: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { list, total } = await getList({ pageNo: this.pageNo });
      list.map((item) => {
        item.createTime = formatTime(new Date(item.createTime));
      });
      this.list = this.list.concat(list);
      this.total = total;
    },
    // 翻页
    onPageChange(pageNo){
      this.pageNo = pageNo
      this.list = []
      this.getList()
    },
    // 刷新列表
    refresh(){
      this.pageNo = 1
      this.list = []
      this.getList()
    },
    //删除
    handleDel(id){
      this.$confirm('删除后不可恢复, 是否继续?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await remove(id)
        if(result){
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.refresh()
        }
      })
    }
  },
};
</script>

<style lang='scss' scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
</style>
