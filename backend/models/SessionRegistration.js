const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Session = require('./Sessions');

const SessionRegistration = sequelize.define('session_registration', {
  id: {
    type: DataTypes.CHAR(36), // Match Session.id type
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.CHAR(36), // Match Session.id type (no BINARY)
    allowNull: false,
    field: 'session_id',
    references: {
      model: Session,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'full_name',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },

  registeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'registered_at',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },

}, {
  tableName: 'session_registration',
  timestamps: false,
});

// Define relationship with Sessions
SessionRegistration.belongsTo(Session, { foreignKey: 'sessionId', as: 'sessions' });
Session.hasMany(SessionRegistration, { foreignKey: 'sessionId', as: 'session_registration' });

module.exports = SessionRegistration;