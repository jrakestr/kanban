console.log('Starting user.ts');
import { Model, DataTypes } from 'sequelize';
console.log('Importing sequelize from index.js...');
import { sequelize } from '../config/db.js';
console.log('Sequelize imported in user.ts');
import bcrypt from 'bcrypt';

interface UserInstance extends Model {
  id: number;
  username: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

console.log('Defining User model...');
const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user: UserInstance) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Add instance method for password comparison
(User as any).prototype.comparePassword = async function(this: UserInstance, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Set up association with Ticket model
import { Ticket } from './ticket.js';

User.hasMany(Ticket, {
  foreignKey: 'createdById',
  as: 'createdTickets'
});

Ticket.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'createdBy'
});

export { User, UserInstance };
export default User;
