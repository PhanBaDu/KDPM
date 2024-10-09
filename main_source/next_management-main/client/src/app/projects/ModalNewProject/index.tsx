import Modal from '@/components/Modal';
import { useCreateProjectMutation } from '@/state/api';
import { formatISO } from 'date-fns';
import { useState } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

type Error = {
    message: string;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [resError, setResError] = useState<Error>();

    const handleSubmit = async () => {
        if (!projectName || !startDate || !endDate) return;

        const formattedStartDate = formatISO(new Date(startDate), {
            representation: 'complete',
        });
        const formattedEndDate = formatISO(new Date(endDate), {
            representation: 'complete',
        });

        try {
            const result = await createProject({
                name: projectName,
                description,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });

            if (result.error) {
                if ('data' in result.error) {
                    const errorData = result.error.data as Error;
                    setResError({ message: errorData.message });
                    return;
                }
            }

            if (result.data) {
                onClose();
                // [REFRESH INPUT]
                setProjectName('');
                setDescription('');
                setStartDate('');
                setEndDate('');
                setResError(undefined);
            }
        } catch (error) {}
    };

    const isFormValid = () => {
        return projectName && description && startDate && endDate;
    };

    const inputStyles =
        'w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none';

    return (
        <Modal
            setResError={setResError}
            setProjectName={setProjectName}
            setDescription={setDescription}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            isOpen={isOpen}
            onClose={onClose}
            name="Create New Project"
        >
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                {resError && <h1 className="text-red-500">{resError.message}</h1>}
                <button
                    type="submit"
                    className={`focus-offset-2 bg-blue-primary mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        !isFormValid() || isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Project'}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewProject;