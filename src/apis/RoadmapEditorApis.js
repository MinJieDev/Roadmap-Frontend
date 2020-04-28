import { req } from '../apis/util';


export const createRoadmap = (roadmapTitle, nodes, connections, description) => req('/api/road_maps/', 'POST', {},
  { text: JSON.stringify({ nodes, connections }), title: roadmapTitle, user: 1, description });

export const updateRoadmap = (id, roadmapTitle, nodes, connections, description) => req(`/api/road_maps/${id}/`, 'PUT', {},
  { text: JSON.stringify({ nodes, connections }), title: roadmapTitle, description });

export const getRoadmap = id => req(`/api/road_maps/${id}/`, 'GET');

export const updateRoadmapTitle = (id, roadmapTitle) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { title: roadmapTitle });

export const updateRoadmapDescription = (id, roadmapDescription) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { description: roadmapDescription });

export const delRoadmap = id => req(`/api/road_maps/${id}/`, 'DELETE');
