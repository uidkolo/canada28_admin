<template>
  <div class="qrcode">
    <div id="qrcode" ref="qrcode" class="v-qrcode" />
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  name: 'Qrcode',
  props: {
    text: {
      type: String,
      value: ''
    },
    width: {
      type: Number,
      value: 200
    },
    height: {
      type: Number,
      value: 200
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.creatQrCode(this.text)
    console.log('mouted')
  },
  destroyed() {
    console.log('destroyed')
    this.qrcodeDoc && this.qrcodeDoc.clear() // 清除二维码
  },
  methods: {
    creatQrCode(text) {
      this.qrcodeDoc = new QRCode(this.$refs.qrcode, {
        text: text,
        width: 200,
        height: 200,
        colorDark: '#333333', // 二维码颜色
        colorLight: '#ffffff' // 二维码背景色
      })
    }
  }
}

</script>

<style scoped>
.qrcode{
  padding: 10px;
  background: white;
}
</style>
