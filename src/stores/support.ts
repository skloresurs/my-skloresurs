import { TawkAPI } from '@tawk.to/tawk-messenger-react';
import { createRef } from 'react';
import { create } from 'zustand';

interface IStore {
  supportRef: React.RefObject<TawkAPI>;
}

const useSupportStore = create<IStore>(() => ({
  supportRef: createRef<TawkAPI>(),
}));

export default useSupportStore;
