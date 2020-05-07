<template>
  <div>
    <div id="logo-view">
      <img class="inner_label login_logo" src="../assets/LoginLogo.png" alt="No Image">
    </div>
    <div id="login-view">
      <i-input v-model="userName" placeholder="用户名"
               style="width: 300px "/>
      <i-input type="password" v-model="password" placeholder="密码"
               style="width: 300px "/>
      <br>
      <br>
      <i-button
        type="primary"
        @click.native="login">
        登录
      </i-button>
      <i-button
        type="success"
        @click.native="handle_register">
        注册
      </i-button>
    </div>
  </div>
</template>


<script>

import { reqNoAuth } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import store from '../vuex/index';
import router from '../router';

export default {
  data() {
    return {
      userName: '',
      password: '',
    };
  },
  computed: {},
  methods: {
    login() {
      if (!this.userName || !this.password) {
        pushErr(this, '5010');
      } else {
        const tempData = {
          username: this.userName,
          password: this.password,
        };
        reqNoAuth('/api/login/', 'post', tempData)
          .then(res => this.save_token(res))
          .catch((err) => {
            pushErr(this, err, true, '登陆失败', '用户名密码错误');
          })
        ;
      }
    },
    save_token(response) {
      window.console.info(response.data.token);
      store.commit('pushAuthToken', response.data.token);
      router.push({ name: 'Welcome' });
    },
    handle_register() {
      router.push('/user_register');
    },
    handle_error(response) {
      if (response.code === 400) {
        pushErr(this, '5020');
      } else {
        pushErr(this, response, true);
        // pushErr(this, '0000', false, '网络错误', `${response.code}`);
      }
    },
  },
};
</script>

<style scoped>
  #logo-view {
    text-align: center;
    font-size: 24px;
    padding: 12px;
  }

  #login-view {
    text-align: center;
    font-size: 24px;
    padding: 12px;
  }
</style>
