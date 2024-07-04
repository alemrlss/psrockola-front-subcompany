export const formatExpirationDate = (isoDate) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(isoDate).toLocaleDateString("es-ES", options);
};

export const formatDate = (isoDate) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  return new Date(isoDate).toLocaleDateString("es-ES", options);
};
