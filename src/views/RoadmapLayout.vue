<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <img
              src="../assets/HomePageLogo.png"
              alt="MinJieDev · 知识路书"
              width=120px
              style="cursor:pointer"
              @click="goToWelcome">
          </div>
          <div class="layout-nav">
            <MenuItem name="1" :to="{name: 'ArticleTable'}">
              <Icon type="ios-book-outline"></Icon>
              文献管理
            </MenuItem>
            <MenuItem name="2" :to="{name: 'RoadmapTable'}">
              <Icon type="md-map"></Icon>
              路书管理
            </MenuItem>
                <div v-if="isLoginStatus() !== true">
                  <MenuItem
                    name="3"
                    @click.native="goToLogin()">
                    <Icon type="md-person"></Icon>
                    登录
                  </MenuItem>
                </div>
                <div v-if="isLoginStatus() === true">
                  <MenuItem
                    name="3"
                    @click.native="logOut()">
                    <Icon type="md-person"></Icon>
                    退出账号
                  </MenuItem>
                </div>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 50px'}">
        <Breadcrumb :style="{margin: '16px 0px'}">
          <BreadcrumbItem
            :to="item.fullPath"
            v-for="(item, index) in getRouterStack()"
            :key="index">
            {{ item.nickName }}
          </BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px 0', minHeight: '500px', background: '#fff'}">
          <!-- add below the drawing board -->
          <slot></slot>
        </Content>
      </Layout>
      <Footer class="layout-footer-center"> &copy; MinJieDev · 知识路书 <br>
        <Icon type="logo-github" />
        <a  href="https://github.com/MinJieDev/Roadmap-Frontend"> Star Us</a> </Footer>
      <div class="report">
        <UserReportButton>
        </UserReportButton>
      </div>
    </Layout>
  </div>
</template>
<script>

import UserReportButton from '../components/UserReportButton';
import router from '../router';
import { isLogin, logout } from '../apis/User';
import pushRouter from '../components/Breadcrumb';

export default {
  name: 'RoadmapLayout',
  components: { UserReportButton },
  data() {
    return {
      title: 'learn anything - programming - programming languages - python',
    };
  },
  computed: {
    path() {
      return function f(index) {
        return this.$route.meta.path[index];
      };
    },
  },
  methods: {
    getRouterStack() {
      pushRouter(
        this.$router.history.current.name,
        this.$router.history.current.meta.nickName,
        this.$router.history.current.fullPath,
        this.$router.history.current.meta.level);
      return window.routerStack;
    },
    goToLogin() {
      if (this.$route.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    },
    goToWelcome() {
      if (this.$route.name !== 'Welcome') {
        router.push({ name: 'Welcome' });
      }
    },
    isLoginStatus() {
      return isLogin();
    },
    logOut() {
      logout();
      this.goToLogin();
    },
  },
  created() {

  },
};
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    width: 50px;
    height: 30px;
    background: #515a6e;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 10px;
    left: 0px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .layout-footer-center {
    text-align: center;
  }

  .report{
    position:fixed;
    bottom: 80px;
    right: 20px;
  }
</style>
