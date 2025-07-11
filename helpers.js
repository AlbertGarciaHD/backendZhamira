export const generarKey = (id, nombreUsuario) => {
  const nombreLimpio = nombreUsuario.toLowerCase().replace(/\s+/g, "");
  return `${id}_${nombreLimpio}`;
};