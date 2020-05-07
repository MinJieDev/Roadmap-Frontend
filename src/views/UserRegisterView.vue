<template>
  <div>
    <div id="logo-view">
      <img class="inner_label login_logo" src="../assets/LoginLogo.png" alt="No Image">
    </div>
    <div id="login-view">
      <i-input v-model="userName" placeholder="注册用户名"
               style="width: 300px " />
      <br>
      <i-input type="password" v-model="password" placeholder="注册密码"
               style="width: 300px "/>
      <br>
      <i-input type="password" v-model="password_twice" placeholder="再次输入注册密码"
               style="width: 300px "/>
      <br>
      <i-input v-model="email" placeholder="注册邮箱"
               style="width: 300px "/>
      <br>
      <i-input disabled v-model="check_mes" style="width: 200px "/>
      <i-input v-model="check_code" style="width: 100px "/>
      <br>
      <br>
      <i-button
        type="warning"
        @click.native="forget_password">
        忘记密码
      </i-button>
      <i-button
        type="primary"
        @click.native="register">
        提交注册
      </i-button>
      <i-button
        type="success"
        @click.native="jump_login">
        返回登陆
      </i-button>
    </div>
  </div>
</template>


<script>

import { reqNoAuth } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import router from '../router';

export default {
  data() {
    return {
      userName: '',
      password: '',
      password_twice: '',
      email: '',
      check_mes: '',
      check_code: '',
      add_a: '',
      add_b: '',
    };
  },
  mounted() {
    this.add_a = Math.round(Math.random() * 100);
    this.add_b = Math.round(Math.random() * 100);
    this.check_mes = `验证码：计算 ${this.add_a} + ${this.add_b} = `;
  },
  methods: {
    jump_login() {
      router.push('/');
    },
    register() {
      // eslint-disable-next-line max-len
      if (!this.userName.trim() || !this.password.trim() || !this.email.trim() || !this.password_twice.trim()) {
        pushErr(this, '5010');
      } else if (this.check_code.trim() !== `${this.add_a + this.add_b}`) {
        pushErr(this, '0000', true, '无效验证码');
      } else {
        // 双重密码输入验证
        if (this.password !== this.password_twice) {
          pushErr(this, '0000', true, '密码输入不一致');
          return;
        }
        const tempData = {
          username: this.userName.trim(),
          password: this.password.trim(),
          email: this.email.trim(),
        };
        reqNoAuth('/api/users/', 'post', tempData)
          .then(() => {
            this.$Notice.success({
              title: '注册成功',
            });
            router.push('/');
          })
          .catch((err) => {
            pushErr(this, err, true);
          })
        ;
      }
    },
    handle_error(response) {
      pushErr(this, '0000', false, '网络错误', `${response.code}`);
    },
    forget_password() {
      this.$Modal.info({
        title: '忘记密码',
        content: '请联系hdl730@163.com',
      });
    },
  },
};
</script>

<style scoped>
  #logo-view{
    text-align:center;
    font-size: 24px;
    padding: 12px;
  }
  #login-view{
    text-align:center;
    font-size: 24px;
    padding: 12px;
  }
</style>
