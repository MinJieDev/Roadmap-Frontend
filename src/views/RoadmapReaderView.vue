<template>
  <Layout>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <div  id="roadmap-title">
        {{roadMapTitle}}
      </div>
      <mindmap
        :nodes="nodes"
        :connections="connections"
        :editable="true"
        :key="repaint"
      />
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Button type="success" @click="handleClkEdit" id="b-ed">Edit</Button>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import errPush from '../components/ErrPush';
import { getRoadmap } from '../apis/RoadmapEditorApis';

Vue.prototype._ = _;

export default {
  name: 'RoadmapEditor',
  components: {
  },
  data() {
    return {
      roadMapId: -1,
      roadMapTitle: 'roadMapTitleDefalt',
      repaint: 1,
      nodes: [
      ],
      connections: [
      ],
    };
  },
  computed: {
  },
  mounted() {
    this.roadMapId = this.$route.query.selected;
    getRoadmap(this.roadMapId).then((res) => {
      this.nodes = JSON.parse(res.data.text).nodes;
      this.connections = JSON.parse(res.data.text).connections;
      this.roadMapTitle = res.data.title;
      this.repaintMindMap();
      this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
    }).catch(() => {
      errPush(this, '4000', true);
    });
  },
  methods: {
    handleClkEdit() {
      this.$router.push({
        path: '/editor',
        query: { selected: this.roadMapId },
      });
    },
    repaintMindMap() {
      this.repaint += 1;
    },
  },
};
</script>

<style scoped>
  #roadmap-title{
    text-align:center;
    font-size: 24px;
    padding: 12px;
  }
  #b-ed{
    width: 120px;
    margin-bottom: 20px;
    margin-left: 40px;
    margin-right: 40px;
  }
</style>
