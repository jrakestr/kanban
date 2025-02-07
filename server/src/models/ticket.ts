console.log('Starting ticket.ts');
import { DataTypes, Model, Optional } from 'sequelize';
console.log('Importing sequelize from index.js...');
import { sequelize } from '../config/db.js';
console.log('Sequelize imported in ticket.ts');

interface TicketAttributes {
  id: number;
  name: string;
  status: string;
  description: string;
  createdById: number;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id'> {}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: number;
  public name!: string;
  public status!: string;
  public description!: string;
  public createdById!: number;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

console.log('Initializing Ticket model...');
Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },

  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'Tickets',
  }
);

export { Ticket };
export default Ticket;
