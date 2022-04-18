<template>
  <div v-loading="listLoading" class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>钱包机器人</span>
        <el-button v-if="wallet" style="float: right;" type="primary" size="small" @click="edit('wallet')">编辑</el-button>
      </div>
      <div v-if="wallet" class="content">
        <div class="item">
          <span class="lable">名称：</span>
          <span class="value">{{ wallet.name }}</span>
        </div>
        <div class="item">
          <span class="lable">Token：</span>
          <span class="value">{{ wallet.token }}</span>
        </div>
        <div class="item">
          <span class="lable">用户名：</span>
          <span class="value">{{ wallet.username }}</span>
        </div>
        <div class="item">
          <span class="lable">WebHookUrl：</span>
          <span class="value">{{ wallet.url }}</span>
        </div>
        <div class="item">
          <span class="lable">IP地址：</span>
          <span class="value">{{ wallet.ip_address }}</span>
        </div>
        <div class="item">
          <span class="lable">上次报错时间：</span>
          <span class="value">{{ wallet.last_error_date }}</span>
        </div>
        <div class="item">
          <span class="lable">上次报错信息：</span>
          <span class="value">{{ wallet.last_error_message }}</span>
        </div>
        <div class="item">
          <span class="lable">最大连接数：</span>
          <span class="value">{{ wallet.max_connections }}</span>
        </div>
        <div class="item">
          <span class="lable">堵塞信息数：</span>
          <span class="value">{{ wallet.pending_update_count }}<span class="tip">（该值长时间大于0请重启机器人）</span></span>
        </div>
        <div class="item">
          <span class="lable">创建时间：</span>
          <span class="value">{{ wallet.create_time }}</span>
        </div>
        <div class="btns">
          <el-button type="plain" icon="el-icon-edit" size="small" @click="setWebHook('wallet')">设置WebHook</el-button>
          <el-button type="plain" icon="el-icon-refresh" size="small" @click="restart('wallet')">重启</el-button>
        </div>
      </div>
      <div v-else class="add">
        <el-button type="plain" icon="el-icon-plus" @click="add('wallet')">新增</el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>彩票机器人</span>
        <el-button v-if="lottery" style="float: right;" type="primary" size="small" @click="edit('lottery')">编辑</el-button>
      </div>
      <div v-if="lottery" class="content">
        <div class="item">
          <span class="lable">名称：</span>
          <span class="value">{{ lottery.name }}</span>
        </div>
        <div class="item">
          <span class="lable">Token：</span>
          <span class="value">{{ lottery.token }}</span>
        </div>
        <div class="item">
          <span class="lable">用户名：</span>
          <span class="value">{{ lottery.username }}</span>
        </div>
        <div class="item">
          <span class="lable">WebHookUrl：</span>
          <span class="value">{{ lottery.url }}</span>
        </div>
        <div class="item">
          <span class="lable">IP地址：</span>
          <span class="value">{{ lottery.ip_address }}</span>
        </div>
        <div class="item">
          <span class="lable">上次报错时间：</span>
          <span class="value">{{ lottery.last_error_date }}</span>
        </div>
        <div class="item">
          <span class="lable">上次报错信息：</span>
          <span class="value">{{ lottery.last_error_message }}</span>
        </div>
        <div class="item">
          <span class="lable">最大连接数：</span>
          <span class="value">{{ lottery.max_connections }}</span>
        </div>
        <div class="item">
          <span class="lable">堵塞信息数：</span>
          <span class="value">{{ lottery.pending_update_count }}<span class="tip">（该值长时间大于0请重启机器人）</span></span>
        </div>
        <div class="item">
          <span class="lable">创建时间：</span>
          <span class="value">{{ lottery.create_time }}</span>
        </div>
        <div class="btns">
          <el-button type="plain" icon="el-icon-edit" size="small" @click="setWebHook('lottery')">设置WebHook</el-button>
          <el-button type="plain" icon="el-icon-refresh" size="small" @click="restart('lottery')">重启</el-button>
        </div>
      </div>
      <div v-else class="add">
        <el-button type="plain" icon="el-icon-plus" @click="add('lottery')">新增</el-button>
      </div>
    </el-card>

    <!-- 创建弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="createVisible" width="400px">
      <el-form :model="form">
        <el-form-item label="name">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="token">
          <el-input v-model="form.token" />
        </el-form-item>
        <el-form-item label="username">
          <el-input v-model="form.username" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">Cancel</el-button>
        <el-button type="primary" @click="comfire">Comfirm</el-button>
      </div>
    </el-dialog>

    <!-- 设置webhook弹窗 -->
    <el-dialog title="设置webhook" :visible.sync="webhookVisible" width="400px">
      <el-input v-model="webhookUrl" placeholder="请输入url地址" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="webhookVisible = false">Cancel</el-button>
        <el-button type="primary" @click="setWebHookComfirm">Comfirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, create, update, setWebHook, restart } from '@/api/bot'
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
        name: '',
        token: '',
        username: ''
      },
      isEdit: false,
      wallet: null,
      lottery: null,
      webhookVisible: false,
      curSetWebhook: '',
      webhookUrl: ''
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
      list.map(item => {
        item.create_time = formatTime(new Date(item.create_time))
        item.last_error_date = item.last_error_date ? formatTime(new Date(item.last_error_date * 1000)) : ''
        if (item.name == 'wallet') {
          this.wallet = item
        } else {
          this.lottery = item
        }
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
    add(name) {
      this.createVisible = true
      this.form.name = name
      this.isEdit = false
      if (name == 'wallet') {
        this.dialogTitle = 'Add wallet bot'
      } else {
        this.dialogTitle = 'Add lottery bot'
      }
    },
    edit(name) {
      this.createVisible = true
      this.isEdit = true
      if (name == 'wallet') {
        this.form = {
          ...this.wallet
        }
        this.dialogTitle = 'Edit wallet bot'
      } else {
        this.form = {
          ...this.lottery
        }
        this.dialogTitle = 'Edit lottery bot'
      }
    },
    // 确定
    comfire() {
      if (this.isEdit) {
        this.update()
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
        this.form.name = ''
        this.form.token = ''
        this.form.username = ''
        this.refresh()
      }
    },
    // 确认修改
    async update() {
      const result = await update(this.form.id, this.form)
      if (result) {
        this.$message({
          message: 'Edit success',
          type: 'success'
        })
        this.createVisible = false
        this.form.name = ''
        this.form.token = ''
        this.form.username = ''
        this.refresh()
      }
    },
    setWebHook(name) {
      this.curSetWebhook = name
      this.webhookVisible = true
    },
    async setWebHookComfirm() {
      let result
      if (this.curSetWebhook == 'wallet') {
        result = await setWebHook(this.wallet.token, this.webhookUrl)
      } else {
        result = await setWebHook(this.lottery.token, this.webhookUrl)
      }
      if (result) {
        this.$message({
          message: ' Set success',
          type: 'success'
        })
        this.curSetWebhook = ''
        this.webhookVisible = false
        this.refresh()
      }
    },
    async restart(name) {
      let result
      if (name == 'wallet') {
        result = await restart(this.wallet.token, this.wallet.url)
      } else {
        result = await restart(this.lottery.token, this.lottery.url)
      }
      if (result) {
        this.$message({
          message: ' Restart success',
          type: 'success'
        })
        this.refresh()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .box-card{
    width: 480px;
    margin: 0 10px;
    flex-shrink: 0;
    .content{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .item{
        display: flex;
        align-items: center;
        font-size: 14px;
        &+.item{
          margin-top: 15px;
        }
        .label{
          color: #999;
        }
        .value{
          color: #333;
          .tip{
            color: coral;
          }
        }
      }
    }
    .add{
      display: flex;
      align-content: center;
      justify-content: center;
      padding-top: 20px;
    }
    .btns{
      padding-top: 20px;
      border-top: 1px soli #ededed;
      display: flex;
      align-items: center;
    }
  }
}
</style>
