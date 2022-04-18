<template>
  <div class="app-container">
    <div class="btns">
      <el-button type="primary" @click="createVisible = true">Add</el-button>
      <el-button type="primary" @click="clearData">清除数据</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="password" label="登录密码" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange" />

    <!-- 创建弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="400px">
      <el-form :model="form">
        <el-form-item label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="form.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">Cancel</el-button>
        <el-button type="primary" @click="comfire">Comfirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, create, update, remove, clear } from '@/api/admin'
import { formatTime } from '@/utils/util'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      dialogTitle: 'Add',
      createVisible: false,
      form: {
        name: '',
        phone: '',
        password: ''
      },
      isEdit: false,
      editIndex: 0
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
        item.createTime = formatTime(new Date(item.create_time))
      })
      this.list = this.list.concat(list)
      this.total = total
      this.listLoading = false
    },
    // 刷新列表
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
    // 确定
    comfire() {
      if (this.isEdit) {
        this.comfireUpdate()
      } else {
        this.create()
      }
    },
    // 新增
    async create() {
      const result = await create(this.form)
      if (result) {
        this.$message({
          message: 'add success',
          type: 'success'
        })
        this.createVisible = false
        this.refresh()
      }
    },
    // 编辑
    handleEdit(index, row) {
      this.editIndex = index
      this.isEdit = true
      this.form.name = row.name
      this.dialogTitle = 'Edit'
      this.createVisible = true
    },
    // 确认修改
    async comfireUpdate() {
      const row = this.list[this.editIndex]
      const result = await update(row.id, row)
      if (result) {
        this.$message({
          message: 'edit success',
          type: 'success'
        })
        this.createVisible = false
        this.form.name = ''
        this.form.phone = ''
        this.form.password = ''
        this.refresh()
      }
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
            message: 'del success',
            type: 'success'
          })
          this.refresh()
        }
      })
    },
    // 清除数据
    async clearData() {
      this.$confirm('清除数据?', 'Tip', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        const result = await clear()
        if (result) {
          this.$message({
            message: '清除成功',
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
