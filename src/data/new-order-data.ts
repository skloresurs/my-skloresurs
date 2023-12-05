import { SegmentedControlItem } from '@mantine/core';

import { ICamera, IFilm, IGlass } from '@/types/VisualizationData';

// Default values for glass
const defaultGlass: IGlass = {
  category: 'glass',
  coating: '',
  edge: '',
  facet: 0,
  nomenclature: '',
  sandblast: '',
  thickness: 0,
  type: '',
};

// Default values for film
const defaultFilm: IFilm = {
  category: 'film',
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
  data: (IGlass | IFilm | ICamera)[];
})[] = [
  {
    data: [defaultGlass],
    label: 'Моноскло',
    value: 'mono',
  },
  {
    data: [defaultGlass, defaultFilm, defaultGlass],
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

export { defaultCamera, defaultFilm, defaultGlass, glassTypeData };
