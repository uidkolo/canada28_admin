<template>
  <div class="app-container">

    <div class="btns">
      <el-button type="primary" @click="createVisible = true">创建分类</el-button>
    </div>

    <el-table :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange">
    </el-pagination>

    <!-- 创建分类弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="400px">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfire">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { getList, create, update, remove } from "@/api/productClassify";
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
      dialogTitle: '创建商品分类',
      createVisible: false,
      form: {
        name: ''
      },
      isEdit: false,
      editIndex: 0
    };
  },
  watch:{
    createVisible(value){
      if(!value){
        this.form.name = ''
      }
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
    // 确定
    comfire(){
      if(this.isEdit){
        this.comfireUpdate()
      } else {
        this.create()
      }
    },
    //新增
    async create(){
      const { name } = this.form
      if(!name){
        this.$message({
          message: '请输入商品分类名称',
          type: 'warning'
        })
      } else {
        const result = await create(name)
        if(result){
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.createVisible = false
          this.refresh()
        }
      }
    },
    //编辑
    handleEdit(index, row){
      this.editIndex = index
      this.isEdit = true
      this.form.name = row.name
      this.dialogTitle = '编辑商品分类'
      this.createVisible = true
    },
    //确认修改
    async comfireUpdate(){
      const row = this.list[this.editIndex]
      const { name } = this.form
      if(!name){
        this.$message({
          message: '请输入商品分类名称',
          type: 'warning'
        })
      } else {
        row.name = name
        const result = await update(row.id, row)
        if(result){
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.createVisible = false
          this.form.name = ''
          this.refresh()
        }
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

<style scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
</style>
