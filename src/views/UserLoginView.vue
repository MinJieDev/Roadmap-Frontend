<template>
  <div>
    <div class="outer_label">
      <img class="inner_label login_logo" src="../assets/logo.png" alt="No Image">
    </div>
    <div>
      <i-input v-model="userName" placeholder="用户名"
               style="margin-left: 10px; margin-bottom: 10px; width: 300px " />
      <i-input type="password" v-model="password" placeholder="密码"
               style="margin-left: 10px; margin-bottom: 10px; width: 300px "/>
      <i-button
        type="primary"
        @click.native="login">
        登陆
      </i-button>
    </div>
  </div>
</template>


<script>

import { reqNoAuth } from '../apis/util';
import errPush from '../components/ErrPush';

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
        errPush(this, '5010');
      } else {
        const tempData = {
          username: this.userName,
          password: this.password,
        };
        reqNoAuth('/login', 'post', tempData)
          .then(res => this.check_token(res))
          .catch(res => this.check_token(res))
        ;
      }
    },
    check_token(response) {
      if (response.token) {
        // eslint-disable-next-line no-console
        console.info(response.token);
      } else if (response.non_field_errors) {
        errPush(this, '5020');
      } else {
        errPush(this, '4000');
      }
    },
  },
};
</script>

<style scoped>
</style>
