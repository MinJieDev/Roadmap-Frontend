<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
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
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 50px'}">
        <Breadcrumb :style="{margin: '16px 0px'}">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Layout</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px 0', minHeight: '500px', background: '#fff'}">
          <!-- add below the drawing board -->
          <slot></slot>
        </Content>
      </Layout>
      <Footer class="layout-footer-center"> &copy; footer</Footer>
    </Layout>
  </div>
</template>
<script>

export default {
  name: 'RoadmapLayout',
  data() {
    return {
      title: 'learn anything - programming - programming languages - python',
    };
  },
  computed: {},
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
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .layout-footer-center {
    text-align: center;
  }
</style>
