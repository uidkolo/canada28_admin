<template>
  <div class="app-container">
    <el-table :data="list" stripe border>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="ID" width="170"> </el-table-column>
      <el-table-column prop="avatar" label="头像" width="60">
        <template slot-scope="scope">
          <el-image
            style="width: 40px; height: 40px; border-radius: 40px"
            :src="scope.row.avatar"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100">
      </el-table-column>
      <el-table-column
        prop="openId"
        label="openID"
        width="180"
      ></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120">
      </el-table-column>
      <el-table-column prop="parentId" label="邀请人ID"> </el-table-column>
      <el-table-column prop="createTime" label="注册时间"> </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="onPageChange">
    </el-pagination>
  </div>
</template>

<script>
import { getList } from "@/api/user";
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
    };
  },
  watch: {},
  created() {
    this.getList();
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
