<template>
  <div>
    <svg class='mindmap-svg' ref='mountPoint' >
      <defs>
        <marker id="arrow"
                markerUnits="strokeWidth"
                markerWidth="10"
                markerHeight="10"
                viewBox="0 0 12 12"
                refX="25"
                refY="6"
                orient="auto">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #000000;" />
        </marker>
      </defs>
    </svg>
  </div>
</template>
<script>
/* eslint-disable no-param-reassign */
// TODO solve param reassign
import _ from 'lodash';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  event,
  // zoom,
  // zoomIdentity,
} from 'd3';

import {
  d3Nodes,
  d3Drag,
  d3DragConn,
  d3PanZoom,
  onTick, d3CustomConnections,
} from './utils/d3';

import { getDimensions, getViewBox } from './utils/dimensions';
import subnodesToHTML from './utils/subnodesToHTML';
import nodeToHTML from './utils/nodeToHTML';
import './style.sass';

export default {
  name: 'Roadmap',
  props: {
    nodes: {
      type: Array,
      default: () => ([]),
    },
    connections: {
      type: Array,
      default: () => ([]),
    },
    editable: {
      type: Boolean,
      default: false,
    },
    liveNode: {
      default: null,
    },
  },
  data() {
    return {
      simulation: null,
      clickTimeId: 0,
      curNode: this.liveNode,
      allConn: [],
    };
  },
  methods: {
    prepareNodes() {
      const render = (node) => {
        node.html = nodeToHTML(node);
        node.nodesHTML = subnodesToHTML(node.nodes);

        const dimensions = getDimensions(node.html, {}, 'mindmap-node');
        node.width = dimensions.width;
        node.height = dimensions.height;

        const nodesDimensions = getDimensions(node.nodesHTML, {}, 'mindmap-subnodes-text');
        node.nodesWidth = nodesDimensions.width;
        node.nodesHeight = nodesDimensions.height;
      };

      this.nodes.forEach(node => render(node));
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */
    prepareEditor(svg, conns, nodes, subnodes) {
      svg.on('click', () => {
        window.console.log('svg1');
        this.curNode = null;
        nodes.attr('class', n => `${n.category}-node article-node--editable`);
        conns.attr('class', (c) => {
          if (c.type === 'ref') { return 'mindmap-connection-reference'; }
          return 'mindmap-connection';
        });
        this.$emit('svg-click');
      });
      nodes
        .attr('class', (node) => {
          if (node.category === 'article') {
            return 'article-node article-node--editable';
          }
          return 'mindmap-node mindmap-node--editable';
        })
        .on('dblclick', (node) => {
          this.curNode = node;
          clearTimeout(this.clickTimeId);
          event.stopPropagation();
          this.$emit('node-dblclick', node);
        })
        .on('click', (node) => {
          window.console.log('clk node', node);
          this.curNode = node;
          nodes.attr('class', (n) => {
            if (n === node) {
              return `${n.category}-node-chosen article-node--editable`;
            }
            return `${n.category}-node article-node--editable`;
          });
          conns.attr('class', (c) => {
            if (c.type === 'ref') { return 'mindmap-connection-reference'; }
            return 'mindmap-connection';
          });
          event.stopPropagation();
          clearTimeout(this.clickTimeId);
          this.clickTimeId = setTimeout(() => {
            this.$emit('node-click', node);
          }, 250);
          window.console.log('nodeclk', this.curNode);
        });
      nodes.call(d3Drag(this.simulation, svg, nodes));
      subnodes
        .on('click', (node) => {
          window.console.log('clk sub', node);
          this.curNode = node;
          nodes.attr('class', (n) => {
            if (n === node) {
              return `${n.category}-node-chosen article-node--editable`;
            }
            return `${n.category}-node article-node--editable`;
          });
          conns.attr('class', (c) => {
            if (c.type === 'ref') { return 'mindmap-connection-reference'; }
            return 'mindmap-connection';
          });
          event.stopPropagation();
          clearTimeout(this.clickTimeId);
          this.clickTimeId = setTimeout(() => {
            this.$emit('node-click', node);
          }, 250);
          window.console.log('nodeclk', this.curNode);
        })
        .on('dblclick', (node) => {
          this.curNode = node;
          clearTimeout(this.clickTimeId);
          event.stopPropagation();
          this.$emit('subnode-dblclick', node);
        });
      conns
        .on('click', (conn) => {
          window.console.log('conn', conn);
          nodes.attr('class', n => `${n.category}-node article-node--editable`);
          conns.attr('class', (c) => {
            if (c === conn) {
              if (c.type === 'ref') { return 'mindmap-connection-reference'; }
              return 'mindmap-connection-chosen';
            }
            if (c.type === 'ref') { return 'mindmap-connection-reference'; }
            return 'mindmap-connection';
          });
          this.$emit('conn-click', conn);
          event.stopPropagation();
        });
      conns.call(d3DragConn(this.simulation, svg, conns));
      let ret = [];
      // eslint-disable-next-line
      _.forEach(conns._groups[0], (conn) => {
        ret = [...ret, {
          // eslint-disable-next-line
          source: conn.__data__.source.text,
          // eslint-disable-next-line
          target: conn.__data__.target.text,
          // eslint-disable-next-line
          curve: conn.__data__.curve,
          // eslint-disable-next-line
          type: conn.__data__.type,
        }];
      });
      this.allConn = ret;
      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      setTimeout(() => {
        this.simulation
          .alphaTarget(0.5).on('tick', () => (
            onTick(conns, nodes, subnodes)
          ));
      }, 200);
      window.console.log('wtf1', this.curNode);
      if (this.curNode) {
        window.console.log('wtf');
        nodes.attr('class', (n) => {
          if (n === this.curNode) {
            return `${n.category}-node-chosen article-node--editable`;
          }
          return `${n.category}-node article-node--editable`;
        });
      }
    },
    /**
     * Render mind map unsing D3
     */
    renderMap() {
      const svg = select(this.$refs.mountPoint);
      // Clear the SVG in case there's stuff already there.
      svg.selectAll('g').remove();

      // Add subnode group
      svg.append('g').attr('id', 'mindmap-subnodes');

      this.prepareNodes();
      // Bind data to SVG elements and set all the properties to render them
      const connections = d3CustomConnections(svg, this.connections);
      const { nodes, subnodes } = d3Nodes(svg, this.nodes);

      nodes.append('title').text(node => node.note);
      // Bind nodes and connections to the simulation
      this.simulation
        .nodes(this.nodes)
        .force('link').links(this.connections);

      if (this.editable) {
        this.prepareEditor(svg, connections, nodes, subnodes);
      }

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      onTick(connections, nodes, subnodes);

      svg.attr('viewBox', getViewBox(nodes.data()))
        .call(d3PanZoom(svg))
        .on('dblclick.zoom', null);
    },
    getConn() {
      return this.allConn;
    },
  },
  mounted() {
    this.renderMap();
  },
  updated() {
    // zoom().transform(select(this.$refs.mountPoint), zoomIdentity);

    this.renderMap();
  },
  created() {
    // Create force simulation to position nodes that have
    // no coordinate, and add it to the component state
    this.simulation = forceSimulation()
      .force('link', forceLink().id(node => node.text))
      .force('charge', forceManyBody())
      .force('collide', forceCollide().radius(100));
  },
};
</script>
