import { req } from '../apis/util';


export const createRoadmap = (roadmapTitle, nodes, connections) => req('/api/road_maps/', 'POST', {},
  { text: JSON.stringify({ nodes, connections }), title: roadmapTitle, user: 1 });

export const updateRoadmap = (id, roadmapTitle, nodes, connections) => req(`/api/road_maps/${id}/`, 'PUT', {},
  { text: JSON.stringify({ nodes, connections }), title: roadmapTitle });

export const getRoadmap = id => req(`/api/road_maps/${id}/`, 'GET');

export const updateRoadmapTitle = (id, roadmapTitle) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { title: roadmapTitle });
