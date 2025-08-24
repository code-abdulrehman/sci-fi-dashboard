export interface Asset {
  id: number;
  name: string;
  status: string;
  clearance: string;
  department: string;
  lastSeen: string;
  location: string;
  specialty: string;
}

export interface Mission {
  id: number;
  codename: string;
  status: string;
  priority: string;
  target: string;
  startDate: string;
  endDate: string;
  location: string;
  teamSize: number;
  description: string;
} 