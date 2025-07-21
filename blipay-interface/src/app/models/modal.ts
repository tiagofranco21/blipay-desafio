export type ModalType = 'success' | 'danger' | 'info' | 'warning';

export interface ModalData {
  visible: boolean;
  title: string;
  message: string;
  type: ModalType;
}
