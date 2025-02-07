import { Request, Response } from 'express';
import { Ticket } from '../models/ticket.js';
import { User } from '../models/user.js';

// GET /tickets
export const getAllTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{
        model: User,
        as: 'createdBy',
        attributes: ['id', 'username']
      }]
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tickets/:id
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [{
        model: User,
        as: 'createdBy',
        attributes: ['id', 'username']
      }]
    });
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /tickets
export const createTicket = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, status, description } = req.body;
  const createdById = req.user?.id;
  if (!createdById) {
    return res.status(401).json({ message: 'User must be logged in to create a ticket' });
  }
  try {
    const newTicket = await Ticket.create({ name, status, description, createdById });
    res.status(201).json(newTicket);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /tickets/:id
export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, description } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      ticket.name = name;
      ticket.status = status;
      ticket.description = description;
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /tickets/:id
export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      await ticket.destroy();
      res.json({ message: 'Ticket deleted' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
