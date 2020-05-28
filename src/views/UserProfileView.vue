<template>
  <Layout>
    <Sider :style="{background: '#fff'}">
      <Menu theme="light">
        <MenuItem
          name="1"
          @click.native="openUserProfile">
          <Icon type="md-list-box" />
          档案管理
        </MenuItem>
        <MenuItem
          name="2"
          @click.native="openUserInterest">
          <Icon type="md-aperture" />
          兴趣管理
        </MenuItem>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-stats" />
            内容统计
          </template>
          <MenuItem
            name="3-1"
            @click.native="openArticleStatcs">
            文献统计
          </MenuItem>
          <MenuItem
            name="3-2"
            @click.native="openRoadmapStatcs">
            路书统计
          </MenuItem>
          <MenuItem
            name="3-3"
            @click.native="openEssayStatcs">
            随笔统计
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>
    <Content
      :style="{padding: '20px', minHeight: '280px', background: '#fff'}">
      <div v-if="content==='profile'"
           style="margin-left: 60px">
        <h1>个人档案</h1>
        <Divider />

        <Col span="14" style="margin-right: 30px">
          <h2>用户名</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">
                <div
                  v-if="!userLayout.nameEditable"
                  style="padding: 12px">
                  {{userData.name}}
                  <Icon type="ios-create-outline" @click="handleEditName" />
                </div>
                <Input
                  ref="nameInput"
                  v-model="userData.name"
                  v-if="userLayout.nameEditable"
                  @on-blur="handleUpdateName"
                  style="padding: 12px; margin-right: 50px"
                  @keydown.native.stop>
                </Input>
              </Row>
            </Col>
          </Row>

          <br>
          <h2>邮箱</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">

              </Row>
            </Col>
          </Row>
        </Col>

        <Col span="8" style="margin-left: 10px">
          <h2>头像</h2>
          <br>
        </Col>
      </div>
      <div v-else-if="content==='interest'"
           style="margin-left: 60px">
        userInterest
      </div>
      <div v-else-if="content==='artcSt'"
           style="margin-left: 60px">
        article
      </div>
      <div v-else-if="content==='roadmapSt'"
           style="margin-left: 60px">
        roadmap
      </div>
      <div v-else-if="content==='essaySt'"
           style="margin-left: 60px">
        essay
      </div>
    </Content>
  </Layout>
</template>

<script>
import _ from 'lodash';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
// import { changeUserData } from '../apis/UserProfileApis';

export default {
  name: 'UserProfileView',
  data() {
    return {
      content: 'profile',
      // profile, interest, artcSt, roadmapSt, essaySt
      userData: {
        id: '',
        name: '',
        email: '',
        interest: [],
        bio: '',
        city: '',
        organization: '',
      },
      userLayout: {
        nameEditable: false,
        emailEditable: false,
        bioEditable: false,
        cityEditable: false,
        organEditable: false,
      },
      articleTotal: 0,
      articles: [],
      roadmapTotal: 0,
      roadmaps: [],
      essayTotal: 0,
      essays: [],
    };
  },
  methods: {
    openUserProfile() {
      this.content = 'profile';
      this.getUserProfileData();
    },
    openUserInterest() {
      this.content = 'interest';
      this.getUserInterestData();
    },
    openArticleStatcs() {
      this.content = 'artcSt';
      this.getArticleData();
    },
    openRoadmapStatcs() {
      this.content = 'roadmapSt';
      this.getRoadmapData();
    },
    openEssayStatcs() {
      this.content = 'essaySt';
      this.getEssayData();
    },
    getUserProfileData() {
      reqSingle('api/users', 'GET').then((res) => {
        window.console.log('user data', res);
        this.userData.id = res.data.id;
        this.userData.userName = res.data.userName;
        this.userData.email = res.data.email;
        this.userData.interest = res.data.interest;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    getArticleData() {
      reqSingle('api/articles/', 'GET').then((res) => {
        // window.console.log('show article res:', res);
        this.articles = res.data;
        this.articleTotal = this.articles.length;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    getRoadmapData() {
      reqSingle('api/road_maps/', 'GET').then((res) => {
        // window.console.log('show road_maps res:', res);
        this.roadmaps = res.data;
        this.roadmapTotal = this.roadmaps.length;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    getEssayData() {
      reqSingle('api/essays/', 'GET').then((res) => {
        // window.console.log('show essay res:', res);
        this.essays = res.data;
        this.essayTotal = this.essays.length;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleEditName() {
      this.userLayout.nameEditable = true;
      this.$nextTick(() => this.$refs.nameInput.focus());
    },
    handleUpdateName() {

    },
  },
  mounted() {
    this.getUserProfileData();
  },
};
</script>

<style scoped>

</style>

