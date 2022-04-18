<template>
  <div class="card-panel">
    <div class="card-panel-icon" :style="`color: ${color}; --hover-bg: ${color}`">
      <svg-icon :icon-class="icon" class-name="card-panel-icon" />
    </div>
    <div class="card-panel-description">
      <div class="card-panel-text">{{ name }}</div>
      <count-to :start-val="0" :end-val="value" :duration="2600" class="card-panel-num" />
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#36a3f7'
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  mounted() {
    console.log(this.number)
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-panel {
    height: 120px;
    padding: 10px 20px 10px 10px;
    cursor: pointer;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      .card-panel-icon {
        color: #fff;
        background: var(--hover-bg);
      }
    }

    .card-panel-icon {
      transition: all 0.38s ease-out;
      border-radius: 6px;
      font-size: 80px;
      padding: 10px 15px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
</style>
