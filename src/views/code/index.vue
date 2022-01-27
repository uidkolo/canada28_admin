<template>
  <div class="app-container">

    <div class="btns">
      <el-button type="primary" @click="createVisible = true">添加序列号</el-button>
    </div>

    <el-table :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="code" label="序列号"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column label="使用状态" width="100">
        <template slot-scope="scope">
          <el-button type="success" size="mini" round v-if="scope.row.status == 0">未使用</el-button>
          <el-button type="warning" size="mini" round v-else>已使用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange">
    </el-pagination>

    <!-- 添加序列号弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="400px">
      <el-form :model="form">

        <el-form-item label="序列号" label-width="80px">
          <el-input v-model="form.code"></el-input>
        </el-form-item>

        <el-form-item label="所属商品" label-width="80px">
          <el-select v-model="form.productId" placeholder="请选择商品">
            <el-option v-for="item in productList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, create, remove } from "@/api/code";
import { getList as getProductList } from "@/api/product";
import { formatTime } from "@/utils/util";
export default {
  name: "User",
  components: {},
  data() {
    return {
      productList: [],
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      dialogTitle: '创建订单',
      createVisible: false,
      isEdit: false,
      editIndex: 0,
      form: {
        productId: ''
      }
    }
  },
  created() {
    this.getList()
    this.getProductList()
  },
  methods: {
    // 获取商品列表
    async getProductList() {
      const { list } = await getProductList({ pageSize: 500 });
      this.productList = list
    },
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
    //新增
    async create(){
      const { productId, code } = this.form
      const result = await create({ productId, code })
      if(result){
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.createVisible = false
        this.refresh()
      }
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
.el-select{
  display: block;
}
</style>
