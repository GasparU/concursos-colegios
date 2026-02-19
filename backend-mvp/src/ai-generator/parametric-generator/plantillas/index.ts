import * as plantillas5to from './plantillas-5to.json';
// import * as plantillas6to from './plantillas-6to.json'; // cuando exista

export const plantillas = [
  ...((plantillas5to as any).default || plantillas5to),
  // ...(plantillas6to as any).default || plantillas6to,
];
