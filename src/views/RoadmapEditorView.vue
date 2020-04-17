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
      <div :style="{height: '500px', width: '500'}">
        <!--        <p>{{$store.state.example}}</p>-->
        <!--        <p>{{$store.getters.getFirstTxtArr}}</p>-->
        <!--  add content here  -->
        <mindmap
          :nodes="nodes"
          :connections="connections"
          :editable="true"
          :key="repaint"
        />
      </div>
    </Content>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            工具栏
          </template>
          <AddNodeForm @node-added="handleNodeAdded"></AddNodeForm>
          <MenuItem name="1-2">Option 2</MenuItem>
          <MenuItem name="1-3">Option 3</MenuItem>

          <MenuItem name="2-1">Option 1</MenuItem>
          <MenuItem name="2-2">Option 2</MenuItem>

          <MenuItem name="3-1">Option 1</MenuItem>
          <MenuItem name="3-2">Option 2</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
  </Layout>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import AddNodeForm from '../components/AddNodeForm';

Vue.prototype._ = _;

export default {
  name: 'RoadmapEditor',
  components: {
    AddNodeForm,
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
          fy: -659.1641376795345,
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
      this.nodes.push(
        {
          text: nodeInfo.nodeName,
          url: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: 'mindmap',
        },
      );
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
