const getFileName = (metaUrl) => {
  return new URL(metaUrl).pathname.split("/").pop();
};

export default getFileName;
