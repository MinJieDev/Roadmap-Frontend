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
              @node-added="handleArticleNodeAdded"
              @node-deleted="handleNodeDeleted">
            </FileItem>
          </MenuItem>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            随笔栏
          </template>
          <MenuItem name="2-1">Option 1</MenuItem>
          <MenuItem name="2-2">Option 2</MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-analytics"></Icon>
            其它
          </template>
          <MenuItem name="3-1">Option 1</MenuItem>
          <MenuItem name="3-2">Option 2</MenuItem>
        </Submenu>
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
      />
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Button type="info" @click="handleClkReadOnly" id="b-ro">Read Only</Button>
      <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            工具栏
          </template>
          <AddNodeForm @node-added="handleNodeAdded"></AddNodeForm>
          <AddConnectionForm
            @connection-added="handleConnectionAdded"
            :node-name-list='nodeNameList'>
          </AddConnectionForm>
          <DelNodeForm
            @node-deleted="handleNodeDeleted"
            :node-name-list='nodeNameList'>
          </DelNodeForm>
          <DelConnectionForm
            @connection-deleted="handleConnectionDeleted"
            :node-name-list='nodeNameList'>
          </DelConnectionForm>
          <AddCommentForm
            @comment-added="handleCommentAdded"
            :node-name-list="nodeNameList">
          </AddCommentForm>
          <DelCommentForm
            @comment-deleted="handleCommentDeleted"
            @node-comment-list-changed="handleNodeCommentListChanged"
            :node-name-list="nodeNameList"
            :comment-list="commentList">
          </DelCommentForm>
          <MenuItem name="save-roadmap" @click.native="handleClkSaveRoadmap">
            Save Roadmap
          </MenuItem>
          <LoadRoadmapForm @roadmap-form-loaded="handleClkLoadRoadmap">
          </LoadRoadmapForm>
          <MenuItem name="create-roadmap" @click.native="handleClkCreateRoadmap">
            create Roadmap
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
import FileItem from '../components/FileItem';
import { req } from '../apis/util';
import errPush from '../components/ErrPush';
import { createRoadmap, updateRoadmap, getRoadmap, updateRoadmapTitle, updateRoadmapDescription } from '../apis/RoadmapEditorApis';
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
    simpleNodes() {
      let ret = [];
      _(this.nodes).forEach((node) => {
        ret = [...ret, {
          text: node.text,
          URI: node.URI,
          fx: node.fx,
          fy: node.fy,
          nodes: node.nodes,
          category: node.category,
        }];
      });
      return ret;
    },
    simpleConnections() {
      let ret = [];
      _(this.connections).forEach((connection) => {
        ret = [...ret, {
          source: connection.source.text,
          target: connection.target.text,
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
  mounted() {
    // GET articles for l-sider
    req('/api/articles/', 'GET').then((res) => {
      this.articles = res.data;
    }).catch(() => {
      errPush(this, '4000', true);
    });
    // load roadMap if has query
    if ((typeof (this.$route.query.selected) !== 'undefined') &&
                (String(this.$route.query.selected) !== '-1')) {
      this.roadMapId = this.$route.query.selected;
      getRoadmap(this.roadMapId)
        .then((res) => {
          this.nodes = JSON.parse(res.data.text).nodes;
          this.connections = JSON.parse(res.data.text).connections;
          this.roadMapTitle = res.data.title;
          this.description = res.data.description;
          this.repaintMindMap();
          this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
        })
        .catch(() => {
          errPush(this, '4000', true);
        });
    }
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
    handleNodeDeleted(nodeInfo) {
      this.nodes = _.filter(this.nodes, node => node.text !== nodeInfo.nodeName);
      this.connections = _.filter(this.connections, connection =>
        (connection.source.text !== nodeInfo.nodeName
          && connection.target.text !== nodeInfo.nodeName));
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
        if (node.text === commentInfo.node) {
          // eslint-disable-next-line no-param-reassign
          node.nodes = [...node.nodes, {
            text: commentInfo.comment,
            nodes: [],
            color: 'rgba(36, 170, 255, 1.0)',
          }];
        }
      });
      this.repaintMindMap();
    },
    handleCommentDeleted(commentInfo) {
      _.forEach(this.nodes, (node) => {
        if (node.text === commentInfo.node) {
          // eslint-disable-next-line no-param-reassign
          node.nodes = _.filter(node.nodes, node2 => node2.text !== commentInfo.comment);
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
        createRoadmap(this.roadMapTitle, this.simpleNodes, this.simpleConnections).then((res) => {
          this.$Notice.success({ title: `Roadmap created, id: ${res.data.id}` });
          this.roadMapId = res.data.id;
        }).catch(() => {
          errPush(this, '4000', true);
        });
      } else {
        updateRoadmap(this.roadMapId, this.roadMapTitle, this.simpleNodes, this.simpleConnections)
          .then(() => {
            this.$Notice.success({ title: `Roadmap saved, id: ${this.roadMapId}` });
          }).catch(() => {
            errPush(this, '4000', true);
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
      }).catch(() => {
        errPush(this, '4000', true);
      });
    },
    handleClkCreateRoadmap() {
      createRoadmap(this.roadMapTitle, this.simpleNodes, this.simpleConnections).then((res) => {
        this.$Notice.success({ title: `Roadmap created, id: ${res.data.id}` });
        this.roadMapId = res.data.id;
      }).catch(() => {
        errPush(this, '4000', true);
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
      updateRoadmapDescription(this.roadMapId, newDesc).then(() => {
        this.$Notice.success({ title: 'description sent' });
      }).catch(() => {
        errPush(this, '4000', true);
      });
    },
    handleUpdateTitle() {
      if (this.roadMapId !== -1) {
        updateRoadmapTitle(this.roadMapId, this.roadMapTitle).then(() => {
          this.$Notice.success({ title: 'Roadmap Title Updated' });
        }).catch(() => {
          errPush(this, '4000', true);
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
  },
};
</script>

<style scoped>
  #roadmap-title{
    text-align:left;
    font-size: 24px;
  }
  #b-ro{
    width: 120px;
    margin-bottom: 20px;
    margin-left: 40px;
    margin-right: 40px;
  }
</style>
