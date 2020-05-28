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

        <Col span="11" style="margin-right: 60px">
          <h2>用户名</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">
                <div
                  v-if="!userLayout.nameEditable"
                  id="nameField"
                  style="padding: 12px">
                  {{userData.name}}
                  <Icon type="ios-create-outline" @click="handleEditName" />
                </div>
                <Input
                  ref="nameInput"
                  v-model="userData.name"
                  v-if="userLayout.nameEditable"
                  @on-blur="handleUpdateName"
                  style="padding: 12px;"
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
                <div
                  v-if="!userLayout.emailEditable"
                  id="emailField"
                  style="padding: 12px">
                  {{userData.email}}
                  <Icon type="ios-create-outline" @click="handleEditEmail" />
                </div>
                <Input
                  ref="emailInput"
                  v-model="userData.email"
                  v-if="userLayout.emailEditable"
                  @on-blur="handleUpdateEmail"
                  style="padding: 12px; margin-right: 40px"
                  @keydown.native.stop>
                </Input>
              </Row>
            </Col>
          </Row>

          <br>
          <h2>城市</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">
                <div
                  v-if="!userLayout.cityEditable"
                  id="cityField"
                  style="padding: 12px">
                  {{userData.city}}
                  <Icon type="ios-create-outline" @click="handleEditCity" />
                </div>
                <Input
                  ref="cityInput"
                  v-model="userData.city"
                  v-if="userLayout.cityEditable"
                  @on-blur="handleUpdateCity"
                  style="padding: 12px; margin-right: 40px"
                  @keydown.native.stop>
                </Input>
              </Row>
            </Col>
          </Row>

          <br>
          <h2>机构</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">
                <div
                  v-if="!userLayout.organEditable"
                  id="organField"
                  style="padding: 12px">
                  {{userData.organization}}
                  <Icon type="ios-create-outline" @click="handleEditOrgan" />
                </div>
                <Input
                  ref="organInput"
                  v-model="userData.organization"
                  v-if="userLayout.organEditable"
                  @on-blur="handleUpdateOrgan"
                  style="padding: 12px; margin-right: 40px"
                  @keydown.native.stop>
                </Input>
              </Row>
            </Col>
          </Row>

          <br>
          <h2>个性签名</h2>
          <br>
          <Row :gutter="32">
            <Col span="24">
              <Row :gutter="50" style="margin-left: 0px">
                <div
                  v-if="!userLayout.bioEditable"
                  id="bioField"
                  style="padding: 12px">
                  {{userData.bio}}
                  <Icon type="ios-create-outline" @click="handleEditBio" />
                </div>
                <Input
                  ref="bioInput"
                  v-model="userData.bio"
                  v-if="userLayout.bioEditable"
                  type="textarea"
                  @on-blur="handleUpdateBio"
                  style="padding: 12px; margin-right: 40px"
                  @keydown.native.stop>
                </Input>
              </Row>
            </Col>
          </Row>

        </Col>

        <Col span="8" style="margin-left: 10px">
          <h2>头像</h2>
          <br>
          <div class="demo-avatar" style="margin-left: 40px">
            <Avatar icon="md-person" :size="200"
                    shape="square"
                    style="background-color: #5cadff"/>
          </div>
        </Col>
      </div>
      <div v-else-if="content==='interest'"
           style="margin-left: 60px">
        <h1>兴趣管理</h1>
        <Divider />

        <br>
        <h2>兴趣领域</h2>
        <br>
        <Row :gutter="32">
          <Col style="margin-left: 35px">
            <div v-if="interestReveal">
              <Tag v-if="interestReveal"
                v-for="(item) in userData.interest" :key="item"
                type="border" closable color="primary" size="large"
                @on-close="deleteInterestItem(item)">
                {{item}}
              </Tag>
            </div>
            <div v-else id="interestNotice">
              还没有兴趣呢~请添加您的兴趣领域
            </div>
          </Col>
        </Row>
        <br>
        <br>
        <h2>添加兴趣</h2>
        <br>
        <row>

        </row>
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
import { updateUserName, updateUserEmail, updateInterest, updateUserCity,
  updateUserBio, updateUserOrgan } from '../apis/UserProfileApis';

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
        bio: 'Coding everyday',
        city: 'Beijing',
        organization: 'BUAA',
      },
      userLayout: {
        nameEditable: false,
        emailEditable: false,
        bioEditable: false,
        cityEditable: false,
        organEditable: false,
      },
      interestReveal: true,
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
      this.getUserInterest();
      window.console.log('interest length', this.userData.interest.length,
        'interest', this.userData.interest);
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
        // window.console.log('user data', res);
        this.userData.id = _.clone(res.data[0].id);
        this.userData.name = _.clone(res.data[0].username);
        this.userData.email = _.clone(res.data[0].email);
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    getUserInterest() {
      reqSingle('api/users', 'GET').then((res) => {
        this.userData.interest = _.split(res.data[0].interest, ',');
        window.console.log('interest', this.userData.interest, 'interest res', res.data[0].interest);
        this.interestReveal = (this.userData.interest.length > 0 && res.data[0].interest !== '');
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
      this.userLayout.nameEditable = false;
      updateUserName(this.userData.id, this.userData.name).then(() => {
        this.$Notice.success({ title: 'username updated' });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleEditEmail() {
      this.userLayout.emailEditable = true;
      this.$nextTick(() => this.$refs.emailInput.focus());
    },
    handleUpdateEmail() {
      this.userLayout.emailEditable = false;
      updateUserEmail(this.userData.id, this.userData.email).then(() => {
        this.$Notice.success({ title: 'email updated' });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleEditCity() {
      this.userLayout.cityEditable = true;
      this.$nextTick(() => this.$refs.cityInput.focus());
    },
    handleUpdateCity() {
      this.userLayout.cityEditable = false;
      updateUserCity(this.userData.id, this.userData.city).then(() => {
        this.$Notice.success({ title: 'city updated' });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleEditOrgan() {
      this.userLayout.organEditable = true;
      this.$nextTick(() => this.$refs.organInput.focus());
    },
    handleUpdateOrgan() {
      this.userLayout.organEditable = false;
      updateUserOrgan(this.userData.id, this.userData.organization).then(() => {
        this.$Notice.success({ title: 'organization updated' });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleEditBio() {
      this.userLayout.bioEditable = true;
      this.$nextTick(() => this.$refs.bioInput.focus());
    },
    handleUpdateBio() {
      this.userLayout.bioEditable = false;
      updateUserBio(this.userData.id, this.userData.bio).then(() => {
        this.$Notice.success({ title: 'bio updated' });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    deleteInterestItem(item) {
      // TODO: test: delete to zero
      // this.userData.interest = _.slice(this.userData.interest, index, index + 1);
      this.userData.interest = _.pull(this.userData.interest, item);
      const interestStr = _.toString(this.userData.interest);
      // window.console.log('interest array', this.userData.interest,
      //   '\ninterest str', interestStr);
      updateInterest(this.userData.id, interestStr).then(() => {
        this.$Notice.success({ title: 'interest updated' });
        this.getUserInterest();
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
  },
  mounted() {
    this.getUserProfileData();
  },
};
</script>

<style scoped>
  #nameField{
    text-align:left;
    font-size: 19px;
  }
  #emailField{
    text-align:left;
    font-size: 19px;
  }
  #cityField{
    text-align: left;
    font-size: 19px;
  }
  #organField{
    text-align: left;
    font-size: 19px;
  }
  #bioField{
    text-align: left;
    font-size: 18px;
  }
  #interestNotice{
    text-align: left;
    font-size: 16.5px;
  }
</style>

