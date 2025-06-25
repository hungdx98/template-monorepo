import { ModalParams } from 'ui';

export {};

declare global {
  interface Window {
    openModal: (params: ModalParams) => void;
    closeModal: () => void;
  }

  namespace chrome {
    namespace runtime {
      type MessageSender = any;
    }
  }
}
