import React, { createContext, useContext, useMemo } from 'react';
import { App as AntApp } from 'antd';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export const ToastProvider = ({ children }) => {
  const { message, notification } = AntApp.useApp();

  const api = useMemo(() => ({
    success: (content, options = {}) => {
      notification.success({
        message: options.title || 'Thành công',
        description: content,
        placement: options.placement || 'topRight',
        duration: options.duration ?? 3,
      });
    },
    error: (content, options = {}) => {
      notification.error({
        message: options.title || 'Có lỗi xảy ra',
        description: content,
        placement: options.placement || 'topRight',
        duration: options.duration ?? 4,
      });
    },
    info: (content, options = {}) => {
      notification.info({
        message: options.title || 'Thông báo',
        description: content,
        placement: options.placement || 'topRight',
        duration: options.duration ?? 3,
      });
    },
    warning: (content, options = {}) => {
      notification.warning({
        message: options.title || 'Cảnh báo',
        description: content,
        placement: options.placement || 'topRight',
        duration: options.duration ?? 3,
      });
    },
    loading: (content, options = {}) => {
      const key = options.key || `toast_${Date.now()}`;
      message.open({ type: 'loading', content, key, duration: 0 });

      return key;
    },
    dismiss: (key) => {
      if (key) {
        message.destroy(key);
      } else {
        message.destroy();
      }
    },
  }), [message, notification]);

  return (
    <ToastContext.Provider value={api}>
      {children}
    </ToastContext.Provider>
  );
};


