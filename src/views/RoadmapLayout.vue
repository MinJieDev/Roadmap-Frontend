<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <img src="../assets/HomePageLogo.png" alt="MinJieDev · 知识路书" width=120px>
          </div>
          <div class="layout-nav">
            <MenuItem name="1" :to="{name: 'Home'}">
              <Icon type="ios-navigate"></Icon>
              文献管理
            </MenuItem>
            <MenuItem name="2" :to="{name: 'Editor'}">
              <Icon type="ios-keypad"></Icon>
              路书编辑器
            </MenuItem>
            <MenuItem name="3" :to="{name: 'RoadmapTable'}">
              <Icon type="ios-analytics"></Icon>
              路书管理
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 50px'}">
        <Breadcrumb :style="{margin: '16px 0px'}">
          <BreadcrumbItem>HomePage</BreadcrumbItem>
          <BreadcrumbItem
            :to="path(index)"
            v-for="(item, index) in $route.meta.name"
            :key="index">
            {{ item }}
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
  methods: {},
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
