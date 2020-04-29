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
      <i-input v-model="email" placeholder="注册邮箱"
               style="width: 300px "/>
      <br>
      <i-input disabled v-model="check_mes" style="width: 200px "/>
      <i-input v-model="check_code" style="width: 100px "/>
      <br>
      <br>
      <i-button
        type="primary"
        @click.native="register">
        注册
      </i-button>
    </div>
  </div>
</template>


<script>

import { reqNoAuth } from '../apis/util';
import errPush from '../components/ErrPush';
import router from '../router';

export default {
  data() {
    return {
      userName: '',
      password: '',
      email: '',
      check_mes: '',
      check_code: '',
      add_a: '',
      add_b: '',
    };
  },
  mounted() {
    this.add_a = Math.round(Math.random() * 10);
    this.add_b = Math.round(Math.random() * 10);
    this.check_mes = `验证码：计算 ${this.add_a} + ${this.add_b} = `;
  },
  methods: {
    register() {
      if (!this.userName.trim() || !this.password.trim() || !this.email.trim()) {
        errPush(this, '5010');
      } else if (this.check_code.trim() !== `${this.add_a + this.add_b}`) {
        errPush(this, '0000', 'false', '无效验证码');
      } else {
        const tempData = {
          username: this.userName.trim(),
          password: this.password.trim(),
          email: this.email.trim(),
        };
        reqNoAuth('/api/users/', 'post', tempData)
          .then(() => {
            router.push('/');
          })
          .catch(res => this.handle_error(res))
        ;
      }
    },
    handle_error(response) {
      errPush(this, '0000', false, '网络错误', `${response.code}`);
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
