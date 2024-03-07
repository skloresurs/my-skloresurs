type CarData = {
  id: string;
  name: string;
  address: string;
  distance: {
    text: string;
    value: number;
  };
  time: {
    text: string;
    value: number;
  };
};

export default CarData;
