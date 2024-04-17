import type PersonData from "../1c/User";

type Pyramid = {
  id: string;
  agent: PersonData;
  city: string;
  address: string;
  tel: string;
  manager: PersonData;
};

export default Pyramid;
