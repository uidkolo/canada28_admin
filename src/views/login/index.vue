<template>
  <div id="login" class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <img class="logo" src="../../assets/public/logo.png">
        <h3 class="title">USDT BANK</h3>
      </div>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="phone"
          name="phone"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >LOGIN</el-button>
    </el-form>
    <div class="bg">
      <div class="g-wrap" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validatephone = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.phone === '') {
      this.$refs.phone.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.animate()
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    animate() {
      class Tool {
        // random number.
        static randomNumber(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min)
        }
        // random color rgb.
        static randomColorRGB() {
          return (
            'rgb(' +
            this.randomNumber(0, 255) +
            ', ' +
            this.randomNumber(0, 255) +
            ', ' +
            this.randomNumber(0, 255) +
            ')'
          )
        }
        // random color hsl.
        static randomColorHSL(saturation, lightness) {
          return (
            'hsl(' +
            this.randomNumber(0, 360) +
            ', ' +
            saturation +
            '%, ' +
            lightness +
            '%)'
          )
        }
        // gradient color.
        static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
          const col = cr + ',' + cg + ',' + cb
          const g = ctx.createRadialGradient(x, y, 0, x, y, r)
          g.addColorStop(0, 'rgba(' + col + ', ' + ca * 1 + ')')
          g.addColorStop(0.5, 'rgba(' + col + ', ' + ca * 0.5 + ')')
          g.addColorStop(1, 'rgba(' + col + ', ' + ca * 0 + ')')
          return g
        }
      }

      /*
        When want to use angle.
      */

      class Angle {
        constructor(angle) {
          this.a = angle
          this.rad = (this.a * Math.PI) / 180
        }

        incDec(num) {
          this.a += num
          this.rad = (this.a * Math.PI) / 180
          return this.rad
        }
      }

      /*
        When want to use controller.
      */

      class Controller {
        constructor(id) {
          this.id = document.getElementById(id)
        }
        getVal() {
          return this.id.value
        }
      }

      /*
        When want to use time.
      */

      class Time {
        constructor(time) {
          this.startTime = time
          this.lastTime
          this.elapsedTime
        }

        getElapsedTime() {
          this.lastTime = Date.now()
          this.elapsedTime = (this.startTime - this.lastTime) * -1
          return this.elapsedTime
        }
      }

      /*
        When want to use vector.
      */

      class Vector2d {
        constructor(x, y) {
          this.vx = x
          this.vy = y
        }

        scale(scale) {
          this.vx *= scale
          this.vy *= scale
        }

        add(vec2) {
          this.vx += vec2.vx
          this.vy += vec2.vy
        }

        sub(vec2) {
          this.vx -= vec2.vx
          this.vy -= vec2.vy
        }

        negate() {
          this.vx = -this.vx
          this.vy = -this.vy
        }

        length() {
          return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        }

        lengthSquared() {
          return this.vx * this.vx + this.vy * this.vy
        }

        normalize() {
          const len = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
          if (len) {
            this.vx /= len
            this.vy /= len
          }
          return len
        }

        rotate(angle) {
          const vx = this.vx
          const vy = this.vy
          const cosVal = Math.cos(angle)
          const sinVal = Math.sin(angle)
          this.vx = vx * cosVal - vy * sinVal
          this.vy = vx * sinVal + vy * cosVal
        }

        toString() {
          return '(' + this.vx.toFixed(3) + ',' + this.vy.toFixed(3) + ')'
        }
      }

      let canvas = null

      class Canvas {
        constructor(bool) {
          // create canvas.
          this.canvas = document.createElement('canvas')
          // if on screen.
          if (bool === true) {
            this.canvas.style.display = 'block'
            this.canvas.style.position = 'absolute'
            this.canvas.style.zIndex = '1'
            this.canvas.style.top = 0
            this.canvas.style.left = 0
            document.getElementById('login').appendChild(this.canvas)
          }
          this.ctx = this.canvas.getContext('2d')
          this.width = this.canvas.width = window.innerWidth
          this.height = this.canvas.height = window.innerHeight
          // mouse infomation.
          this.mouseX = null
          this.mouseY = null
          this.mouseZ = null
          // line
          this.shapeNum = 101
          this.shapes = []
        }

        // init, render, resize
        init() {
          for (let i = 1; i < this.shapeNum; i++) {
            const s = new Shape(this.ctx, this.width / 2, this.height / 2, i)
            this.shapes.push(s)
          }
        }

        render() {
          this.ctx.clearRect(0, 0, this.width, this.height)
          for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].render()
          }
        }

        resize() {
          this.shapes = []
          this.width = this.canvas.width = window.innerWidth
          this.height = this.canvas.height = window.innerHeight
          this.init()
        }
      }

      class Shape {
        constructor(ctx, x, y, i) {
          this.ctx = ctx
          this.init(x, y, i)
        }

        init(x, y, i) {
          this.num = 36
          this.a = new Angle(i)
          this.rad = (Math.PI * 2) / this.num
          this.x = x
          this.y = y
          this.r = 3 * i
          this.lw = 1
          this.i = i
        }

        draw() {
          const ctx = this.ctx
          ctx.save()
          ctx.lineWidth = this.lw
          ctx.lineCap = 'round'
          ctx.strokeStyle =
            'hsl(' + Math.sin(this.a.rad / 5) * 360 + ', 80%, 60%)'
          // ctx.strokeStyle = 'white';
          ctx.translate(this.x, this.y)
          ctx.rotate(this.a.rad / 2)
          ctx.scale(Math.sin(this.a.rad / 8), Math.cos(this.a.rad / 4))
          ctx.translate(-this.x, -this.y)
          for (let i = 0; i < this.num; i++) {
            const x = Math.cos(this.rad * i) * this.r + this.x
            const y = Math.sin(this.rad * i) * this.r + this.y
            const nx = Math.cos(this.rad * (i + 1)) * this.r + this.x
            const ny = Math.sin(this.rad * (i + 1)) * this.r + this.y
            if (i % 2 === 0) {
              if (Math.sin(this.a.rad / 4) > 0) {
                ctx.translate(nx, ny)
                ctx.rotate(-this.a.rad)
                ctx.translate(-nx, -ny)
              }
            } else {
              if (Math.sin(this.a.rad / 4) > 0) {
                ctx.translate(nx, ny)
                ctx.rotate(this.a.rad)
                ctx.translate(-nx, -ny)
              }
            }
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(nx, ny)
            ctx.stroke()
          }
          ctx.restore()
        }

        render() {
          this.draw()
          this.a.incDec(3)
        }
      }

      canvas = new Canvas(true)
      canvas.init()

      function render() {
        window.requestAnimationFrame(function() {
          canvas.render()
          render()
        })
      }

      render()

      // event
      window.addEventListener(
        'resize',
        function() {
          canvas.resize()
        },
        false
      )
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    color: #454545;
  }
  .el-button--primary{
    font-size: 18px;
    height: 60px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    color: white;
    &:hover{
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    z-index: 2;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo{
      width: 100px;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin-top: 10px;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

// 背景

@function randomNum($max, $min: 0, $u: 1) {
  @return ($min + random($max)) * $u;
}

@function shadowSet($n, $size) {
  $shadow: 0 0 0 0 #fff;

  @for $i from 0 through $n {
    $x: randomNum(1800);
    $y: randomNum(1000);
    $scale: randomNum($size) / 10;

    $shadow: $shadow, #{$x}px #{$y}px 0 #{$scale}px rgba(255, 255, 255, 0.8);
  }

  @return $shadow;
}

.g-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;
  background: #0b1a3a;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    box-shadow: shadowSet(1000, 6);
  }
}
</style>
