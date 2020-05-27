import { reqSingle } from '../apis/util';

// export const createMDnote = (title, note) => req('/api/essays/',
//   'POST', {}, { title, text: note });

export const deleteEssay = id => reqSingle(`api/essays/${id}/`, 'DELETE');

export const changeEssay = data => reqSingle(`api/essays/${data.id}/`, 'PATCH', data);
