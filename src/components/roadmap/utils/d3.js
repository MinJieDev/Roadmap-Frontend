/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import { drag, event, zoom } from 'd3';
import { getViewBox } from './dimensions';
/**
 * Bind data to a <TAG>, inside a G element, inside the given root element.
 * Root is a D3 selection, data is an object or array, tag is a string.
 */
const bindData = (root, data, tag) => (
  root.append('g')
    .selectAll(tag)
    .data(data)
    .enter()
    .append(tag)
);

/**
 * Bind connections to PATH tags on the given SVG
 */
export const d3Connections = (svg, connections) => {
  window.console.warn('d3Connections is Deprecated. Use d3CustomConnections instead.');
  return bindData(svg, connections, 'path')
    .attr('class', 'mindmap-connection');
};

export const d3CustomConnections = (svg, connections) => {
  const refConn = _.filter(connections, conn => conn.type === 'ref');
  const simpleConn = _.filter(connections, conn => conn.type !== 'ref');

  const refSelections = bindData(svg, refConn, 'path')
    .attr('class', 'mindmap-connection-reference');
  const simpleSelections = bindData(svg, simpleConn, 'path')
    .attr('class', 'mindmap-connection');

  const selections = simpleSelections;
  selections._groups = [_.flattenDeep(_.map([refSelections, simpleSelections], '_groups'))];
  return selections;
};

/* eslint-disable no-param-reassign */
/**
 * Bind rodes to FOREIGNOBJECT tags on the given SVG,
 * and set dimensions and html.
 */
export const d3Nodes = (svg, nodes) => {
  window.console.warn('d3Nodes is Deprecated. Use d3CustomNodes instead.');
  const selection = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .enter();

  window.console.log('selection', selection);

  const d3nodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-node')
    .attr('width', node => node.width + 4)
    .attr('height', node => node.height)
    .html(node => node.html);

  window.console.log(d3nodes);

  const d3subnodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-subnodes')
    .attr('width', node => node.nodesWidth + 4)
    .attr('height', node => node.nodesHeight)
    .html(node => node.nodesHTML);

  return {
    nodes: d3nodes,
    subnodes: d3subnodes,
  };
};

export const d3CustomNodes = (svg, nodes) => {
  const articleNode = _.filter(nodes, node => node.category === 'article');
  const mindmapNode = _.filter(nodes, node => node.category !== 'article');

  window.console.log('articleNode', articleNode);
  window.console.log('mindmapNode', mindmapNode);

  const articleSelection = svg.append('g')
    .selectAll('foreignObject')
    .data(articleNode)
    .enter();

  const mindmapSelection = svg.append('g')
    .selectAll('foreignObject')
    .data(mindmapNode)
    .enter();

  window.console.log('articleSelection', articleSelection);
  window.console.log('mindmapSelection', mindmapSelection);

  const d3articleNodes = articleSelection
    .append('foreignObject')
    .attr('class', 'article-node')
    .attr('width', node => node.width + 4)
    .attr('height', node => node.height)
    .html(node => node.html);

  const d3mindmapNodes = mindmapSelection
    .append('foreignObject')
    .attr('class', 'mindmap-node')
    .attr('width', node => node.width + 4)
    .attr('height', node => node.height)
    .html(node => node.html);

  window.console.log('d3articleNodes', d3articleNodes);
  window.console.log('d3mindmapNodes', d3mindmapNodes);

  const selection = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .enter();

  // window.console.log('selection', selection);
  //
  // const d3nodes = selection
  //   .append('foreignObject')
  //   .attr('class', 'mindmap-node')
  //   .attr('width', node => node.width + 4)
  //   .attr('height', node => node.height)
  //   .html(node => node.html);
  const d3nodes = d3mindmapNodes;
  // const tmp = JSON.stringify(d3mindmapNodes);
  // // const d3nodes = JSON.parse(tmp);
  // _(d3articleNodes._groups[0]).forEach((node) => {
  //   window.console.log(node.classList.value);
  //   node.classList.value = 'article-node';
  //   node.className.baseVal = 'article-node';
  //   node.className.animVal = 'article-node';
  // });
  window.console.log(_.map([d3mindmapNodes, d3articleNodes], '_groups'));
  window.console.log(_.flattenDeep(_.map([d3mindmapNodes, d3articleNodes], '_groups')));
  d3nodes._groups = [_.flattenDeep(_.map([d3mindmapNodes, d3articleNodes], '_groups'))];
  // d3nodes._groups[0] = [...(d3mindmapNodes._groups[0]), ...(d3articleNodes._groups[0])];

  window.console.log('d3nodes', d3nodes);

  window.console.log('selection', selection);

  const d3subnodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-subnodes')
    .attr('width', node => node.nodesWidth + 4)
    .attr('height', node => node.nodesHeight)
    .html(node => node.nodesHTML);

  return {
    nodes: d3nodes,
    subnodes: d3subnodes,
  };
};

/**
 * Callback for forceSimulation tick event.
 */
export const onTick = (conns, nodes, subnodes) => {
  const d = conn => [
    'M',
    conn.source.x,
    conn.source.y,
    'Q',
    conn.source.x + (conn.curve && conn.curve.x ? conn.curve.x : 0),
    conn.source.y + (conn.curve && conn.curve.y ? conn.curve.y : 0),
    ',',
    conn.target.x,
    conn.target.y,
  ].join(' ');

  // Set the connections path.
  conns.attr('d', d);

  // Set nodes position.
  nodes
    .attr('x', node => node.x - (node.width / 2))
    .attr('y', node => node.y - (node.height / 2));

  // Set subnodes groups color and position.
  subnodes
    .attr('x', node => node.x + (node.width / 2))
    .attr('y', node => node.y - (node.nodesHeight / 2));
};

/*
 * Return drag behavior to use on d3.selection.call().
 */
export const d3Drag = (simulation, svg, nodes) => {
  const dragStart = (node) => {
    if (!event.active) {
      simulation.alphaTarget(0.2).restart();
    }

    node.fx = node.x;
    node.fy = node.y;
  };

  const dragged = (node) => {
    node.fx = event.x;
    node.fy = event.y;
  };

  const dragEnd = () => {
    if (!event.active) {
      simulation.alphaTarget(0);
    }

    svg.attr('viewBox', getViewBox(nodes.data()));
  };

  return drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd);
};

/* eslint-enable no-param-reassign */

/*
 * Return pan and zoom behavior to use on d3.selection.call().
 */
export const d3PanZoom = el => (
  zoom().scaleExtent([0.3, 5])
    .on('zoom', () => (
      el.selectAll('svg > g').attr('transform', event.transform)
    ))
);
