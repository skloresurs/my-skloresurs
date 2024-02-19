import IManaderOrder from '@/types/ManagerOrder';

const DefaultManagerOrder: IManaderOrder = {
  id: '000000',
  server: 'main',
  responsible: null,
  manager: null,
  agent: null,
  contact: null,
  createdAt: '2024/01/01 00:00:00',
  shipmentAt: '2024/01/01 00:00:00',
  status: '',
  location: 'ЛокаціяЛокаціяЛокаціяЛокаціяЛокація',
  locked: true,
  lockedComment: '',
  finance: {
    bill: '0000000000',
    total: 100_000,
    pay: 100_000,
    final: 0,
    currency: 'грн.',
  },
};

export default DefaultManagerOrder;
