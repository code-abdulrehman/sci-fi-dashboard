import type { Asset, Mission } from './types';

export const assetsData: Asset[] = [
  {
    id: 1,
    name: "Agent Sarah Chen",
    status: "Active",
    clearance: "Level 5",
    department: "Intelligence",
    lastSeen: "2024-01-15",
    location: "New York",
    specialty: "Cyber Operations"
  },
  {
    id: 2,
    name: "Agent Marcus Rodriguez",
    status: "On Mission",
    clearance: "Level 4",
    department: "Field Operations",
    lastSeen: "2024-01-14",
    location: "London",
    specialty: "Covert Surveillance"
  },
  {
    id: 3,
    name: "Agent Elena Petrov",
    status: "Recovery",
    clearance: "Level 6",
    department: "Special Forces",
    lastSeen: "2024-01-13",
    location: "Moscow",
    specialty: "Combat Operations"
  },
  {
    id: 4,
    name: "Agent James Wilson",
    status: "Active",
    clearance: "Level 3",
    department: "Technical Support",
    lastSeen: "2024-01-15",
    location: "San Francisco",
    specialty: "Tech Infrastructure"
  },
  {
    id: 5,
    name: "Agent Maya Patel",
    status: "Training",
    clearance: "Level 2",
    department: "Intelligence",
    lastSeen: "2024-01-12",
    location: "Training Facility",
    specialty: "Data Analysis"
  }
];

export const missionsData: Mission[] = [
  {
    id: 1,
    codename: "Operation Silent Echo",
    status: "In Progress",
    priority: "High",
    target: "Cyber Network Infiltration",
    startDate: "2024-01-10",
    endDate: "2024-01-25",
    location: "Multiple Cities",
    teamSize: 4,
    description: "Infiltration of enemy cyber infrastructure to extract classified data"
  },
  {
    id: 2,
    codename: "Project Shadow Strike",
    status: "Completed",
    priority: "Critical",
    target: "High-Value Target Extraction",
    startDate: "2024-01-05",
    endDate: "2024-01-12",
    location: "Eastern Europe",
    teamSize: 6,
    description: "Extraction of defector with critical intelligence information"
  },
  {
    id: 3,
    codename: "Mission Deep Cover",
    status: "Planning",
    priority: "Medium",
    target: "Long-term Infiltration",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    location: "Asia Pacific",
    teamSize: 2,
    description: "Establish deep cover identities for future operations"
  },
  {
    id: 4,
    codename: "Operation Firewall",
    status: "Active",
    priority: "High",
    target: "Security System Breach",
    startDate: "2024-01-08",
    endDate: "2024-01-20",
    location: "Washington DC",
    teamSize: 3,
    description: "Penetrate government security systems for intelligence gathering"
  },
  {
    id: 5,
    codename: "Project Ghost Protocol",
    status: "On Hold",
    priority: "Low",
    target: "Surveillance Setup",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    location: "Middle East",
    teamSize: 5,
    description: "Establish surveillance network in target region"
  }
]; 