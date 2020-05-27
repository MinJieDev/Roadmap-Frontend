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
      :style="{padding: '60px', minHeight: '280px', background: '#fff'}">
      <div v-if="content==='profile'">
        userProfile
      </div>
      <div v-else-if="content==='interest'">
        userInterest
      </div>
      <div v-else-if="content==='artcSt'">
        article
      </div>
      <div v-else-if="content==='roadmapSt'">
        roadmap
      </div>
      <div v-else-if="content==='essaySt'">
        essay
      </div>
    </Content>
  </Layout>
</template>

<script>
// import _ from 'lodash';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';

export default {
  name: 'UserProfileView',
  data() {
    return {
      content: 'profile',
      // profile, interest, artcSt, roadmapSt, essaySt
      userData: {
        userName: '',
        email: '',
        bio: '',
        city: '',
        organization: '',
      },
      interestData: {

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
      // reqSingle('api/users', 'GET').then((res) => {
      //   window.console.log('user data', res);
      //   // this.userData.userName =
      // }).catch((err) => {
      //   pushErr(this, err, true);
      // });
    },
    getUserInterestData() {
      // TODO: wait for BackEnd
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
  },
};
</script>

<style scoped>

</style>

