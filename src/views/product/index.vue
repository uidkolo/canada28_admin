<template>
  <div class="app-container">

    <div class="btns">
      <el-button type="primary" @click="createVisible = true">创建商品</el-button>
    </div>

    <el-table :data="list" stripe border style="margin-top: 10px;">
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="classifyName" label="所属分类"></el-table-column>
      <el-table-column label="价格" width="100">
        <template slot-scope="scope">
          <span>￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="库存" width="80"></el-table-column>
      <el-table-column prop="virtualSales" label="虚拟销量" width="80"></el-table-column>
      <el-table-column prop="sales" label="真实销量" width="80"></el-table-column>
      <el-table-column prop="virtualBrowseNum" label="虚拟浏览量" width="100"></el-table-column>
      <el-table-column prop="browseNum" label="真实浏览量" width="100"></el-table-column>
      <el-table-column prop="virtualLikeNum" label="虚拟点赞数" width="100"></el-table-column>
      <el-table-column prop="likeNum" label="真实点赞数" width="100"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDel(scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange">
    </el-pagination>

    <!-- 创建分类弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="600px">
      <el-form :model="form">

        <el-form-item label="名称" label-width="90px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="分类" label-width="90px">
          <el-select v-model="form.classifyId" placeholder="请选择商品分类">
            <el-option v-for="item in classifyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" label-width="90px">
          <el-input v-model="form.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="库存" label-width="90px">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>

        <el-form-item label="虚拟销量" label-width="90px">
          <el-input v-model="form.virtualSales"></el-input>
        </el-form-item>

        <el-form-item label="虚拟浏览量" label-width="90px">
          <el-input v-model="form.virtualBrowseNum"></el-input>
        </el-form-item>

        <el-form-item label="虚拟点赞数" label-width="90px">
          <el-input v-model="form.virtualLikeNum"></el-input>
        </el-form-item>

        <el-form-item label="描述" label-width="90px">
          <el-input type="textarea" v-model="form.describe"></el-input>
        </el-form-item>

        <el-form-item label="商品图片" class="img_box" label-width="90px">
          <div class="img_item" v-for="(item, index) in form.pictures" :key="index">
            <div class="mask">
              <div class="icon-box">
                <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item)"></i>
                <i class="el-icon-delete" @click="handleRemove(index)"></i>
              </div>
            </div>
            <el-image :src="item" fit="cover"></el-image>
          </div>
          <el-upload
            :action="uploadUrl"
            :data="updateData"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfire">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getList, create, update, remove } from "@/api/product";
import { getList as getClassifyList } from "@/api/productClassify";
import { getToken, getUploadUrl } from "@/api/qiniu";
import { formatTime } from "@/utils/util";
export default {
  name: "User",
  components: {},
  data() {
    return {
      classifyList: [],
      list: [],
      listLoading: false,
      pageNo: 1,
      total: 1,
      dialogTitle: '创建商品',
      createVisible: false,
      isEdit: false,
      editIndex: 0,
      form: {
        name: '',
        classifyId: '',
        pictures: [],
        describe: '',
        price: '',
        amount: '',
        virtualSales: '',
        virtualBrowseNum: '',
        virtualLikeNum: ''
      },
      uploadUrl: '', //七牛云上传地址
      imageDomain: '',
      updateData: {
        token: '',
        bucket: 'red-packet-image'
      },
      previewImageUrl: '',
      previewVisible: false
    };
  },
  watch:{
    createVisible(value){
      if(!value){
        this.form = {
          name: '',
          classifyId: '',
          pictures: [],
          describe: '',
          price: '',
          amount: '',
          virtualSales: '',
          virtualBrowseNum: '',
          virtualLikeNum: ''
        }
      }
    }
  },
  created() {
    this.getList()
    this.getClassifyList()
    this.getUploadUrl()
  },
  methods: {
    // 获取分类列表
    async getClassifyList(){
      const { list } = await getClassifyList({
        pageSize: 500
      })
      this.classifyList = list
    },
    //获取上传地址
    async getUploadUrl(){
      const { token, domain } = await getToken()
      const url = await getUploadUrl(token)
      this.updateData.token = token
      this.imageDomain = domain
      this.uploadUrl = url
    },
    async getList() {
      const { list, total } = await getList({ pageNo: this.pageNo });
      list.map((item) => {
        item.createTime = formatTime(new Date(item.createTime));
        item.pictures = item.pictures.split(',')
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
      const formData = {...this.form}
      formData.pictures = formData.pictures.join(',')
      const result = await create(formData)
      if(result){
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.createVisible = false
        this.form.name = ''
        this.refresh()
      }
    },
    //编辑
    handleEdit(index, row){
      this.editIndex = index
      this.isEdit = true
      this.form = row
      this.dialogTitle = '编辑商品'
      this.createVisible = true
    },
    //确认修改
    async comfireUpdate(){
      const row = this.list[this.editIndex]
      const formData = {...row}
      formData.pictures = formData.pictures.join(',')
      const result = await update(formData.id, formData)
      if(result){
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.createVisible = false
        this.form.name = ''
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
    },
    //上传成功
    handleUploadSuccess(response){
      const url = this.imageDomain + response.key
      this.form.pictures.push(url)
    },
    //预览图片
    handlePictureCardPreview(url) {
        this.previewImageUrl = url
        this.previewVisible = true
    },
    //移除图片
    handleRemove(index){
      this.form.pictures.splice(index,1)
    }
  },
};
</script>

<style lang="scss">
.img_box {
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  }
}
.el-upload {
  position: relative;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }
  &:hover {
    .mask {
      display: block;
    }
    .el-icon-delete {
      display: block;
    }
  }
}

</style>

<style lang='scss' scoped>
.el-pagination{
  margin-top: 10px;
  text-align: center;
}
.el-select{
  display: block;
}
.img_item {
    width: 148px;
    height: 148px;
    margin: 0 10px 10px 0;
    border: 1px dashed #c0ccda;
    position: relative;
    overflow: hidden;
    .mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
      .icon-box{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 3;
        font-size: 20px;
        color: #fff;
        i{
          cursor: pointer;
          &+i{
            margin-left: 10px;
          }
        }
      }
    }
    &:hover {
      .mask {
        display: block;
      }
      .el-icon-delete {
        display: block;
      }
    }
  }
</style>
