import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import { X } from 'lucide-react';
import { Priority, Status } from '@/state/api';

type Props = {
    setEndDate?: (i: string) => void;
    setProjectName?: (i: string) => void;
    setResError?: (i: undefined) => void;
    setAssignedId?: (i: number | undefined) => void;
    setTitle?: (i: string) => void;
    setDescription?: (i: string) => void;
    setStatus?: (i: Status) => void;
    setPriority?: (i: Priority) => void;
    setTags?: (i: string) => void;
    setStartDate?: (i: string) => void;
    setDueDate?: (i: string) => void;
    setAuthorUserId?: (i: string) => void;
    setAssignedUserId?: (i: string) => void;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
};

const Modal = ({
    setEndDate,
    setProjectName,
    setResError,
    setAssignedId,
    setTitle,
    setDescription,
    setStatus,
    setPriority,
    setTags,
    setStartDate,
    setDueDate,
    setAuthorUserId,
    setAssignedUserId,
    children,
    isOpen,
    onClose,
    name,
}: Props) => {
    if (!isOpen) return null;

    const handleClose = () => {
        if (
            setTitle &&
            setDescription &&
            setStatus &&
            setPriority &&
            setTags &&
            setStartDate &&
            setDueDate &&
            setAuthorUserId &&
            setAssignedUserId &&
            setAssignedId &&
            setResError
        ) {
            setAssignedId(undefined);
            setTitle('');
            setDescription('');
            setStatus(Status.ToDo);
            setPriority(Priority.Backlog);
            setTags('');
            setStartDate('');
            setDueDate('');
            setAuthorUserId('1');
            setAssignedUserId('');
            setResError(undefined);
        }
        console.log(setResError);
        if (setProjectName && setDescription && setStartDate && setEndDate && setResError) {
            setProjectName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setResError(undefined);
            console.log('object');
        }

        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
            <div className="dark:bg-dark-secondary w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
                <Header
                    name={name}
                    buttonComponent={
                        <button
                            className="bg-blue-primary flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-blue-600"
                            onClick={handleClose}
                        >
                            <X size={18} />
                        </button>
                    }
                    isSmallText
                />
                {children}
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
