<template>
  <Layout>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <div  id="roadmap-title">
        {{roadMapTitle}}
      </div>
      <roadmap
        :nodes="nodes"
        :connections="mergedConnections"
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
import { req } from '../apis/util';
import Roadmap from '../components/roadmap/Roadmap';

Vue.prototype._ = _;

export default {
  name: 'RoadmapReader',
  components: {
    Roadmap,
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
      articles: [],
    };
  },
  async mounted() {
    this.roadMapId = this.$route.query.selected;
    try {
      this.articles = (await req('/api/articles/', 'GET')).data;
      const roadmapData = (await getRoadmap(this.roadMapId)).data;
      this.nodes = JSON.parse(roadmapData.text).nodes;
      this.connections = JSON.parse(roadmapData.text).connections;
      this.roadMapTitle = roadmapData.title;
      this.repaintMindMap();
      this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
    } catch (e) {
      errPush(this, '4000', true);
    }
  },
  computed: {
    /**
     * auto generated reference connections
     * @type {Array}
     */
    refConnections() {
      let conn = [];
      let articleNodes = _.filter(this.nodes, node => (node.category === 'article'));
      articleNodes = _.map(articleNodes, (node) => {
        const article = _.find(this.articles, atc => (atc.title === node.text));
        return { ...node, article };
      });
      _.forEach(articleNodes, (ni) => {
        _.forEach(articleNodes, (nj) => {
          if (_.includes(ni.article.article_references, nj.article.id)) {
            conn = _.concat(conn, {
              source: nj.text,
              target: ni.text,
              type: 'ref',
            });
          }
        });
      });
      return conn;
    },

    /**
     * simple connections and reference connections
     * @returns {*[]}
     */
    mergedConnections() {
      return [...this.connections, ...this.refConnections];
    },
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
