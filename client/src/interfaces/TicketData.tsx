// Ticket data structure for CRUD operations
// Depends on UserData interface

import { UserData } from './UserData';

export interface TicketData {
  id: number | null;
  name: string | null;
  description: string | null;
  status: string | null;
  assignedUserId: number | null;
  assignedUser: UserData | null;
  createdBy: UserData | null;
  createdAt?: string;
  updatedAt?: string;
}
