import Modal from '@/components/Modal';
import { Priority, Status, useCreateTaskMutation, useGetUsersQuery, User } from '@/state/api';
import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { Check } from 'lucide-react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
};

type Error = {
    message: string;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
    const { data: users } = useGetUsersQuery();

    const [createTask, { isLoading }] = useCreateTaskMutation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Backlog);
    const [tags, setTags] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [authorUserId, setAuthorUserId] = useState('1');
    const [assignedUserId, setAssignedUserId] = useState('');
    const [projectId, setProjectId] = useState('');

    const [assignedId, setAssignedId] = useState<number | undefined>();
    const [listUsername, setListUsername] = useState<User[]>();

    const [resError, setResError] = useState<Error>();

    useEffect(() => {
        if (assignedUserId.length > 2) {
            const listuser = users?.filter((user) => {
                return (
                    user.username.toLowerCase().includes(assignedUserId.toLowerCase()) &&
                    user.teamId === 1
                );
            });

            if (listuser && listuser.length > 0) {
                setAssignedId(listuser[0].userId);
            } else {
                setAssignedId(undefined);
            }

            setListUsername(listuser);
        } else {
            setListUsername([]);
            setAssignedId(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedUserId]);

    const handleSubmit = async () => {
        // [FORMAT DATE]
        const formattedStartDate = formatISO(new Date(startDate), {
            representation: 'complete',
        });
        const formattedDueDate = formatISO(new Date(dueDate), {
            representation: 'complete',
        });

        try {
            // [NEW TASK]
            const result = await createTask({
                title,
                description,
                status,
                priority,
                tags,
                startDate: formattedStartDate,
                dueDate: formattedDueDate,
                authorUserId: parseInt(authorUserId),
                assignedUserId: assignedId,
                projectId: id !== null ? Number(id) : Number(projectId),
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
                setTitle('');
                setDescription('');
                setStatus(Status.ToDo);
                setPriority(Priority.Backlog);
                setTags('');
                setStartDate('');
                setDueDate('');
                setAuthorUserId('1');
                setAssignedUserId('');
                setAssignedId(undefined);
                setResError(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // [CHECK INPUT]
    const isFormValid = () => {
        return (
            title &&
            description &&
            status &&
            priority &&
            tags &&
            startDate &&
            dueDate &&
            authorUserId &&
            assignedUserId &&
            assignedId
        );
    };

    const selectStyles =
        'mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none';

    const inputStyles =
        'w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none';

    return (
        <Modal
            setResError={setResError}
            setAssignedId={setAssignedId}
            setTitle={setTitle}
            setDescription={setDescription}
            setStatus={setStatus}
            setPriority={setPriority}
            setTags={setTags}
            setStartDate={setStartDate}
            setDueDate={setDueDate}
            setAuthorUserId={setAuthorUserId}
            setAssignedUserId={setAssignedUserId}
            isOpen={isOpen}
            onClose={onClose}
            name="Create New Task"
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
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <select
                        className={selectStyles}
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                    >
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.WorkInProgress}>Work In Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                    <select
                        className={selectStyles}
                        value={priority}
                        onChange={(e) =>
                            setPriority(Priority[e.target.value as keyof typeof Priority])
                        }
                    >
                        <option value={Priority.Urgent}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Backlog}>Backlog</option>
                    </select>
                </div>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
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
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    className={`${inputStyles} text-sky-500`}
                    placeholder="Author User ID"
                    value={`${authorUserId === '1' && 'Phan Ba Du'}`}
                    onChange={(e) => setAuthorUserId(e.target.value)}
                    disabled={true}
                />
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Assigned User ID"
                    onChange={(e) => setAssignedUserId(e.target.value)}
                />
                {listUsername?.length !== 0 && (
                    <div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold underline">List of job recipients:</h1>
                            <span className="no-underlin1 flex gap-1">
                                only assign work to <p className="font-semibold underline">one</p>{' '}
                                person
                            </span>
                        </div>
                        {listUsername?.map((user) => (
                            <ul className="pl-5" key={user.userId}>
                                <li className="flex items-center gap-3 text-sky-500">
                                    {user.username}
                                    <Check className="h-5 w-5" />
                                </li>
                            </ul>
                        ))}
                    </div>
                )}
                {listUsername?.length === 0 && assignedUserId.length > 3 && (
                    <h1 className="text-red-500">This person was not found in the team.</h1>
                )}
                {resError && <h1 className="text-red-500">{resError.message}</h1>}
                {id === null && (
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder="ProjectId"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    />
                )}
                <button
                    type="submit"
                    className={`focus-offset-2 bg-blue-primary mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        !isFormValid() || isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;
