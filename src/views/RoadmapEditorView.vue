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
          <AddConnectionForm @connection-added="handleConnectionAdded"></AddConnectionForm>
          <DelNodeForm @node-deleted="handleNodeDeleted"></DelNodeForm>
          <DelConnectionForm @connection-deleted="handleConnectionDeleted"></DelConnectionForm>
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

Vue.prototype._ = _;

export default {
  name: 'RoadmapEditor',
  components: {
    AddNodeForm,
    AddConnectionForm,
    DelNodeForm,
    DelConnectionForm,
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
          url: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: 'mindmap',
        }];
      this.repaintMindMap();
    },
    handleNodeDeleted(nodeInfo) {
      _.remove(this.nodes, node => node.text === nodeInfo.nodeName);
      _.remove(this.connections, connection => (connection.source.text === nodeInfo.nodeName
          || connection.target.text === nodeInfo.nodeName));
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
      _.remove(this.connections, connection => (
        (connection.source.text === connectionInfo.node1
                  && connection.target.text === connectionInfo.node2)
        || (connection.target.text === connectionInfo.node1
                  && connection.source.text === connectionInfo.node2)));
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
