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
      nodes: [{
        text: 'python',
        url: 'http://www.wikiwand.com/en/Python_(programming_language)',
        fx: -13.916222252976013,
        fy: -659.1641376795345,
        nodes: [{
          text: '',
          url: 'https://www.reddit.com/r/Python/',
          fx: 176.083777747024,
          fy: -665.1641376795345,
          nodes: [],
          category: 'reddit',
          color: 'rgba(255, 189, 10, 1.0)',
        },
        {
          text: 'source',
          note: 'original python implementation in c, compiles python code into byte code and interprets the byte code in a evaluation loop',
          url: 'https://github.com/python/cpython',
          fx: 176.083777747024,
          fy: -625.1641376795345,
          nodes: [],
          category: 'github',
          color: 'rgba(36, 170, 255, 1.0)',
        },
        ],
        category: 'wiki',
      },
      {
        text: 'help',
        url: '',
        fx: 154.3247731601375,
        fy: -429.73700786748157,
        nodes: [{
          text: 'awesome python',
          url: 'https://github.com/vinta/awesome-python',
          fx: 291.3247731601375,
          fy: -546.2370078674815,
          nodes: [],
          category: 'github',
          color: 'rgba(175, 54, 242, 1.0)',
        },
        {
          text: 'awesome asyncio',
          url: 'https://github.com/timofurrer/awesome-asyncio',
          fx: 291.3247731601375,
          fy: -506.23700786748157,
          nodes: [],
          category: 'github',
          color: 'rgba(36, 170, 255, 1.0)',
        },
        {
          text: 'python data model',
          url: 'https://docs.python.org/3/reference/datamodel.html',
          fx: 291.3247731601375,
          fy: -466.23700786748157,
          nodes: [],
          color: 'rgba(255, 189, 10, 1.0)',
        },
        {
          text: 'python testing',
          url: 'http://pythontesting.net/framework/pytest/pytest-introduction/',
          fx: 291.3247731601375,
          fy: -432.23700786748157,
          nodes: [],
          category: 'free book',
          color: 'rgba(34, 205, 224, 1.0)',
        },
        {
          text: 'scientific python cheat sheet',
          url: 'https://ipgp.github.io/scientific_python_cheat_sheet/',
          fx: 291.3247731601375,
          fy: -392.23700786748157,
          nodes: [],
          color: 'rgba(209, 21, 88, 1.0)',
        },
        {
          text: 'structuring your project',
          url: 'http://python-guide-pt-br.readthedocs.io/en/latest/writing/structure/',
          fx: 291.3247731601375,
          fy: -358.23700786748157,
          nodes: [],
          color: 'rgba(49, 187, 71, 1.0)',
        },
        {
          text: 'style guide for python code',
          url: 'https://www.python.org/dev/peps/pep-0008/',
          fx: 291.3247731601375,
          fy: -324.23700786748157,
          nodes: [],
          color: 'rgba(175, 54, 242, 1.0)',
        },
        {
          text: 'cpython internals  ️',
          url: 'http://pgbovine.net/cpython-internals.htm',
          fx: 291.3247731601375,
          fy: -290.23700786748157,
          nodes: [],
          category: 'article',
          color: 'rgba(36, 170, 255, 1.0)',
        },
        ],
      },
      {
        text: 'articles',
        url: '',
        fx: 455.7839253819375,
        fy: -183.5539283546699,
        nodes: [{
          text: '16: the history behind the decision to move python to github  ️',
          url: 'https://snarky.ca/the-history-behind-the-decision-to-move-python-to-github/',
          fx: 617.7839253819375,
          fy: -245.0539283546699,
          nodes: [],
          category: 'article',
          color: 'rgba(175, 54, 242, 1.0)',
        },
        {
          text: '15: a modern python development toolchain  ️',
          url: 'http://www.chriskrycho.com/2015/a-modern-python-development-toolchain.html',
          fx: 617.7839253819375,
          fy: -183.0539283546699,
          nodes: [],
          category: 'article',
          color: 'rgba(36, 170, 255, 1.0)',
        },
        {
          text: '17: pythons instance, class, and static methods demystified',
          url: 'https://realpython.com/blog/python/instance-class-and-static-methods-demystified/',
          fx: 617.7839253819375,
          fy: -121.05392835466989,
          nodes: [],
          category: 'article',
          color: 'rgba(255, 189, 10, 1.0)',
        },
        ],
      },
      {
        text: 'basics',
        note: '',
        url: '',
        fx: -98.5231997717085,
        fy: -60.07462866512333,
        nodes: [{
          text: '1. the python tutorial',
          url: 'https://docs.python.org/3/tutorial/',
          fx: 83.4768002282915,
          fy: -96.57462866512333,
          nodes: [],
          color: 'rgba(255, 189, 10, 1.0)',
        },
        {
          text: '1. dive into python 3',
          url: 'http://www.diveintopython3.net',
          fx: 83.4768002282915,
          fy: -62.57462866512333,
          nodes: [],
          category: 'free book',
          color: 'rgba(175, 54, 242, 1.0)',
        },
        {
          text: '1. automate the boring stuff with python',
          url: 'https://automatetheboringstuff.com/',
          fx: 83.4768002282915,
          fy: -22.574628665123328,
          nodes: [],
          category: 'free book',
          color: 'rgba(36, 170, 255, 1.0)',
        },
        ],
      },
      {
        text: 'package manager',
        url: 'http://www.wikiwand.com/en/Package_manager',
        fx: -346.2056231217888,
        fy: 39.035120728630204,
        nodes: [],
        category: 'wiki',
      },
      {
        text: 'python libraries  ️',
        fx: -78.69331502906573,
        fy: 100.14771605920942,
        nodes: [],
        category: 'mindmap',
      },
      {
        text: 'pip',
        url: 'https://pypi.python.org/pypi/pip',
        fx: -317.77054724755226,
        fy: 153.56934975958518,
        nodes: [],
      },
      ],
      connections:
          [{
            source: 'python',
            target: 'basics',
            curve: {
              x: -43.5535,
              y: 299.545,
            },
          },
          {
            source: 'help',
            target: 'python',
            curve: {
              x: -78.1206,
              y: -114.714,
            },
          },
          {
            source: 'basics',
            target: 'python libraries  ️',
            curve: {
              x: 29.6649,
              y: 80.1111,
            },
          },
          {
            source: 'basics',
            target: 'package manager',
            curve: {
              x: -103.841,
              y: 49.5548,
            },
          },
          {
            source: 'package manager',
            target: 'pip',
            curve: {
              x: -19.7824,
              y: 57.2671,
            },
          },
          {
            source: 'articles',
            target: 'help',
            curve: {
              x: -238.287,
              y: -54.4818,
            },
          },
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
          fx: 0,
          fy: 0,
        };
      }
      _(this.nodes).forEach((node) => {
        xMax = node.fx > xMax ? node.fx : xMax;
        xMin = node.fx < xMin ? node.fx : xMin;
        yMax = node.fy > xMax ? node.fy : yMax;
        yMin = node.fy > xMin ? node.fy : yMin;
      });
      return {
        fx: (xMin + xMax) / 2,
        fy: (yMin + yMax) / 2,
      };
    },
    handleNodeAdded(nodeInfo) {
      const pos = this.getMidPos();
      console.log(pos);
      this.nodes.push(
        {
          text: nodeInfo.nodeName,
          url: nodeInfo.nodeUrl,
          fx: pos.fx,
          fy: pos.fy,
          nodes: [],
          category: 'wiki',
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
