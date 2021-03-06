<template>
  <Layout>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <roadmap
        :nodes="nodes"
        :connections="mergedConnections"
        :editable="true"
        :key="repaint"
        @node-click="handleNodeClick"
        @node-dblclick="handleNodeDblClick"
        @subnode-dblclick="handleSubnodeDblClick"
        @svg-click="handleSvgClick"
        @conn-click="handleConnClick"
      />
    </Content>
    <NoteMarkdown :note="curNote" ref="notemdReader"
                  @article-note-edit="jumpArticleNoteEdit"></NoteMarkdown>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import { pushErr } from '../components/ErrPush';
import { getRoadmap, getRoadmapShareLink, postRoadmapShareLink } from '../apis/RoadmapEditorApis';
import { reqSingle } from '../apis/util';
import Roadmap from '../components/roadmap/Roadmap';
import NoteMarkdown from '../components/NoteMarkdown';

Vue.prototype._ = _;

export default {
  name: 'RoadmapReader',
  props: ['roadMapId', 'sharedId'],
  components: {
    Roadmap,
    NoteMarkdown,
  },
  data() {
    return {
      text: null,
      roadMapTitle: 'roadMapTitleDefalt',
      repaint: 1,
      description: '',
      nodes: [
      ],
      connections: [
      ],
      articles: [],
      essays: [],
      curNode: null,
      refCurves: [
      ],
      comments: [],
    };
  },
  async mounted() {
    // share
    if (String(this.sharedId) !== '-1') {
      try {
        const roadmapData = (await getRoadmapShareLink(this.sharedId)).data;
        this.articles = roadmapData.articles_used;
        this.essays = roadmapData.essays_used;
        this.nodes = this.toDisplayNodes(JSON.parse(roadmapData.text).nodes);
        this.connections = this.toDisplayConnections(JSON.parse(roadmapData.text).connections);
        this.refCurves = JSON.parse(roadmapData.text).refConnections;
        this.roadMapTitle = roadmapData.title;
        this.description = roadmapData.description;
        this.repaintMindMap();
        this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
      } catch (err) {
        pushErr(this, err, true);
      }
    } else {
      try {
        this.articles = (await reqSingle('/api/articles/', 'GET')).data;
        this.essays = (await reqSingle('/api/essays/', 'GET')).data;
        const roadmapData = (await getRoadmap(this.roadMapId)).data;
        this.text = JSON.parse(roadmapData.text);
        this.nodes = this.toDisplayNodes(JSON.parse(roadmapData.text).nodes);
        this.connections = this.toDisplayConnections(JSON.parse(roadmapData.text).connections);
        this.refCurves = JSON.parse(roadmapData.text).refConnections;
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
        const article = _.find(this.articles, atc => (atc.title === node.content));
        return { ...node, article };
      });
      _.forEach(articleNodes, (ni) => {
        _.forEach(articleNodes, (nj) => {
          if (_.includes(ni.article.article_references, nj.article.id)) {
            let curve = { x: 0, y: 0 };
            const tempConn = _.find(this.refCurves, nk =>
              (nk.curve && (ni.text === nk.source) && (nj.text === nk.target)));
            if (tempConn) {
              curve = tempConn.curve;
            }
            conn = _.concat(conn, {
              source: ni.text,
              target: nj.text,
              curve,
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
    openable() {
      window.console.log('open', this.curNode);
      if (this.curNode && this.curNode.URI) {
        window.console.log('open url', this.curNode.URI);
        return true;
      }
      return false;
    },
    curNodeType() {
      if (this.curNode) {
        return this.curNode.category;
      }
      return null;
    },
    curNote() {
      if (!this.curNode || this.curNode.category !== 'article') return '';
      if (this.getArticleByTitle(this.curNode.content).note) {
        return this.getArticleByTitle(this.curNode.content).note;
      }
      return '';
    },
    hasBindEssay() {
      return this.text && this.text.bindEssay && this.text.bindEssay !== -1;
    },
  },
  methods: {
    handleClkEdit() {
      this.$router.push({
        path: '/editor',
        query: { selected: this.roadMapId },
      });
    },
    handleClkShare() {
      postRoadmapShareLink(this.roadMapId).then((res) => {
        this.$Modal.success({
          title: '路书分享链接',
          content: `http://47.94.141.56/reader?sharedId=${res.data.share_id}/`,
          width: '700',
        });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    repaintMindMap() {
      this.repaint += 1;
    },
    getArticleById(id) {
      return _(this.articles).find(art => String(art.id) === String(id));
    },
    getEssayById(id) {
      return _(this.essays).find(ess => String(ess.id) === String(id));
    },
    toDisplayNodes(savedNodes) {
      let ret = [];
      _(savedNodes).forEach((node) => {
        if (node.category === 'article') {
          const articleId = _.split(node.content, '$', 2)[1];
          const art = this.getArticleById(articleId);
          if (typeof art !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            node.content = art.title;
            // eslint-disable-next-line no-param-reassign
            node.URI = art.url;
            // eslint-disable-next-line no-param-reassign
            node.category_id = articleId;
          } else {
            // eslint-disable-next-line no-param-reassign
            node.category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            node.content += ': article not found';
          }
        } else if (node.category === 'essay') {
          const essayId = _.split(node.content, '$', 2)[1];
          const ess = this.getEssayById(essayId);
          if (typeof ess !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            node.content = ess.title;
            // eslint-disable-next-line no-param-reassign
            node.URI = '';
            // eslint-disable-next-line no-param-reassign
            node.category_id = essayId;
          } else {
            // eslint-disable-next-line no-param-reassign
            node.category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            node.content += ': essay not found';
          }
        }
        ret = [...ret, node];
      });
      return ret;
    },
    toDisplayConnections(savedConnections) {
      return savedConnections;
    },
    getArticleByTitle(title) {
      return _(this.articles).find(art => art.title === title);
    },
    handleNodeClick(node) {
      window.console.log('reader clk', node);
      this.curNode = node;
    },
    handleNodeDblClick(node) {
      this.curNode = node;
      window.console.log('dbclick', node);
      window.console.log('url', node.URI);
      if (node.URI) {
        if (!_(node.URI).startsWith('http')) {
          window.open(`http://${node.URI}`, '_blank');
        } else {
          window.open(node.URI, '_blank');
        }
      } else if (node.category === 'essay') {
        this.handleOpenEssay();
      } else {
        window.console.log('pass');
      }
    },
    handleOpenEssay() {
      this.$router.push({
        path: '/essayReader',
        query: { selected: this.curNode.category_id },
      });
    },
    handleSvgClick() {
      this.curNode = null;
    },
    handleSubnodeDblClick(node) {
      this.curNode = node;
    },
    handleConnClick() {
      this.curNode = null;
    },
    handleClkHelp() {
      this.$Modal.info({
        title: '使用帮助',
        content:
            '快捷键：</br>' +
            '双击节点可以打开节点中的URL。</br>',
        scrollable: true,
        closable: true,
      });
    },
    handleOpenUrl() {
      if (this.curNode.URI) {
        if (!_(this.curNode.URI)
          .startsWith('http://')) {
          window.open(`http://${this.curNode.URI}`, '_blank');
        }
        window.open(this.curNode.URI, '_blank');
      }
    },
    handleOpenNote() {
      this.$refs.notemdReader.handleShowNoteModal();
    },
    jumpArticleNoteEdit() {
      this.$router.push({
        path: '/articleMde',
        query: { selected: this.getArticleIdByTitle(this.curNode.content) },
      });
    },
    handleCommentCommitted(com) {
      window.console.log('com', com);
      this.comments = [...this.comments, com];
    },
    handleClkBindEssay() {
      this.$router.push({
        path: '/essayReader',
        query: { selected: this.text.bindEssay },
      });
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
  .b-ed{
    width: 120px;
    margin-bottom: 5px;
    margin-left: 40px;
    margin-right: 40px;
  }
</style>
