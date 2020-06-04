exports.createThumbnail = (createPage, options) => {
  const { id, component, size, context } = options;
  const { width, height } = { width: 1200, height: 800, ...(size || {}) };
  const thumbnailTempPath = `__generated/thumbnails/${id}`;

  const thumbnailMetaData = { id, size: { width, height } };

  const thumbnailGenerationJob = {
    id,
    path: thumbnailTempPath,
    size: { width, height },
  };

  createPage({
    path: thumbnailTempPath,
    component: component,
    context: {
      ...context,
      thumbnail: thumbnailMetaData,
      __thumbnailGenerationContext: thumbnailGenerationJob,
    },
  });

  if (options.emitCreationDetails) {
    return { thumbnailGenerationJob, thumbnailMetaData };
  }
};