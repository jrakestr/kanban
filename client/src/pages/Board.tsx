import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            <div className='board-controls'>
              <button type='button' id='create-ticket-link'>
                <Link to='/create'>New Ticket</Link>
              </button>
              <div className='filter-sort-controls'>
                <input
                  type='text'
                  placeholder='Search tickets...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='search-input'
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt')}
                  className='sort-select'
                >
                  <option value='createdAt'>Sort by Date</option>
                  <option value='name'>Sort by Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className='sort-order-btn'
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
            <div className='board-display'>
              {boardStates.map((status) => {
                // First filter by status
                let filteredTickets = tickets.filter(ticket => ticket.status === status);
                
                // Then filter by search query
                if (searchQuery) {
                  filteredTickets = filteredTickets.filter(ticket =>
                    (ticket.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                    (ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
                  );
                }
                
                // Sort tickets
                filteredTickets.sort((a, b) => {
                  if (sortBy === 'name') {
                    const nameA = a.name || '';
                    const nameB = b.name || '';
                    return sortOrder === 'asc'
                      ? nameA.localeCompare(nameB)
                      : nameB.localeCompare(nameA);
                  } else {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return sortOrder === 'asc'
                      ? dateA - dateB
                      : dateB - dateA;
                  }
                });
                return (
                  <Swimlane 
                    title={status} 
                    key={status} 
                    tickets={filteredTickets} 
                    deleteTicket={deleteIndvTicket}
                  />
                );
              })}
            </div>
          </div>
        )
    }
    </>
  );
};

export default Board;
