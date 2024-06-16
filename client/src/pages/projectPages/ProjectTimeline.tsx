import React, { useState, useEffect } from 'react';
import { Scheduler, SchedulerData } from '@bitnoi.se/react-scheduler';
import '@bitnoi.se/react-scheduler/dist/style.css';

interface Milestone {
    name: string;
    description: string;
    duration: string;
}

const initialMilestones: Milestone[] = [
    {
        name: 'Project Kickoff',
        description: 'Gather requirements, define project scope, and set goals',
        duration: '1 week',
    },
    {
        name: 'Design Wireframes',
        description: "Create wireframes for the application's user interface",
        duration: '2 weeks',
    },
    {
        name: 'Develop Backend',
        description: 'Set up database, develop server-side logic, and API endpoints',
        duration: '4 weeks',
    },
    {
        name: 'Develop Frontend',
        description: 'Implement user interface based on wireframes, integrate with backend',
        duration: '4 weeks',
    },
    {
        name: 'Testing',
        description: 'Conduct unit tests, integration tests, and user acceptance tests',
        duration: '3 weeks',
    },
    {
        name: 'Deployment',
        description: 'Deploy the application to production environment',
        duration: '1 week',
    },
    {
        name: 'Marketing and Launch',
        description: 'Plan marketing strategies, launch the application, and acquire users',
        duration: 'ongoing',
    },
];

const convertMilestonesToSchedulerData = (milestones: Milestone[]): SchedulerData[] => {
    const today = new Date();
    const schedulerData: SchedulerData[] = [
        {
            id: '1',
            label: {
                icon: '',
                title: 'Project Timeline',
                subtitle: 'Milestones',
            },
            data: [],
        },
    ];

    let currentDate = new Date(today);
    milestones.forEach((milestone, index) => {
        const durationWeeks = parseInt(milestone.duration.split(' ')[0], 10);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + durationWeeks * 7);

        schedulerData[0].data.push({
            id: `${index + 1}`,
            startDate: new Date(currentDate),
            endDate: endDate,
            occupancy: 0,
            title: milestone.name,
            subtitle: milestone.description,
            description: milestone.description,
            bgColor: 'rgb(254,165,177)',
        });

        currentDate = new Date(endDate);
    });

    return schedulerData;
};

const ProjectTimeline: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
    const [schedulerData, setSchedulerData] = useState<SchedulerData[]>(convertMilestonesToSchedulerData(initialMilestones));

    useEffect(() => {
        setSchedulerData(convertMilestonesToSchedulerData(milestones));
    }, [milestones]);

    const handleItemClick = (item: any) => {
        console.log('Item clicked:', item);
        // Handle item click (edit/delete milestone)
    };

    const handleAddMilestone = () => {
        const newMilestone: Milestone = {
            name: `New Milestone ${milestones.length + 1}`,
            description: '',
            duration: '1 week',
        };
        setMilestones([...milestones, newMilestone]);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl mb-5 text-center">Project Timeline</h2>
            <button onClick={handleAddMilestone} className="bg-blue-500 text-white px-4 py-2 rounded mb-5">
                Add Milestone
            </button>
            <Scheduler
                data={schedulerData}
                isLoading={false}
                onTileClick={handleItemClick}
                config={{
                    zoom: 0,
                }}
            />
        </div>
    );
};

export default ProjectTimeline;
