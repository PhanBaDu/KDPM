'use client';

import { useState } from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import BoardView from '@/app/projects/BoardView';
import ListView from '@/app/projects/ListView';
import Timeline from '@/app/projects/Timeline';
import Table from '@/app/projects/Table';
import ModalNewTask from '@/components/ModalNewTask';

type Props = {
    params: { id: string };
};

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState('Board');
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

    return (
        <div>
            <ModalNewTask
                isOpen={isModalNewTaskOpen}
                onClose={() => setIsModalNewTaskOpen(false)}
                id={id}
            />
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'Board' && (
                <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === 'List' && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === 'Timeline' && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === 'Table' && (
                <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
        </div>
    );
};

export default Project;
