export const generateRandomFeature = async (centerCoordinates) => {
  const numberOfFeatures = 10;
  const features = Array.from({ length: numberOfFeatures }, (_, index) => {
    const { longitude, latitude } = getRandomCoordinate(centerCoordinates);
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        id: index,
        title: `Point #${index}`,
        description: `This is point #${index}`,
      },
    };
    return feature;
  });

  const featureCollection = {
    type: "FeatureCollection",
    features: features,
  };

  return Promise.resolve(featureCollection);
};

const getRandomCoordinate = ({
  longitude: centerLongitude,
  latitude: centerLatitude,
}) => {
  const maxRadius = 5;
  const randomRadius = Math.sqrt(Math.random()) * maxRadius;
  const randomAngle = Math.random() * 2 * Math.PI;
  const latitude = centerLatitude + randomRadius * Math.cos(randomAngle);
  const longitude = centerLongitude + randomRadius * Math.sin(randomAngle);
  return { longitude, latitude };
};
