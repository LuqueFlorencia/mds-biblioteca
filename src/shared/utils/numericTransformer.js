export const numericTransformer = {
  to: (v) => v,                // escribe tal cual
  from: (v) => (v == null ? null : parseFloat(v)) // lee como number
};