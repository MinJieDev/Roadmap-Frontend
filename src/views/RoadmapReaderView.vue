<template>
  <Layout>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <div  id="roadmap-title">
        {{roadMapTitle}}
      </div>
      <Collapse value="1">
        <Panel name="1">
          Description
          <p slot="content">{{description}}</p>
        </Panel>
      </Collapse>
      <roadmap
        :nodes="nodes"
        :connections="mergedConnections"
        :editable="true"
        :key="repaint"
      />
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}" v-if="sharedId===-1">
      <Button type="success" @click="handleClkEdit" id="b-ed">Edit</Button>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import { pushErr } from '../components/ErrPush';
import { getRoadmap, getRoadmapShareLink } from '../apis/RoadmapEditorApis';
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
      sharedId: -1,
      roadMapTitle: 'roadMapTitleDefalt',
      repaint: 1,
      description: '',
      nodes: [
      ],
      connections: [
      ],
      articles: [],
    };
  },
  async mounted() {
    // share
    if (!this.$route.query.selected) {
      this.sharedId = this.$route.query.sharedId;
      try {
        this.articles = (await req('/api/articles/', 'GET')).data;
        const roadmapData = (await getRoadmapShareLink(this.sharedId)).data;
        this.nodes = this.toDisplayNodes(JSON.parse(roadmapData.text).nodes);
        this.connections = this.toDisplayConnections(JSON.parse(roadmapData.text).connections);
        this.roadMapTitle = roadmapData.title;
        this.description = roadmapData.description;
        this.repaintMindMap();
        this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
      } catch (err) {
        pushErr(this, err, true);
      }
    } else {
      this.roadMapId = this.$route.query.selected;
      try {
        this.articles = (await req('/api/articles/', 'GET')).data;
        const roadmapData = (await getRoadmap(this.roadMapId)).data;
        this.nodes = this.toDisplayNodes(JSON.parse(roadmapData.text).nodes);
        this.connections = this.toDisplayConnections(JSON.parse(roadmapData.text).connections);
        this.roadMapTitle = roadmapData.title;
        this.description = roadmapData.description;
        this.repaintMindMap();
        this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
      } catch (err) {
        pushErr(this, err, true);
      }
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
              source: ni.text,
              target: nj.text,
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
    getArticleById(id) {
      return _(this.articles).find(art => String(art.id) === String(id));
    },
    toDisplayNodes(savedNodes) {
      let ret = [];
      _(savedNodes).forEach((node) => {
        if (node.category === 'article') {
          const art = this.getArticleById(_.split(node.text, '$', 2)[1]);
          if (typeof art !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            node.text = art.title;
          } else {
            // eslint-disable-next-line no-param-reassign
            node.category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            node.text += ': article not found';
          }
        }
        ret = [...ret, node];
      });
      return ret;
    },
    toDisplayConnections(savedConnections) {
      let ret = [];
      _(savedConnections).forEach((conn) => {
        if (conn.source_category === 'article') {
          const art = this.getArticleById(_.split(conn.source, '$', 2)[1]);
          if (typeof art !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            conn.source = art.title;
          } else {
            // eslint-disable-next-line no-param-reassign
            conn.source_category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            conn.source += ': article not found';
          }
        }
        if (conn.target_category === 'article') {
          const art = this.getArticleById(_.split(conn.target, '$', 2)[1]);
          if (typeof art !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            conn.target = art.title;
          } else {
            // eslint-disable-next-line no-param-reassign
            conn.target_category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            conn.target += ': article not found';
          }
        }
        ret = [...ret, conn];
      });
      return ret;
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
