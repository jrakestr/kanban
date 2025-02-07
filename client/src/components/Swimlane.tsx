// Parameter: Authorization
// Format: Bearer ${token}

import TicketCard from './TicketCard';
import { useDrop } from 'react-dnd';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

interface SwimlaneProps {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
  onDrop: (ticketId: number, newStatus: string) => void;
}

const Swimlane = ({ title, tickets, deleteTicket, onDrop }: SwimlaneProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TICKET',
    drop: (item: TicketData) => {
      console.log('Dropping item:', item);
      if (item.id !== null) {
        onDrop(item.id, title);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: (item: TicketData) => {
      console.log('Can drop check:', item);
      return item.status !== title;
    },
  });
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'swim-lane todo';
      case 'In Progress':
        return 'swim-lane inprogress';
      case 'Done':
        return 'swim-lane done';
      default:
        return 'swim-lane';
    }
  };

  return (
    <div 
      ref={drop}
      className={`swimlane ${getStatusClass(title)} ${isOver ? 'drop-target' : ''}`}>
      <h2>{title}</h2>
      {tickets.map(ticket => (
        <TicketCard 
          key={ticket.id}
          ticket={ticket}
          deleteTicket={deleteTicket}
        />
      ))}
    </div>
  );
};

export default Swimlane;
