type GpsData = {
  object_id: string;
  datetime: string;
  position: {
    latitude: string;
    longitude: string;
    speed: string;
  };
};

export default GpsData;
