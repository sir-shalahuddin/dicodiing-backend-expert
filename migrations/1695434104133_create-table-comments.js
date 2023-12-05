/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'comments_users_fk',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      referencesConstraintName: 'comments_threads_fk',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
