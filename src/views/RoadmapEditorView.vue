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
            文献列表
          </template>
          <draggable
            class="dragArea list-group"
            :list="articleDragList"
            :group="{ name: 'article', pull: 'clone', put: false }"
            :sort="false"
          >
            <MenuItem v-for="(article, index) in articles" :key="index" :name="'1-'+article.id" >
              <FileItem
                :fileName="article.title"
                :articleUrl="article.url"
                :display="isFileItemDisplay('1-'+article.id)"
                :articleId="article.id"
                @node-added="handleArticleNodeAdded"
              >
              </FileItem>
            </MenuItem>
          </draggable>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            随笔列表
          </template>
          <draggable
            class="dragArea list-group"
            :list="essayDragList"
            :group="{ name: 'article', pull: 'clone', put: false }"
            :sort="false"
          >
            <MenuItem v-for="(essay, index) in essays" :key="index" :name="'2-'+essay.id" >
              <FileItem
                :fileName="essay.title"
                :articleUrl="''"
                :display="isFileItemDisplay('2-'+essay.id)"
                :articleId="essay.id"
                @node-added="handleEssayNodeAdded"
              >
              </FileItem>
            </MenuItem>
          </draggable>
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
      <Input ref="roadmapTitleInput"
             v-model="roadMapTitle"
             v-if="titleEditable"
             @on-blur="handleUpdateTitle"
             size="large" style="padding: 12px"
             @keydown.native.stop>
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
      <draggable
        class="dragArea list-group"
        :list="roadmapDragArticleList"
        :group="{ name: 'article', put: true }"
        ghostClass="ghost"
        @change="handleDraggedIn"
      >
        <div id="target">
          <roadmap
            ref="road_map"
            :nodes="nodes"
            :connections="mergedConnections"
            :editable="true"
            :key="repaint"
            :live-node="curNode"
            @node-click="handleNodeClick"
            @node-dblclick="handleNodeDblClick"
            @subnode-dblclick="handleSubnodeDblClick"
            @svg-click="handleSvgClick"
            @conn-click="handleConnClick"
          />
        </div>
      </draggable>
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Button  @click="handleClkHelp"
              class="b-ro">
        使用帮助
        <Icon type="ios-help-circle" />
      </Button>
      <Button type="primary" @click="handleClkReadOnly"
              :disabled="roadMapId===-1" class="b-ro">
        阅&emsp;&emsp;览
        <Icon type="ios-glasses" />
      </Button>
      <Button type="success" @click="handleClkShare"
              :disabled="roadMapId===-1" class="b-ro">
        分&emsp;&emsp;享
        <Icon type="ios-share" />
      </Button>
      <Button type="success" @click="handleClkExport"
              :disabled="roadMapId===-1" class="b-ro">
        导出图片
        <Icon type="ios-share" />
      </Button>
      <Button type="warning" @click="handleClkSaveRoadmap"
              class="b-ro">
        保存路书
        <Icon type="md-cloud-upload" />
      </Button>
      <Button type="success" @click="handleClkBindEssay"
              class="b-ro" :disabled="roadMapId===-1">
        <div v-if="hasBindEssay">
          修改随笔
          <Icon type="md-cloud-upload" />
        </div>
        <div v-else>
          新建随笔
          <Icon type="md-cloud-upload" />
        </div>
      </Button>
      <Button type="info" @click="handleClkSaveRoadmap"
              class="b-ro">
        <AddNodeForm @node-added="handleNodeAdded" ref="AddNodeForm"></AddNodeForm>
      </Button>
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']"
            v-if="nodeChosen && !modeConnectionChoosing">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            节点工具
          </template>
          <MenuItem name="open-url" @click.native="handleOpenUrl" v-if="openable">
            打开链接
            <Icon type="ios-link" />
          </MenuItem>
          <MenuItem name="open-essay" @click.native="handleOpenEssay" v-if="curNodeType==='essay'">
            打开随笔
            <Icon type="ios-book" />
          </MenuItem>
          <MenuItem name="open-note" @click.native="handleOpenNote" v-if="curNodeType==='article'">
            打开笔记
            <Icon type="ios-book" />
          </MenuItem>
          <NoteMarkdown :note="curNote" ref="NoteMarkdown"
                        @article-note-edit="jumpArticleNoteEdit"></NoteMarkdown>
          <ModifyNodeForm
            @node-modified="handleNodeModified"
            :node-info-old="curNodeInfo"
            v-if="curNodeType==='mindmap'"
            ref="modifyNode">
          </ModifyNodeForm>
          <ModifyAliasForm
            @alias-modified="handleAliasModified"
            :alias-info-old="curAliasInfo"
            v-if="curNodeType==='article'"
            ref="modifyAlias">
          </ModifyAliasForm>
          <MenuItem name="del-node" @click.native="handleNodeDeleted">
            删除节点
            <Icon type="md-trash" />
          </MenuItem>
          <MenuItem name="add-connection" @click.native="handleClkAddConnection">
            添加连接
            <Icon type="md-trending-up" />
          </MenuItem>
          <AddCommentForm @comment-added="handleCommentAdded" v-if="!commentExist"></AddCommentForm>
          <ModifyCommentForm
            @comment-modified="handleCommentAdded"
            v-if="commentExist"
            :comment="curComment"
            ref="modifyComment">
          </ModifyCommentForm>
          <MenuItem name="del-comment" @click.native="handleCommentDeleted" v-if="commentExist">
            删除注释
            <Icon type="ios-trash-outline" />
          </MenuItem>
          <ModifyColor
            @color-modified="handleColorModified"
            :color="curColor"
            ref="modifyColor">
          </ModifyColor>
        </Submenu>
      </Menu>
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']"
            v-if="curConn">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            连接工具
          </template>
          <MenuItem name="del-conn" @click.native="handleConnectionDeleted" v-if="conndeletable">
            删除连接
            <Icon type="md-trash" />
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import domtoimage from 'dom-to-image';
import draggable from 'vuedraggable';
import AddNodeForm from '../components/AddNodeForm';
import AddConnectionForm from '../components/AddConnectionForm';
import DelNodeForm from '../components/DelNodeForm';
import DelConnectionForm from '../components/DelConnectionForm';
import AddCommentForm from '../components/AddCommentForm';
import DelCommentForm from '../components/DelCommentForm';
import LoadRoadmapForm from '../components/LoadRoadmapForm';
import EditRoadmapDescriptionForm from '../components/EditRoadmapDescriptionForm';
import ModifyCommentForm from '../components/ModifyCommentForm';
import ModifyColor from '../components/ModifyColor';
import ModifyNodeForm from '../components/ModifyNodeForm';
import FileItem from '../components/FileItem';
import NoteMarkdown from '../components/NoteMarkdown';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import { getEssay } from '../apis/EssayEditorApis';
import { updateAlias } from '../apis/MindTableEditorApis';
import {
  createRoadmap,
  updateRoadmap,
  getRoadmap,
  updateRoadmapTitle,
  updateRoadmapDescription,
  postRoadmapShareLink,
} from '../apis/RoadmapEditorApis';
import Roadmap from '../components/roadmap/Roadmap';
import ModifyAliasForm from '../components/ModifyAliasForm';

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
    ModifyColor,
    ModifyNodeForm,
    NoteMarkdown,
    draggable,
    ModifyAliasForm,
  },
  data() {
    return {
      text: null,
      roadMapId: -1,
      roadMapTitle: 'New RoadMap',
      articles: [],
      essays: [],
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
      curNode: null,
      curConn: null,
      modeConnectionChoosing: false,
      nextNodeId: 1,
      refCurves: [
      ],
      roadmapDragArticleList: [
      ],
      roadmapArticles: [
      ],
      roadmapEssays: [
      ],
    };
  },
  computed: {
    // @deprecated method
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
        let saveTxt = node.content;
        if (node.category === 'article' || node.category === 'essay') {
          saveTxt = `$${node.category_id}`;
        }
        ret = [...ret, {
          text: node.text,
          content: saveTxt,
          URI: node.URI,
          color: node.color,
          fx: node.fx,
          fy: node.fy,
          nodes: node.nodes,
          category: node.category,
          using_alias: node.using_alias || false,
        }];
      });
      return ret;
    },
    savedConnections() {
      let ret = [];
      _(this.connections).forEach((connection) => {
        const sourceTxt = connection.source.text;
        const targetTxt = connection.target.text;
        ret = [...ret, {
          source: sourceTxt,
          target: targetTxt,
          curve: connection.curve,
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
    curComment() {
      if (!(this.curNode) || this.curNode.nodes.length === 0) {
        return null;
      }
      return this.curNode.nodes[0].text;
    },
    curColor() {
      if (!(this.curNode) || !(this.curNode.color)) {
        return null;
      }
      return this.curNode.color;
    },
    commentExist() {
      if (!(this.curNode) || this.curNode.nodes.length === 0) {
        return false;
      }
      return true;
    },
    nodeChosen() {
      if (this.curNode) {
        return true;
      }
      return false;
    },
    openable() {
      window.console.log('openurl', this.curNode.URI);
      if (this.curNode.URI) {
        return true;
      }
      return false;
    },
    curNodeInfo() {
      if (this.curNode) {
        return {
          name: this.curNode.content,
          URI: this.curNode.URI,
        };
      }
      return null;
    },
    curNodeType() {
      if (this.curNode) {
        return this.curNode.category;
      }
      return null;
    },
    conndeletable() {
      if (this.curConn && this.curConn.type !== 'ref') {
        return true;
      }
      return false;
    },
    curNote() {
      if (!this.curNode || this.curNode.category !== 'article') return '';
      if (this.getArticleById(this.curNode.category_id).note) {
        return this.getArticleById(this.curNode.category_id).note;
      }
      return '';
    },
    articleDragList() {
      let ret = [];
      _(this.articles).forEach((art) => {
        ret = [...ret, { ...art, category: 'article' }];
      });
      return ret;
    },
    essayDragList() {
      let ret = [];
      _(this.essays).forEach((ess) => {
        ret = [...ret, { ...ess, category: 'essay' }];
      });
      return ret;
    },
    hasBindEssay() {
      return this.text && this.text.bindEssay && this.text.bindEssay !== -1;
    },
    curAliasInfo() {
      if (!this.curNode || this.curNode.category !== 'article') {
        return null;
      }
      const art = this.getArticleById(this.curNode.category_id);
      return {
        using_alias: this.curNode.using_alias || false,
        alias: art.alias,
      };
    },
  },
  mounted() {
    // GET articles for l-sider
    reqSingle('/api/articles/', 'GET').then((res1) => {
      window.console.log('article', res1);
      this.articles = res1.data;
      reqSingle('/api/essays/', 'GET').then((res2) => {
        this.essays = res2.data;
        // load roadMap if has query
        if ((typeof (this.$route.query.selected) !== 'undefined') &&
          (String(this.$route.query.selected) !== '-1')) {
          this.roadMapId = this.$route.query.selected;
          getRoadmap(this.roadMapId)
            .then((res) => {
              this.text = JSON.parse(res.data.text);
              this.nodes = this.toDisplayNodes(JSON.parse(res.data.text).nodes);
              this.connections = this.toDisplayConnections(JSON.parse(res.data.text).connections);
              this.refCurves = JSON.parse(res.data.text).refConnections;
              this.roadMapTitle = res.data.title;
              this.description = res.data.description;
              this.nextNodeId = JSON.parse(res.data.text).nextNodeId;
              this.roadmapArticles = res.data.articles;
              this.roadmapEssays = res.data.essays;
              this.initMindMap();
              this.$Notice.success({ title: `Roadmap loaded, id: ${this.roadMapId}` });
              window.console.log('data', res.data);
            })
            .catch((err) => {
              pushErr(this, err, true);
            });
        }
      }).catch((err) => {
        pushErr(this, err, true);
      });
    }).catch((err) => {
      pushErr(this, err, true);
    });
  },
  created() {
    // 监控键盘事件
    document.onkeydown = (e) => {
      if (this.$route.name !== 'Editor') return;
      window.console.log('键盘事件', e);
      // 事件对象兼容
      const e1 = e;
      // 键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      // 左
      if (e1 && e1.key === 'Backspace') {
        if (this.curNode !== null) {
          this.handleNodeDeleted();
        } else if (this.curConn !== null) {
          this.handleConnectionDeleted();
        }
      } else if ((e.metaKey === true || e.ctrlKey === true) && e.key === 's') {
        this.handleClkSaveRoadmap();
        e.preventDefault();
      } else if (e.key === 'Enter') {
        this.$refs.AddNodeForm.handleClkAddNode();
      } else if (e.key === 'Tab') {
        if (this.curNode !== null) {
          const name = this.createUniName();
          if (!name) {
            pushErr(this, 1000, true, '创建新节点失败', '自动生成节点名失败');
            return;
          }
          const thisId = this.handleNodeAdded({
            nodeName: name,
            nodeUrl: '',
          });
          this.handleConnectionAdded({
            sourceNode: this.curNode.text,
            targetNode: thisId,
          });
        }
      }
    };
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
    getCurves() {
      let ret = [];
      const allConns = this.$refs.road_map.getConn();
      _.forEach(allConns, (conn) => {
        if (conn.type === 'ref') {
          ret = [...ret, {
            source: conn.source,
            target: conn.target,
            curve: conn.curve,
          }];
        }
      });
      return ret;
    },
    handleNodeAdded(nodeInfo, category) {
      const pos = this.getMidPos();
      let defaultColor = '#f5f5f5';
      if (category === 'article') {
        defaultColor = '#f5d72b';
      }
      if (category === 'essay') {
        defaultColor = '#f5b5d7';
      }
      this.nodes = [...this.nodes,
        {
          text: `#${this.nextNodeId}`, // 为#nodeId，保证不重名
          content: nodeInfo.nodeName,
          URI: nodeInfo.nodeUrl,
          color: nodeInfo.color || defaultColor,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: category || 'mindmap',
          category_id: nodeInfo.articleId || -1,
        }];
      this.nextNodeId += 1;
      this.repaintMindMap();
      return `#${this.nextNodeId - 1}`;
    },
    handleNodeModified(nodeInfo) {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          // eslint-disable-next-line no-param-reassign
          node.content = nodeInfo.nodeName;
          // eslint-disable-next-line no-param-reassign
          node.URI = nodeInfo.nodeUrl;
        }
      });
      this.repaintMindMap();
    },
    handleAliasModified(aliasInfo) {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          updateAlias(this.curNode.category_id, aliasInfo.alias).then(() => {
            this.$Notice.success({ title: 'alias modified' });
            const art = this.getArticleById(this.curNode.category_id);
            art.alias = aliasInfo.alias;
            // eslint-disable-next-line no-param-reassign
            node.using_alias = aliasInfo.using_alias;
            // eslint-disable-next-line no-param-reassign,no-nested-ternary
            node.content = node.using_alias ? (art.alias === '' ? art.title : art.alias) : art.title;
            this.repaintMindMap();
          }).catch((err) => {
            pushErr(this, err, true);
          });
        }
      });
    },
    handleArticleNodeAdded(nodeInfo) {
      this.roadmapArticles = _.uniq([...this.roadmapArticles, nodeInfo.articleId]);
      this.handleNodeAdded(nodeInfo, 'article');
    },
    handleEssayNodeAdded(nodeInfo) {
      this.roadmapEssays = _.uniq([...this.roadmapEssays, nodeInfo.articleId]);
      this.handleNodeAdded(nodeInfo, 'essay');
    },
    // 删除文献结点
    // @deprecated method
    handleArticleNodeDeleted(articleTitle) {
      window.console.log('handleArticleNodeDeleted: deprecated method');
      this.nodes = _.filter(this.nodes, node => node.text !== articleTitle);
      this.connections = _.filter(this.connections, connection =>
        (connection.source.text !== articleTitle
          && connection.target.text !== articleTitle));
      this.$Notice.success({ title: 'node deleted' });
      this.repaintMindMap();
    },
    handleNodeDeleted() {
      this.nodes = _.filter(this.nodes, node => node.text !== this.curNode.text);
      if (this.curNode.category === 'article') {
        if (!_(this.nodes).find(node => (node.category === 'article' && node.category_id === this.curNode.category_id))) {
          _.remove(this.roadmapArticles,
            artid => String(artid) === String(this.curNode.category_id));
        }
      }
      if (this.curNode.category === 'essay') {
        if (!_(this.nodes).find(node => (node.category === 'essay' && node.category_id === this.curNode.category_id))) {
          window.console.log('fuck', this.roadmapEssays);
          _.remove(this.roadmapEssays, essid => String(essid) === String(this.curNode.category_id));
          window.console.log('fuck2', this.roadmapEssays);
        }
      }
      this.connections = _.filter(this.connections, connection =>
        (connection.source.text !== this.curNode.text
          && connection.target.text !== this.curNode.text));
      this.curNode = null;
      this.$Notice.success({ title: 'node deleted' });
      this.repaintMindMap();
    },
    handleConnectionAdded(connectionInfo) {
      this.connections = [...this.connections, {
        source: connectionInfo.sourceNode,
        target: connectionInfo.targetNode,
      }];
      this.repaintMindMap();
    },
    handleConnectionDeleted() {
      this.connections = _.filter(this.connections, connection => !(
        (connection.source.text === this.curConn.source.text
                  && connection.target.text === this.curConn.target.text)));
      this.curConn = null;
      this.$Notice.success({ title: 'connection deleted' });
      this.repaintMindMap();
    },
    handleClkAddConnection() {
      this.modeConnectionChoosing = true;
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
    handleColorModified(colorInfo) {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          // eslint-disable-next-line no-param-reassign
          node.color = colorInfo;
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
    // @deprecated
    handleNodeCommentListChanged(nodeName) {
      this.commentList = [];
      const tmplist = _(this.nodes).filter(node => node.text === nodeName);
      _(tmplist).forEach((node) => {
        _(node.nodes).forEach((node2) => {
          this.commentList = [...this.commentList, node2.text];
        });
      });
    },
    initMindMap() {
      this.repaint += 1;
    },
    repaintMindMap() {
      this.refCurves = this.getCurves();
      this.repaint += 1;
    },
    handleSideMenuSelect(itemName) {
      this.SideMenuActiveItem = itemName;
    },
    handleClkSaveRoadmap() {
      this.refCurves = this.getCurves();
      // generate thumbnail image formatted as base 64.
      this.getRoadmapThumbnail().then((data) => {
        window.console.info(data);
        this.createOrUpdate(data);
      }).catch(() => {
        window.console.log('获取缩略图失败');
        this.createOrUpdate(undefined);
        pushErr(this, '获取缩略图失败');
      });
    },
    // @deprecated
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
    // @deprecated
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
      // 焦点定位于输入框
      this.$nextTick(() => this.$refs.roadmapTitleInput.focus());
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
    handleClkExport() {
      this.getRoadmapThumbnail().then((pngUrl) => {
        const name = `${this.roadMapTitle}.png`;
        const a = document.createElement('a');
        if (pngUrl) {
          a.href = pngUrl;
          a.download = name;
          a.click();
        }
      }).catch(() => {
        pushErr(this, '生成缩略图失败', true);
      });
    },
    // @deprecated
    getArticleByTitle(title) {
      window.console.warn('this function is deprecated, which cannot suport duplicated article name. Use getArticleById instead');
      return _(this.articles).find(art => art.title === title);
    },
    // @deprecated
    getArticleIdByTitle(title) {
      window.console.warn('this function is deprecated, which cannot suport duplicated article name. Use getArticleById instead');
      return _(this.articles).find(art => art.title === title).id;
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
    createUniName() {
      return '新建节点';
    },
    handleOpenUrl() {
      if (this.curNode.URI) {
        if (!_(this.curNode.URI)
          .startsWith('http')) {
          window.open(`http://${this.curNode.URI}`, '_blank');
        } else {
          window.open(this.curNode.URI, '_blank');
        }
      }
    },
    handleNodeClick(node) {
      if (this.modeConnectionChoosing) {
        this.handleConnectionAdded({
          sourceNode: this.curNode.text,
          targetNode: node.text,
        });
        this.modeConnectionChoosing = false;
      } else {
        this.curNode = node;
        this.curConn = null;
        window.console.log('click', node);
      }
    },
    handleNodeDblClick(node) {
      this.modeConnectionChoosing = false;
      this.curNode = node;
      this.curConn = null;
      window.console.log('dbclick', node);
      window.console.log('url', node.URI);
      if (node.category === 'article') {
        this.$nextTick(() => {
          window.console.log(this.curNode);
          this.$refs.modifyAlias.handleClkModifyAlias();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.modifyNode.handleClkModifyNode();
        });
      }
    },
    handleSvgClick() {
      this.modeConnectionChoosing = false;
      this.curNode = null;
      this.curConn = null;
      window.console.log('svg');
    },
    handleSubnodeDblClick(node) {
      this.modeConnectionChoosing = false;
      this.curNode = node;
      this.curConn = null;
      window.console.log('subdbclick', node);
      this.$nextTick(() => {
        this.$refs.modifyComment.handleClkModifyComment();
      });
    },
    handleConnClick(conn) {
      this.modeConnectionChoosing = false;
      this.curNode = null;
      this.curConn = conn;
    },
    handleClkHelp() {
      this.$Modal.info({
        title: '使用帮助',
        content: '点选左侧文献栏中文献，可以添加文献节点。</br>点选右侧新建节点，可以添加普通节点。</br>' +
                 '点选画板中节点和边，可以依据右侧工具栏对节点和边进行编辑。</br>' +
                 '快捷键：</br>' +
                 '双击普通节点可以编辑普通节点。</br>' +
                 '双击注释可以编辑注释。</br>' +
                 '保存：Ctrl+S(PC), Command+S(MAC)</br>' +
                 '删除：点选元素后按delete</br>' +
                 '新建普通节点：Enter</br>' +
                 '新建关联节点: Tab',
        scrollable: true,
        closable: true,
      });
    },
    handleOpenNote() {
      window.console.log('notemarkdown', this.$refs);
      this.$refs.NoteMarkdown.handleShowNoteModal();
    },
    jumpArticleNoteEdit() {
      this.$router.push({
        path: '/articleMde',
        query: { selected: this.curNode.category_id },
      });
    },
    handleArticleDraggedIn(evt) {
      this.handleArticleNodeAdded({
        nodeName: evt.added.element.title,
        articleId: evt.added.element.id,
        nodeUrl: evt.added.element.url,
      });
    },
    handleEssayDraggedIn(evt) {
      this.handleEssayNodeAdded({
        nodeName: evt.added.element.title,
        articleId: evt.added.element.id,
        nodeUrl: '',
      });
    },
    handleDraggedIn(evt) {
      window.console.log(evt);
      if (evt.added.element.category === 'article') {
        this.handleArticleDraggedIn(evt);
      } else if (evt.added.element.category === 'essay') {
        this.handleEssayDraggedIn(evt);
      }
    },
    getRoadmapThumbnail() {
      return domtoimage.toPng(document.getElementById('target'));
    },
    createOrUpdate(thumbnail64) {
      // id ==
      if (this.roadMapId === -1) {
        createRoadmap(this.roadMapTitle, this.savedNodes, this.savedConnections,
          this.refCurves, this.description, this.nextNodeId, thumbnail64,
          this.roadmapArticles, this.roadmapEssays)
          .then((res) => {
            this.$Notice.success({ title: `Roadmap created, id: ${res.data.id}` });
            this.roadMapId = res.data.id;
            this.$router.push({
              path: '/editor',
              query: { selected: res.data.id },
            });
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      } else {
        let bindess = -1;
        if (this.text && this.text.bindEssay) bindess = this.text.bindEssay;
        updateRoadmap(this.roadMapId, this.roadMapTitle, this.savedNodes, this.savedConnections,
          this.refCurves, this.description, this.nextNodeId, thumbnail64, bindess,
          this.roadmapArticles, this.roadmapEssays)
          .then(() => {
            this.$Notice.success({ title: `Roadmap saved, id: ${this.roadMapId}` });
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      }
    },
    handleOpenEssay() {
      this.$router.push({
        path: '/essayReader',
        query: { selected: this.curNode.category_id },
      });
    },
    handleClkBindEssay() {
      if (!this.hasBindEssay) {
        // 新建随笔
        reqSingle('/api/essays/', 'POST',
          {
            title: `随笔：${this.roadMapTitle}`,
            text: JSON.stringify({
              bindRoadmap: this.roadMapId,
              refRoadmap: this.roadMapId,
              content: '',
            }),
          },
        ).then((res) => {
          // 先保存路书
          this.text.bindEssay = res.data.id;
          this.createOrUpdate(this.text.thumbnail);
          this.$Message.info('创建成功! id=', res.data.id);
          this.$router.push({
            path: '/essayEditor',
            query: { selected: res.data.id },
          });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else {
        getEssay(this.text.bindEssay).then(() => {
          // 先保存路书
          this.createOrUpdate(this.text.thumbnail);
          this.$router.push({
            path: '/essayEditor',
            query: { selected: this.text.bindEssay },
          });
        }).catch(() => {
          this.$Modal.error({ title: `Essay ${this.text.bindEssay} not found` });
          this.text.bindEssay = -1;
        });
      }
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
    margin-bottom: 5px;
    margin-left: 40px;
    margin-right: 40px;
  }
  #help-icon{
    margin-left: 40px;
    margin-right: 40px;
  }
  .ghost {
    display: none;
  }
</style>
