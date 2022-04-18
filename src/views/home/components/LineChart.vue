<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xData, yData } = {}) {
      const { userNumber, userNumberDay, inAmount, inAmountDay, outAmount, outAmountDay, countAmount, countAmountDay } = yData
      this.chart.setOption({
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['用户总数', '每日新增用户', '充值总额', '每日充值', '提现总额', '每日提现', '净充值总额', '每日净充值']
        },
        series: [{
          name: '用户总数',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: userNumber,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '每日新增用户',
          type: 'bar',
          data: userNumberDay
        },
        {
          name: '充值总额',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#40c9c6',
              lineStyle: {
                color: '#40c9c6',
                width: 2
              }
            }
          },
          data: inAmount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '每日充值',
          type: 'bar',
          data: inAmountDay
        },
        {
          name: '提现总额',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#c600ff',
              lineStyle: {
                color: '#c600ff',
                width: 2
              }
            }
          },
          data: outAmount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '每日提现',
          type: 'bar',
          data: outAmountDay
        },
        {
          name: '净充值总额',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#000000',
              lineStyle: {
                color: '#000000',
                width: 2
              }
            }
          },
          data: countAmount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '每日净充值',
          type: 'bar',
          data: countAmountDay
        }]
      })
    }
  }
}
</script>
