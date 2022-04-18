<template>
  <div v-loading="listLoading" class="home">

    <div class="top">
      <div class="item"><panel-group icon="peoples" color="#40c9c6" name="今日注册" :value="todayDataValue.userNumber" /></div>
      <div class="item"><panel-group icon="money" color="#006c14" name="今日充值(U)" :value="todayDataValue.inAmount" /></div>
      <div class="item"><panel-group icon="guide" color="#004f6c" name="今日提现(U)" :value="todayDataValue.outAmount" /></div>
      <div class="item"><panel-group icon="wallet" color="#6c0029" name="今日净充值(U)" :value="todayDataValue.countAmount" /></div>
      <div class="item"><panel-group icon="message" color="#d97b00" name="提现中订单" :value="out_order_number" /></div>
    </div>
    <div class="bottom">
      <line-chart :chart-data="chartData" />
    </div>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { get, getList } from '@/api/stat'
import { getList as getOrderList } from '@/api/order'
import { formatTime } from '@/utils/util'

export default {
  name: 'Home',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      todayData: {},
      out_order_number: 0,
      timeout: null,
      listLoading: false,
      list: [],
      chartData: {
        xData: [],
        yData: {
          userNumber: [],
          userNumberDay: [],
          inAmount: [],
          inAmountDay: [],
          outAmount: [],
          outAmountDay: [],
          countAmount: [],
          countAmountDay: []
        }
      }
    }
  },
  computed: {
    todayDataValue() {
      const { user_number_today, in_amount_today, out_amount_today } = this.todayData
      return {
        userNumber: user_number_today || 0,
        inAmount: in_amount_today || 0,
        outAmount: out_amount_today || 0,
        countAmount: in_amount_today - out_amount_today ? in_amount_today - out_amount_today : 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  destroyed() {
    this.timeout && clearTimeout(this.timeout)
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    async getList() {
      this.listLoading = true
      const { list } = await getList({
        pageNo: 1,
        pageSize: 30
      })

      list.map(item => {
        const { user_number, user_number_today, in_amount, in_amount_today, out_amount, out_amount_today, create_time } = item

        // x轴
        const time = formatTime(new Date(create_time))
        const dayArr = time.split(' ')[0].split('-')
        this.chartData.xData.push(`${dayArr[1]}/${dayArr[2]}`)

        // y轴
        this.chartData.yData.userNumber.push(user_number)
        this.chartData.yData.userNumberDay.push(user_number_today)
        this.chartData.yData.inAmount.push(in_amount)
        this.chartData.yData.inAmountDay.push(in_amount_today)
        this.chartData.yData.outAmount.push(out_amount)
        this.chartData.yData.outAmountDay.push(out_amount_today)
        this.chartData.yData.countAmount.push(in_amount - out_amount)
        this.chartData.yData.countAmountDay.push(in_amount_today - out_amount_today)
      })

      this.list = list
      this.get()
      this.listLoading = false
    },
    async get() {
      this.timeout && clearTimeout(this.timeout)
      const list = this.list
      if (list[list.length - 1]) {
        const id = list[list.length - 1].id
        const data = await get(id)
        this.todayData = data
        this.getOrderList()
        this.timeout = setTimeout(this.get, 5000)
      }
    },
    async getOrderList() {
      const { list } = await getOrderList({
        pageNo: 1,
        pageSize: 50,
        type: 2,
        status: 1
      })
      this.out_order_number = list.length
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .top{
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item{
      flex-grow: 1;
      &+.item{
        margin-left: 10px;
      }
    }
  }
  .bottom{
    background: white;
    padding: 0 20px;
    margin-top: 30px;
  }
}

</style>
