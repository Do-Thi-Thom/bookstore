import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger',
}) => {
  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-red-500';
    }
  };

  const getConfirmButtonProps = () => {
    switch (type) {
      case 'danger':
        return { className: 'bg-red-600 hover:bg-red-700 text-white border-0' };
      case 'warning':
        return { className: 'bg-yellow-600 hover:bg-yellow-700 text-white border-0' };
      case 'info':
        return { className: 'bg-blue-600 hover:bg-blue-700 text-white border-0' };
      default:
        return { className: 'bg-red-600 hover:bg-red-700 text-white border-0' };
    }
  };

  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className={getIconColor()} />
          <span className="text-gray-800">{title}</span>
        </div>
      }
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={getConfirmButtonProps()}
      cancelButtonProps={{ className: 'border-gray-300 text-gray-700' }}
    >
      <div className="text-gray-700">{message}</div>
    </Modal>
  );
};

export default ConfirmModal;
