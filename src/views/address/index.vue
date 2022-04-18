<template>
  <div class="app-container">

    <el-card v-loading="listLoading" header="Recharge wallet address（USDT-TRC20）">
      <div v-if="list[0]" class="info">
        <img :src="list[0].qrcode" alt="">
        <span class="address">{{ list[0].address }}</span>
        <el-button type="primary" @click="handleEdit"><i class="el-icon-edit el-icon--left" />Edit</el-button>
      </div>
      <div v-else class="add">
        <el-button type="primary" @click="createVisible=true"><i class="el-icon-plus el-icon--left" />Add</el-button>
      </div>
    </el-card>

    <!-- 创建分类弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="500px">
      <el-form :model="form">

        <el-form-item label="address" label-width="90px">
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="qrcode" class="img_box" label-width="90px">
          <div v-if="form.qrcode" class="img_item">
            <div class="mask">
              <div class="icon-box">
                <i class="el-icon-delete" @click="handleRemove()" />
              </div>
            </div>
            <el-image :src="form.qrcode" fit="cover" />
          </div>
          <el-upload
            v-else
            :action="uploadUrl"
            :data="updateData"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
          >
            <i class="el-icon-plus" />
          </el-upload>
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
import { getList, create, update, remove } from '@/api/address'
import { getToken, getUploadUrl } from '@/api/qiniu'
import { formatTime } from '@/utils/util'
export default {
  name: 'User',
  components: {},
  data() {
    return {
      listLoading: false,
      list: [],
      pageNo: 1,
      total: 1,
      dialogTitle: 'Edit',
      createVisible: false,
      form: {
        name: 'trc20',
        address: '',
        qrcode: ''
      },
      isEdit: false,
      uploadUrl: '', // 七牛云上传地址
      imageDomain: '',
      updateData: {
        token: '',
        bucket: ''
      }
    }
  },
  watch: {},
  created() {
    this.getList()
    this.getUploadUrl()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { list, total } = await getList({ pageNo: this.pageNo })
      this.list = this.list.concat(list)
      this.total = total
      this.listLoading = false
    },
    // 获取上传地址
    async getUploadUrl() {
      const { token, bucket, domain } = await getToken()
      const url = await getUploadUrl(token)
      this.updateData.token = token
      this.updateData.bucket = bucket
      this.imageDomain = domain
      this.uploadUrl = url
    },
    // 上传成功
    handleUploadSuccess(response) {
      const url = this.imageDomain + response.key
      this.form.qrcode = url
    },
    // 刷新列表
    refresh() {
      this.pageNo = 1
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
          message: ' Add success',
          type: 'success'
        })
        this.createVisible = false
        this.refresh()
      }
    },
    // 编辑
    handleEdit() {
      this.isEdit = true
      const item = { ...this.list[0] }
      this.form = {
        name: item.name,
        address: item.address,
        qrcode: item.qrcode
      }
      this.dialogTitle = 'Edit'
      this.createVisible = true
    },
    // 确认修改
    async comfireUpdate() {
      const result = await update(this.list[0].id, this.form)
      if (result) {
        this.$message({
          message: 'Edit success',
          type: 'success'
        })
        this.createVisible = false
        this.form.name = ''
        this.form.phone = ''
        this.form.password = ''
        this.refresh()
      }
    },
    // 移除图片
    handleRemove() {
      this.form.qrcode = ''
    }
  }
}
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

<style scoped lang="scss">
.app-container{
  width: 400px;
  margin: 0 auto;
}
.info{
  display: flex;
  flex-direction: column;
}
.info .address{
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}
.add{
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img_item {
    width: 148px;
    height: 148px;
    margin: 0 10px 10px 0;
    border: 1px dashed #c0ccda;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
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
