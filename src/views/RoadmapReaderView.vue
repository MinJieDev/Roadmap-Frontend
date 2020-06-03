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
        @node-click="handleNodeClick"
        @node-dblclick="handleNodeDblClick"
        @subnode-dblclick="handleSubnodeDblClick"
        @svg-click="handleSvgClick"
        @conn-click="handleConnClick"
      />
      <Likes @on-share="handleClkShare" @on-like="handleClkLike" @on-unlike="handleClkUnlike"
             :like="like" :me="user"></Likes>
      <Comment :comment="comment" @comment-committed="handleCommentCommitted"></Comment>
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}" v-if="sharedId===-1">
      <Button  @click="handleClkHelp"
               class="b-ed">
        使用帮助
        <Icon type="ios-help-circle" />
      </Button>
      <Button type="warning" @click="handleClkEdit" class="b-ed">
        编&emsp;&emsp;辑
        <Icon type="ios-create"/>
      </Button>
      <Button type="success" @click="handleClkShare" class="b-ed">
        分&emsp;&emsp;享
        <Icon type="ios-share" />
      </Button>
      <Button type="primary" @click="handleOpenUrl" class="b-ed" v-if="openable">
        查看链接
        <Icon type="ios-link" />
      </Button>
      <Button type="info" @click="handleOpenNote" class="b-ed" v-if="curNodeType==='article'">
        查看笔记
        <Icon type="ios-book" />
      </Button>
      <Button type="success" @click="handleClkBindEssay"
              class="b-ed" v-if="hasBindEssay">
          查看随笔
          <Icon type="md-cloud-upload" />
      </Button>
      <NoteMarkdown :note="curNote" ref="notemdReader"
                    @article-note-edit="jumpArticleNoteEdit"></NoteMarkdown>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import { pushErr } from '../components/ErrPush';
import { getRoadmap, getRoadmapShareLink, postRoadmapShareLink, createComment, putCommentId, putCommentSHA, putLikeSHA, putUnlikeSHA } from '../apis/RoadmapEditorApis';
import { reqSingle } from '../apis/util';
import Roadmap from '../components/roadmap/Roadmap';
import NoteMarkdown from '../components/NoteMarkdown';
import Likes from '../components/Likes';
import Comment from '../components/comment/Comment';
import { getEssay } from '../apis/EssayEditorApis';
import { getUser } from '../apis/UserProfileApis';

Vue.prototype._ = _;

export default {
  name: 'RoadmapReader',
  components: {
    Roadmap,
    NoteMarkdown,
    Likes,
    Comment,
  },
  data() {
    return {
      user: null,
      text: null,
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
      essays: [],
      curNode: null,
      refCurves: [
      ],
      comment: [],
      like: [],
    };
  },
  async mounted() {
    // share
    if (!this.$route.query.selected) {
      this.sharedId = this.$route.query.sharedId;
      try {
        // this.articles = (await req('/api/articles/', 'GET')).data;
        this.user = (await getUser()).data;
        const roadmapData = (await getRoadmapShareLink(this.sharedId)).data;
        this.articles = roadmapData.articles_used;
        this.essays = roadmapData.essays_used;
        this.comment = roadmapData.comment;
        this.like = roadmapData.like;
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
      this.roadMapId = this.$route.query.selected;
      try {
        this.user = (await getUser()).data;
        this.articles = (await reqSingle('/api/articles/', 'GET')).data;
        this.essays = (await reqSingle('/api/essays/', 'GET')).data;
        const roadmapData = (await getRoadmap(this.roadMapId)).data;
        this.comment = roadmapData.comment;
        this.like = roadmapData.like;
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
        const article = this.getArticleById(node.category_id);
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
      if (this.getArticleById(this.curNode.category_id).note) {
        return this.getArticleById(this.curNode.category_id).note;
      }
      return '';
    },
    hasBindEssay() {
      return this.text && this.text.bindEssay && this.text.bindEssay !== -1;
    },
    commentId() {
      let ret = [];
      _(this.comment).forEach((comm) => {
        ret = [...ret, comm.id];
      });
      return ret;
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
      if (this.sharedId !== -1) {
        window.console.log('sharedId', this.sharedId);
        this.$Modal.success({
          title: '路书分享链接',
          content: `http://47.94.141.56/reader?sharedId=${this.sharedId}`,
          width: '700',
        });
      } else {
        postRoadmapShareLink(this.roadMapId).then((res) => {
          this.$Modal.success({
            title: '路书分享链接',
            content: `http://47.94.141.56/reader?sharedId=${res.data.share_id}/`,
            width: '700',
          });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      }
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
            node.URI = art.url;
            // eslint-disable-next-line no-param-reassign
            node.category_id = articleId;
            // eslint-disable-next-line no-param-reassign
            node.using_alias = node.using_alias || false;
            // eslint-disable-next-line no-param-reassign,no-nested-ternary
            node.content = node.using_alias ? (art.alias === '' ? art.title : art.alias) : art.title;
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
    // @deprecated
    getArticleByTitle(title) {
      window.console.warn('this function is deprecated, which cannot suport duplicated article name. Use getArticleById instead');
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
        if (!_(node.URI).startsWith('http://')) {
          window.open(`http://${node.URI}`, '_blank');
        }
        window.open(node.URI, '_blank');
      } else if (node.category === 'essay') {
        this.handleOpenEssay();
      } else {
        window.console.log('pass');
      }
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
        query: { selected: this.curNode.category_id },
      });
    },
    handleCommentCommitted(com) {
      window.console.log('com', com);
      createComment(com).then((res) => {
        if (String(this.sharedId) !== '-1') {
          putCommentSHA(this.sharedId, res.data.id).then(() => {
            getRoadmapShareLink(this.sharedId).then((res3) => {
              this.comment = res3.data.comment;
            });
          });
        } else {
          putCommentId(this.roadMapId, [...this.commentId, res.data.id]).then(() => {
            getRoadmap(this.roadMapId).then((res3) => {
              this.comment = res3.data.comment;
            });
          });
        }
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleClkLike() {
      window.console.log('like');
      if (String(this.sharedId) !== '-1') {
        putLikeSHA(this.sharedId).then((res) => {
          this.like = res.data.like;
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else {
        this.$Notice.info({ title: '不能给自己点赞哦' });
      }
    },
    handleClkUnlike() {
      window.console.log('unlike');
      if (String(this.sharedId) !== '-1') {
        putUnlikeSHA(this.sharedId).then((res) => {
          this.like = res.data.like;
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else {
        this.$Notice.info({ title: '不能给自己点赞哦' });
      }
    },
    handleClkBindEssay() {
      getEssay(this.text.bindEssay).then(() => {
        this.$router.push({
          path: '/essayRoadmapReader',
          query: { selected: this.text.bindEssay },
        });
      }).catch(() => {
        this.$Modal.error({ title: `Essay ${this.text.bindEssay} not found` });
        this.text.bindEssay = -1;
      });
    },
    handleOpenEssay() {
      this.$router.push({
        path: '/essayReader',
        query: { selected: this.curNode.category_id },
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
