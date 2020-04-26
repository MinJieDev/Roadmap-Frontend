<template>
  <div>
    <div class="outer_label">
      <img class="inner_label login_logo" src="../assets/logo.png" alt="No Image">
    </div>
    <div class="login_form">
      <i-input :value.sync="userName" placeholder="用户名"
               style="margin-left: 10px; margin-bottom: 10px; width: 300px " />
      <i-input type="password" :value.sync="password" placeholder="密码"
               style="margin-left: 10px; margin-bottom: 10px; width: 300px "/>
      <!--button
        class="login_btn el-button el-button&#45;&#45;primary is-round"
        type="primary" round>
        登录
      </--button> -->
      <i-button
        type="primary"
        @click.native="login">
        登陆
      </i-button>
    </div>
  </div>
</template>


<script>

// import { req } from '../apis/util';
import errPush from '../components/ErrPush';

export default {
  data() {
    return {
      userName: '',
      password: '',
      isBtnLoading: false,
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).userName) {
      this.userName = JSON.parse(localStorage.getItem('user')).userName;
      this.password = JSON.parse(localStorage.getItem('user')).password;
    }
  },
  computed: {
    btnText() {
      if (this.isBtnLoading) return '登录中...';
      return '登录';
    },
  },
  methods: {
    login() {
      if (!this.userName || !this.password) {
        errPush(this, '5010');
      }
    },
  },
};
</script>

<style scoped>
</style>
