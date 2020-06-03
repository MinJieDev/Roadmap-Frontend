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
                style="font-size: 16px; margin-left: 11px; margin-top: 9px"
                @on-close="deleteInterestItem(item)">
                {{item}}
              </Tag>
            </div>
            <div v-else
              id="interestNotice">
              还没有兴趣呢~<br>请添加您的兴趣领域
            </div>
          </Col>
        </Row>
        <br>
        <br>
        <h2>添加兴趣</h2>
        <br>
        <row>
          <Transfer style="margin-left: 50px;"
            :data="transfer.transData"
            :target-keys="transfer.targetKeys"
            :list-style="transfer.tranStyle"
            :titles="transfer.transTitle"
            @on-change="handleTransChange">
          </Transfer>
        </row>
      </div>
      <div v-else-if="content==='artcSt'"
           style="margin-left: 60px">
        <h1>文献统计</h1>
        <Divider />
        <br>
        <ArticleStatistics></ArticleStatistics>
      </div>
      <div v-else-if="content==='roadmapSt'"
           style="margin-left: 60px">
        功能正在开发
      </div>
      <div v-else-if="content==='essaySt'"
           style="margin-left: 60px">
        功能正在开发
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
import ArticleStatistics from '../components/ArticleStatistics';

export default {
  name: 'UserProfileView',
  components: { ArticleStatistics },
  data() {
    return {
      content: 'profile',
      // profile, interest, artcSt, roadmapSt, essaySt
      userData: {
        id: '',
        name: '',
        email: '',
        interestDB: [],
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
      interestReveal: true,
      fieldList: [
        {
          value: 'Artificial Intelligence 人工智能',
          label: 'cs.AI',
        },
        {
          value: 'Computational Geometry 计算几何学',
          label: 'cs.CG',
        },
        {
          value: 'Computation and Language 计算语言学',
          label: 'cs.CL',
        },
        {
          value: 'Computer Vision 计算视觉与模式识别',
          label: 'cs.CV',
        },
        {
          value: 'Databases 数据库',
          label: 'cs.DB',
        },
        {
          value: 'Multimedia 多媒体',
          label: 'cs.MM',
        },
        {
          value: 'Neural and Evolutionary Computing 神经与进化计算',
          label: 'cs.NE',
        },
        {
          value: 'Robotics 机器人',
          label: 'cs.RO',
        },
      ],
      transfer: {
        tranStyle: {
          width: '250px',
          height: '300px',
        },
        transTitle: ['兴趣领域', '我的兴趣'],
        transData: [],
        targetKeys: [],
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
      this.getUserInterest();
      // window.console.log('interest length', this.userData.interest.length,
      //   'interest', this.userData.interest);
    },
    openArticleStatcs() {
      this.content = 'artcSt';
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
        this.userData.id = res.data[0].id;
        this.userData.name = res.data[0].username;
        this.userData.email = res.data[0].email;
        this.userData.city = res.data[0].city;
        this.userData.bio = res.data[0].bio;
        this.userData.organization = res.data[0].organization;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    getUserInterest() {
      reqSingle('api/users', 'GET').then((res) => {
        this.userData.interestDB = _.split(res.data[0].interest, ',');
        this.userData.interest = [];
        this.interestReveal = (this.userData.interestDB.length > 0
          && res.data[0].interest !== '');
        // transfer interest DB form to interest Web form
        _.forEach(this.userData.interestDB, (item) => {
          _.forEach(this.fieldList, (field) => {
            if (item === field.label) {
              this.userData.interest = _.concat(this.userData.interest, field.value);
            }
          });
        });
        this.transfer.targetKeys = _.clone(this.userData.interestDB);
        // window.console.log('interest DB', this.userData.interestDB,
        // '\ninterest', this.userData.interest);
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
      this.userData.interest = _.pull(this.userData.interest, item);
      _.forEach(this.fieldList, (field) => {
        if (item === field.value) {
          this.userData.interestDB = _.pull(this.userData.interestDB, field.label);
        }
      });
      const interestStr = _.toString(this.userData.interestDB);
      // window.console.log('interestDB array', this.userData.interestDB,
      //   '\ninterest str', interestStr);
      updateInterest(this.userData.id, interestStr).then(() => {
        this.$Notice.success({ title: 'interest updated' });
        this.getUserInterest();
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleTransChange(newTargetKeys) {
      this.transfer.targetKeys = newTargetKeys;
      const interestStr = _.toString(newTargetKeys);
      // window.console.log('interestDB array', this.userData.interestDB,
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
    _.forEach(this.fieldList, (item) => {
      this.transfer.transData = _.concat(this.transfer.transData,
        {
          key: item.label,
          label: item.value,
          disable: false,
        });
    });
    // window.console.log('transData', this.transfer.transData);
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
    font-size: large;
    /*font-size: 16.5px;*/
    font-family: "PingFang SC";
    line-height: 1.8;
  }
</style>

