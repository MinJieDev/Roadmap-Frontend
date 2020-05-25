import { req } from '../apis/util';


export const createRoadmap = (roadmapTitle, nodes, connections, refConnections, description, nextNodeId) => req('/api/road_maps/', 'POST', {},
  { text: JSON.stringify({ nodes, connections, refConnections, nextNodeId }),
    title: roadmapTitle,
    description,
  });

export const updateRoadmap = (id, roadmapTitle, nodes, connections, refConnections, description, nextNodeId) => req(`/api/road_maps/${id}/`, 'PUT', {},
  { text: JSON.stringify({ nodes, connections, refConnections, nextNodeId }),
    title: roadmapTitle,
    description,
  });

export const getRoadmap = id => req(`/api/road_maps/${id}/`, 'GET');

export const updateRoadmapTitle = (id, roadmapTitle) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { title: roadmapTitle });

export const updateRoadmapDescription = (id, roadmapDescription) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { description: roadmapDescription });

export const delRoadmap = id => req(`/api/road_maps/${id}/`, 'DELETE');

export const postRoadmapShareLink = id => req('/api/share/roadmap/', 'POST', {}, { id });

export const getRoadmapShareLink = id => req(`/api/share/roadmap/${id}`, 'GET');

export const updateTag = (tag, roadMap) => req('/api/tags/', 'POST', {}, { name: tag, roadmaps: roadMap });

export const getTags = () => req('/api/tags', 'GET');
