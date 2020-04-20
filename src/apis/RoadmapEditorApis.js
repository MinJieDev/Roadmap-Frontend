import { req } from '../apis/util';

function stringFormat() {
  if (arguments.length === 0) { return null; }
  // eslint-disable-next-line prefer-rest-params
  let str = arguments[0];
  for (let i = 1; i < arguments.length; i += 1) {
    const re = new RegExp(`\\{${i - 1}\\}`, 'gm');
    // eslint-disable-next-line prefer-rest-params
    str = str.replace(re, arguments[i]);
  }
  return str;
}

export const createRoadmap = (nodes, connections) => req('/api/road_maps/', 'POST', {},
  { text: JSON.stringify({ nodes, connections }), user: 1 });

export const updateRoadmap = (id, nodes, connections) => req(stringFormat('/api/road_maps/{0}/', id), 'PUT', {},
  { text: JSON.stringify({ nodes, connections }), user: 1 });

export const getRoadmap = id => req(stringFormat('/api/road_maps/{0}/', id), 'GET');
