

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in progress':
      return 'text-green-400';
    case 'completed':
      return 'text-blue-400';
    case 'on mission':
    case 'on hold':
      return 'text-yellow-400';
    case 'recovery':
    case 'training':
      return 'text-orange-400';
    case 'planning':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'text-red-400';
    case 'high':
      return 'text-orange-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
}; 