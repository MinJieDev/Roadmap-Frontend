<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu :active-name="SideMenuActiveItem"
            @on-select="handleSideMenuSelect"
            theme="light" width="auto"
            :open-names="['1']"
            ref="side_menu">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            文献栏
          </template>
          <MenuItem v-for="(article, index) in articles" :key="index" :name="'1-'+article.id" >
            <FileItem
              :fileName="article.title"
              :display="isFileItemDisplay('1-'+article.id)"
              :articleId="article.id"
              @node-added="handleArticleNodeAdded"
              @node-deleted="handleNodeDeleted">
            </FileItem>
          </MenuItem>
        </Submenu>
<!--        <Submenu name="2">-->
<!--          <template slot="title">-->
<!--            <Icon type="ios-keypad"></Icon>-->
<!--            随笔栏-->
<!--          </template>-->
<!--          <MenuItem name="2-1">Option 1</MenuItem>-->
<!--          <MenuItem name="2-2">Option 2</MenuItem>-->
<!--        </Submenu>-->
<!--        <Submenu name="3">-->
<!--          <template slot="title">-->
<!--            <Icon type="ios-analytics"></Icon>-->
<!--            其它-->
<!--          </template>-->
<!--          <MenuItem name="3-1">Option 1</MenuItem>-->
<!--          <MenuItem name="3-2">Option 2</MenuItem>-->
<!--        </Submenu>-->
      </Menu>
    </Sider>
    <Content :style="{minHeight: '280px', background: '#fff'}">
      <div v-if="!titleEditable" id="roadmap-title" style="padding: 12px">
        {{roadMapTitle}}
        <Icon type="ios-create-outline" @click="handleClkEditTitle" />
      </div>
      <Input v-model="roadMapTitle"
             v-if="titleEditable"
             @on-blur="handleUpdateTitle"
             size="large" style="padding: 12px">
      </Input>
      <Collapse value="1">
        <Panel name="1">
          Description
          <Icon type="ios-create-outline" @click="handleClkEditDescription" />
          <p slot="content">{{description}}</p>
          <EditRoadmapDescriptionForm
            :description="description"
            ref="edit_desc"
            @description-edited="handleDescEdited"
            >
          </EditRoadmapDescriptionForm>
        </Panel>
      </Collapse>
      <roadmap
        :nodes="nodes"
        :connections="mergedConnections"
        :editable="true"
        :key="repaint"
        :live-node="curNode"
        @node-click="handleNodeClick"
        @node-dblclick="handleNodeDblClick"
        @subnode-dblclick="handleSubnodeDblClick"
        @svg-click="handleSvgClick"
      />
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Button type="primary" @click="handleClkReadOnly"
              :disabled="roadMapId===-1" class="b-ro">
        Read Only
      </Button>
      <Button type="success" @click="handleClkShare"
              :disabled="roadMapId===-1" class="b-ro">
        Share
      </Button>
      <Button type="warning" @click="handleClkSaveRoadmap"
              class="b-ro">
        保存路书
      </Button>
      <Button type="info" @click="handleClkSaveRoadmap"
              class="b-ro">
        <AddNodeForm @node-added="handleNodeAdded"></AddNodeForm>
      </Button>
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']" v-if="nodeChosen">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            节点工具
          </template>
<!--          <AddConnectionForm-->
<!--            @connection-added="handleConnectionAdded"-->
<!--            :node-name-list='nodeNameList'>-->
<!--          </AddConnectionForm>-->
          <!--          <DelConnectionForm-->
          <!--            @connection-deleted="handleConnectionDeleted"-->
          <!--            :node-name-list='nodeNameList'>-->
          <!--          </DelConnectionForm>-->
          <MenuItem name="del-node" @click.native="handleNodeDeleted">删除节点</MenuItem>
          <AddCommentForm @comment-added="handleCommentAdded" v-if="!commentExist"></AddCommentForm>
          <ModifyCommentForm
            @comment-modified="handleCommentAdded"
            v-if="commentExist"
            :comment="curComment">
          </ModifyCommentForm>
          <MenuItem name="del-comment" @click.native="handleCommentDeleted" v-if="commentExist">
            删除注释
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import AddNodeForm from '../components/AddNodeForm';
import AddConnectionForm from '../components/AddConnectionForm';
import DelNodeForm from '../components/DelNodeForm';
import DelConnectionForm from '../components/DelConnectionForm';
import AddCommentForm from '../components/AddCommentForm';
import DelCommentForm from '../components/DelCommentForm';
import LoadRoadmapForm from '../components/LoadRoadmapForm';
import EditRoadmapDescriptionForm from '../components/EditRoadmapDescriptionForm';
import ModifyCommentForm from '../components/ModifyCommentForm';
import FileItem from '../components/FileItem';
import { req } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import {
  createRoadmap,
  updateRoadmap,
  getRoadmap,
  updateRoadmapTitle,
  updateRoadmapDescription,
  postRoadmapShareLink,
} from '../apis/RoadmapEditorApis';
import Roadmap from '../components/roadmap/Roadmap';

