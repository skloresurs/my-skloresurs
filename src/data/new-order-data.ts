import { SegmentedControlItem } from '@mantine/core';

import { ICamera, IGlass, IPellicle } from '@/types/VisualizationData';

// Default values for glass
const defaultGlass: IGlass = {
  category: 'glass',
  coating: '',
  edge: '',
  facet: 0,
  nomenclature: '000000005',
  sandblast: '',
  thickness: '4mm',
  type: '',
};

// Default values for pellicle
const defaultPellicle: IPellicle = {
  category: 'pellicle',
  type: '',
};

// Default values for camera
const defaultCamera: ICamera = {
  category: 'camera',
  gas: '',
  nomenclature: '',
  thickness: 0,
  type: '',
};

// Data for glass type
const glassTypeData: (SegmentedControlItem & {
  data: (IGlass | IPellicle | ICamera)[];
})[] = [
  {
    data: [defaultGlass],
    label: 'Моноскло',
    value: 'mono',
  },
  {
    data: [defaultGlass, defaultPellicle, defaultGlass],
    label: 'Тріплекс',
    value: 'triplex',
  },
  {
    data: [defaultGlass, defaultCamera, defaultGlass],
    label: 'Однокамерний склопакет',
    value: 'single',
  },
  {
    data: [
      defaultGlass,
      defaultCamera,
      defaultGlass,
      defaultCamera,
      defaultGlass,
    ],
    label: 'Двокамерний склопакет',
    value: 'double',
  },
  {
    data: [
      defaultGlass,
      defaultCamera,
      defaultGlass,
      defaultCamera,
      defaultGlass,
      defaultCamera,
      defaultGlass,
    ],
    label: 'Трикамерний склопакет',
    value: 'triple',
  },
];

export { defaultCamera, defaultGlass, defaultPellicle, glassTypeData };
