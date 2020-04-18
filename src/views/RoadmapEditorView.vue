<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            文献栏
          </template>
          <MenuItem name="1-1">Option 1</MenuItem>
          <MenuItem name="1-2">Option 2</MenuItem>
          <MenuItem name="1-3">Option 3</MenuItem>
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
    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
        <!--        <p>{{$store.state.example}}</p>-->
        <!--        <p>{{$store.getters.getFirstTxtArr}}</p>-->
        <!--  add content here  -->
      <mindmap
        :nodes="nodes"
        :connections="connections"
        :editable="true"
        :key="repaint"
      />
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
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
            :node-name-list='nodeNameList'>
          </AddCommentForm>
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

Vue.prototype._ = _;

export default {
  name: 'RoadmapEditor',
  components: {
    AddNodeForm,
    AddConnectionForm,
    DelNodeForm,
    DelConnectionForm,
    AddCommentForm,
  },
  data() {
    return {
      repaint: 1,
      nodes: [
      ],
      connections:
          [
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
    handleNodeAdded(nodeInfo) {
      const pos = this.getMidPos();
      this.nodes = [...this.nodes,
        {
          text: nodeInfo.nodeName,
          URI: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: 'mindmap',
        }];
      this.repaintMindMap();
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
    repaintMindMap() {
      this.repaint += 1;
    },
  },
};
</script>

<style scoped>

</style>