Vue.prototype._ = _;

export default {
  name: 'RoadmapEditor',
  components: {
    Roadmap,
    AddNodeForm,
    AddConnectionForm,
    DelNodeForm,
    DelConnectionForm,
    AddCommentForm,
    DelCommentForm,
    FileItem,
    LoadRoadmapForm,
    EditRoadmapDescriptionForm,
    ModifyCommentForm,
  },
  data() {
    return {
      roadMapId: -1,
      roadMapTitle: 'New RoadMap',
      articles: [],
      display: false,
      SideMenuActiveItem: '',
      repaint: 1,
      titleEditable: false,
      description: '',
      nodes: [
      ],
      connections: [
      ],
      commentList: [
      ],
      nodeChosen: false,
      curNode: null,
    };
  },
  computed: {
    nodeNameList() {
      let ret = [];
      _(this.nodes).forEach((node) => {
        ret = [...ret, node.text];
      });
      return ret;
    },
    isFileItemDisplay() {
      return itemName => itemName === this.SideMenuActiveItem;
    },
    // if category is article, use "$id" in text
    savedNodes() {
      let ret = [];
      _(this.nodes).forEach((node) => {
        let saveTxt = node.text;
        if (node.category === 'article') {
          saveTxt = `$${this.getArticleIdByTitle(node.text)}`;
        }
        ret = [...ret, {
          text: saveTxt,
          URI: node.URI,
          fx: node.fx,
          fy: node.fy,
          nodes: node.nodes,
          category: node.category,
        }];
      });
      return ret;
    },
    savedConnections() {
      let ret = [];
      _(this.connections).forEach((connection) => {
        let sourceTxt = connection.source.text;
        let targetTxt = connection.target.text;
        if (connection.source.category === 'article') {
          sourceTxt = `$${this.getArticleIdByTitle(sourceTxt)}`;
        }
        if (connection.target.category === 'article') {
          targetTxt = `$${this.getArticleIdByTitle(targetTxt)}`;
        }
        ret = [...ret, {
          source: sourceTxt,
          target: targetTxt,
          source_category: connection.source.category,
          target_category: connection.target.category,
        }];
      });
      return ret;
    },

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
    curComment() {
      if (!(this.curNode) || this.curNode.nodes.length === 0) {
        return null;
      }
      return this.curNode.nodes[0].text;
    },
    commentExist() {
      if (!(this.curNode) || this.curNode.nodes.length === 0) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    // GET articles for l-sider
    req('/api/articles/', 'GET').then((res1) => {
      this.articles = res1.data;
      // load roadMap if has query
      if ((typeof (this.$route.query.selected) !== 'undefined') &&
        (String(this.$route.query.selected) !== '-1')) {
        this.roadMapId = this.$route.query.selected;
        getRoadmap(this.roadMapId)
          .then((res) => {
            this.nodes = this.toDisplayNodes(JSON.parse(res.data.text).nodes);
            this.connections = this.toDisplayConnections(JSON.parse(res.data.text).connections);
            this.roadMapTitle = res.data.title;
            this.description = res.data.description;
            this.repaintMindMap();
            this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      }
    }).catch((err) => {
      pushErr(this, err, true);
    });
  },
  methods: {
    getMidPos() {
      let xMin = +99999;
      let xMax = -99999;
      let yMin = +99999;
      let yMax = -99999;
      if (this.nodes.length === 0) {
        return {
          fx: -13.916222252976013,
          fy: -300.1641376795345,
        };
      }
      _(this.nodes).forEach((node) => {
        xMax = node.fx > xMax ? node.fx : xMax;
        xMin = node.fx < xMin ? node.fx : xMin;
        yMax = node.fy > yMax ? node.fy : yMax;
        yMin = node.fy < yMin ? node.fy : yMin;
      });
      return {
        fx: (xMin + xMax) / 2,
        fy: (yMin + yMax) / 2,
      };
    },
    handleNodeAdded(nodeInfo, category) {
      const pos = this.getMidPos();
      this.nodes = [...this.nodes,
        {
          text: nodeInfo.nodeName,
          URI: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: category || 'mindmap',
        }];
      this.repaintMindMap();
    },
    handleArticleNodeAdded(nodeInfo) {
      this.handleNodeAdded(nodeInfo, 'article');
    },
    handleNodeDeleted() {
      this.nodes = _.filter(this.nodes, node => node.text !== this.curNode.text);
      this.connections = _.filter(this.connections, connection =>
        (connection.source.text !== this.curNode.text
          && connection.target.text !== this.curNode.text));
      this.curNode = null;
      this.repaintMindMap();
    },
    handleConnectionAdded(connectionInfo) {
      this.connections = [...this.connections, {
        source: connectionInfo.sourceNode,
        target: connectionInfo.targetNode,
      }];
      this.repaintMindMap();
    },
    handleConnectionDeleted(connectionInfo) {
      this.connections = _.filter(this.connections, connection => !(
        (connection.source.text === connectionInfo.node1
                  && connection.target.text === connectionInfo.node2)
        || (connection.target.text === connectionInfo.node1
                  && connection.source.text === connectionInfo.node2)));
      this.repaintMindMap();
    },
    handleCommentAdded(commentInfo) {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          // eslint-disable-next-line no-param-reassign
          node.nodes = [{
            text: commentInfo.comment,
            nodes: [],
            color: 'rgba(36, 170, 255, 1.0)',
          }];
        }
      });
      this.repaintMindMap();
    },
    handleCommentDeleted() {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          // eslint-disable-next-line no-param-reassign
          node.nodes = [];
        }
      });
      this.repaintMindMap();
    },
    handleNodeCommentListChanged(nodeName) {
      this.commentList = [];
      const tmplist = _(this.nodes).filter(node => node.text === nodeName);
      _(tmplist).forEach((node) => {
        _(node.nodes).forEach((node2) => {
          this.commentList = [...this.commentList, node2.text];
        });
      });
    },
    repaintMindMap() {
      this.repaint += 1;
    },
    handleSideMenuSelect(itemName) {
      this.SideMenuActiveItem = itemName;
    },
    handleClkSaveRoadmap() {
      // id ==
      if (this.roadMapId === -1) {
        createRoadmap(this.roadMapTitle, this.savedNodes, this.savedConnections, this.description)
          .then((res) => {
            this.$Notice.success({ title: `Roadmap created, id: ${res.data.id}` });
            this.roadMapId = res.data.id;
          }).catch((err) => {
            pushErr(this, err, true);
          });
      } else {
        updateRoadmap(this.roadMapId, this.roadMapTitle, this.savedNodes, this.savedConnections,
          this.description)
          .then(() => {
            this.$Notice.success({ title: `Roadmap saved, id: ${this.roadMapId}` });
          }).catch((err) => {
            pushErr(this, err, true);
          });
      }
    },
    handleClkLoadRoadmap(roadmapInfo) {
      getRoadmap(roadmapInfo.roadmapId).then((res) => {
        this.nodes = JSON.parse(res.data.text).nodes;
        this.connections = JSON.parse(res.data.text).connections;
        this.roadMapTitle = res.data.title;
        this.repaintMindMap();
        this.roadMapId = roadmapInfo.roadmapId;
        this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleClkCreateRoadmap() {
      createRoadmap(this.roadMapTitle, this.savedNodes, this.savedConnections).then((res) => {
        this.$Notice.success({ title: `Roadmap created, id: ${res.data.id}` });
        this.roadMapId = res.data.id;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleClkEditTitle() {
      this.titleEditable = true;
    },
    handleClkEditDescription() {
      this.$refs.edit_desc.handleTrig();
    },
    handleDescEdited(newDesc) {
      this.description = newDesc;
      if (this.roadMapId !== -1) {
        updateRoadmapDescription(this.roadMapId, newDesc).then(() => {
          this.$Notice.success({ title: 'description sent' });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      }
    },
    handleUpdateTitle() {
      if (this.roadMapId !== -1) {
        updateRoadmapTitle(this.roadMapId, this.roadMapTitle).then(() => {
          this.$Notice.success({ title: 'Roadmap Title Updated' });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      }
      this.titleEditable = false;
    },
    handleClkReadOnly() {
      this.$router.push({
        path: '/reader',
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
    getArticleIdByTitle(title) {
      return _(this.articles).find(art => art.title === title).id;
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
    handleNodeClick(node) {
      this.nodeChosen = true;
      this.curNode = node;
      window.console.log('click', node);
    },
    handleNodeDblClick(node) {
      this.nodeChosen = true;
      this.curNode = node;
      window.console.log('dbclick', node);
    },
    handleSvgClick() {
      this.nodeChosen = false;
      this.curNode = null;
      window.console.log('svg');
    },
    handleSubnodeDblClick(node) {
      this.nodeChosen = true;
      this.curNode = node;
      window.console.log('subdbclick', node);
    },
  },
};
</script>

<style scoped>
  #roadmap-title{
    text-align:left;
    font-size: 24px;
  }
  .b-ro{
    width: 120px;
    margin-bottom: 10px;
    margin-left: 40px;
    margin-right: 40px;
  }
</style>
