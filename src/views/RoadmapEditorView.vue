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
          <draggable
            class="dragArea list-group"
            :list="articles"
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
        @change="handleArticleDraggedIn"
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
        导出为图片
        <Icon type="ios-share" />
      </Button>
      <Button type="warning" @click="handleClkSaveRoadmap"
              class="b-ro">
        保存路书
        <Icon type="md-cloud-upload" />
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
import ModifyNodeForm from '../components/ModifyNodeForm';
import FileItem from '../components/FileItem';
import NoteMarkdown from '../components/NoteMarkdown';
import { reqSingle } from '../apis/util';
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
    ModifyNodeForm,
    NoteMarkdown,
    draggable,
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
      curNode: null,
      curConn: null,
      modeConnectionChoosing: false,
      nextNodeId: 1,
      refCurves: [
      ],
      roadmapDragArticleList: [
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
        if (node.category === 'article') {
          saveTxt = `$${this.getArticleIdByTitle(node.content)}`;
        }
        ret = [...ret, {
          text: node.text,
          content: saveTxt,
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
      if (this.getArticleByTitle(this.curNode.content).note) {
        return this.getArticleByTitle(this.curNode.content).note;
      }
      return '';
    },
  },
  mounted() {
    // GET articles for l-sider
    reqSingle('/api/articles/', 'GET', { page: 1 }).then((res1) => {
      this.articles = res1.data.results;
      // load roadMap if has query
      if ((typeof (this.$route.query.selected) !== 'undefined') &&
        (String(this.$route.query.selected) !== '-1')) {
        this.roadMapId = this.$route.query.selected;
        getRoadmap(this.roadMapId)
          .then((res) => {
            this.nodes = this.toDisplayNodes(JSON.parse(res.data.text).nodes);
            this.connections = this.toDisplayConnections(JSON.parse(res.data.text).connections);
            this.refCurves = JSON.parse(res.data.text).refConnections;
            this.roadMapTitle = res.data.title;
            this.description = res.data.description;
            this.nextNodeId = JSON.parse(res.data.text).nextNodeId;
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
  created() {
    // 监控键盘事件
    document.onkeydown = (e) => {
      if (this.$route.name !== 'Editor') return;
      window.console.log('但是噶', e);
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
      this.nodes = [...this.nodes,
        {
          text: `#${this.nextNodeId}`, // 为#nodeId，保证不重名
          content: nodeInfo.nodeName,
          URI: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: category || 'mindmap',
        }];
      this.nextNodeId += 1;
      this.refCurves = this.getCurves();
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
      this.refCurves = this.getCurves();
      this.repaintMindMap();
    },
    handleArticleNodeAdded(nodeInfo) {
      this.handleNodeAdded(nodeInfo, 'article');
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
      this.refCurves = this.getCurves();
      this.repaintMindMap();
    },
    handleNodeDeleted() {
      this.nodes = _.filter(this.nodes, node => node.text !== this.curNode.text);
      this.connections = _.filter(this.connections, connection =>
        (connection.source.text !== this.curNode.text
          && connection.target.text !== this.curNode.text));
      this.curNode = null;
      this.$Notice.success({ title: 'node deleted' });
      this.refCurves = this.getCurves();
      this.repaintMindMap();
    },
    handleConnectionAdded(connectionInfo) {
      this.connections = [...this.connections, {
        source: connectionInfo.sourceNode,
        target: connectionInfo.targetNode,
      }];
      this.refCurves = this.getCurves();
      this.repaintMindMap();
    },
    handleConnectionDeleted() {
      this.connections = _.filter(this.connections, connection => !(
        (connection.source.text === this.curConn.source.text
                  && connection.target.text === this.curConn.target.text)));
      this.curConn = null;
      this.$Notice.success({ title: 'connection deleted' });
      this.refCurves = this.getCurves();
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
      this.refCurves = this.getCurves();
      this.repaintMindMap();
    },
    handleCommentDeleted() {
      _.forEach(this.nodes, (node) => {
        if (node.text === this.curNode.text) {
          // eslint-disable-next-line no-param-reassign
          node.nodes = [];
        }
      });
      this.refCurves = this.getCurves();
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
    repaintMindMap() {
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
    getArticleByTitle(title) {
      return _(this.articles).find(art => art.title === title);
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
          const art = this.getArticleById(_.split(node.content, '$', 2)[1]);
          if (typeof art !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            node.content = art.title;
            // eslint-disable-next-line no-param-reassign
            node.URI = art.url;
          } else {
            // eslint-disable-next-line no-param-reassign
            node.category = 'mindmap';
            // eslint-disable-next-line no-param-reassign
            node.content += ': article not found';
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
          .startsWith('http://')) {
          window.open(`http://${this.curNode.URI}`, '_blank');
        }
        window.open(this.curNode.URI, '_blank');
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
        window.console.log('pass');
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
        query: { selected: this.getArticleIdByTitle(this.curNode.content) },
      });
    },
    handleArticleDraggedIn(evt) {
      this.handleNodeAdded({
        nodeName: evt.added.element.title,
        articleId: evt.added.element.id,
        nodeUrl: evt.added.element.url,
      }, 'article');
      window.console.log(evt);
    },
    getRoadmapThumbnail() {
      return domtoimage.toPng(document.getElementById('target'));
    },
    createOrUpdate(thumbnail64) {
      // id ==
      if (this.roadMapId === -1) {
        createRoadmap(this.roadMapTitle, this.savedNodes, this.savedConnections,
          this.refCurves, this.description, this.nextNodeId, thumbnail64)
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
        updateRoadmap(this.roadMapId, this.roadMapTitle, this.savedNodes, this.savedConnections,
          this.refCurves, this.description, this.nextNodeId, thumbnail64)
          .then(() => {
            this.$Notice.success({ title: `Roadmap saved, id: ${this.roadMapId}` });
          })
          .catch((err) => {
            pushErr(this, err, true);
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
