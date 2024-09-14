import React, { useState, useEffect, useContext } from 'react';
import { Scheduler, SchedulerData } from '@bitnoi.se/react-scheduler';
import '@bitnoi.se/react-scheduler/dist/style.css';
import { useParams } from 'react-router-dom';
import RegenerateContext from '@/components/contexts/RegenerateContext';
import axios from 'axios';

interface Milestone {
    name: string;
    description: string;
    duration: string;
}

const initialMilestones: Milestone[] = [
    {
        name: 'Project Kickoff',
        description: 'startup',
        duration: '1 week',
    },
    {
        name: 'Development',
        description: "development",
        duration: '2 weeks',
    }

];

const validateMilestones = (milestones: Milestone[]): boolean => {
    const durationRegex = /^\d+\s(week|weeks)$/;

    for (const milestone of milestones) {
        if (typeof milestone.name !== 'string' || milestone.name.trim() === '') {
            console.log("timelineerror >=-> name")
            return false;
        }
        if (typeof milestone.description !== 'string' || milestone.description.trim() === '') {
            console.log("timelineerror >=-> dsc")

            return false;
        }
        // if (!durationRegex.test(milestone.duration)) {
        //     console.log("timelineerror >=-> duration")

        //     return false;
        // }
    }
    return true;
};

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
    const { projectID } = useParams();

    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
    const [schedulerData, setSchedulerData] = useState<SchedulerData[]>(convertMilestonesToSchedulerData(initialMilestones));

    function getComponentName() {
        return "project_schedule";
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/model/project_schedule/${projectID}`);
            const fetchedMilestones = response.data.milestones;

            if (validateMilestones(fetchedMilestones)) {
                setMilestones(fetchedMilestones);
                setSchedulerData(convertMilestonesToSchedulerData(fetchedMilestones));

            } else {
                console.error('Fetched data is not valid');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (projectID) {
            setProjectRegenerateID(projectID);
        }
        setComponentRegenerate(getComponentName());
        fetchData();
    }, [projectID, regenerate]);

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
