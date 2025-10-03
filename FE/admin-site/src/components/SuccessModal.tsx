import React from 'react';
import { Modal } from 'antd';

export type SuccessModalProps = {
	open: boolean;
	title?: string;
	message?: React.ReactNode;
	onOk?: () => void;
	onCancel?: () => void;
	okText?: string;
};

const SuccessModal: React.FC<SuccessModalProps> = ({
	open,
	title = 'Thành công',
	message = 'Thao tác đã được thực hiện thành công.',
	onOk,
	onCancel,
	okText = 'OK',
}) => {
	return (
		<Modal
			open={open}
			onOk={onOk}
			onCancel={onCancel}
			title={<span className="text-green-700">{title}</span>}
			okText={okText}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ className: 'bg-green-600 hover:bg-green-700' }}
		>
			<div className="text-gray-700">{message}</div>
		</Modal>
	);
};

export default SuccessModal;
