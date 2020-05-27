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
      <div v-if="this.content==='profile'">
        userProfile
      </div>
      <div v-else-if="this.content==='interest'">
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
export default {
  name: 'UserProfileView',
  data() {
    return {
      content: 'profile',
      // profile, interest, artcSt, roadmapSt, essaySt
      userData: {

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
    },
    openUserInterest() {
      this.content = 'interest';
    },
    openArticleStatcs() {
      this.content = 'artcSt';
    },
    openRoadmapStatcs() {
      this.content = 'roadmapSt';
    },
    openEssayStatcs() {
      this.content = 'essaySt';
    },
  },
};
</script>

<style scoped>

</style>

