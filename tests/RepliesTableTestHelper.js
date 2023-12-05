/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-123', content = 'Example Reply', owner = 'user-123', deletedAt = null,
  }) {
    const query = {
      text: 'INSERT INTO replies (id, owner, created_at, content, comment_id, deleted_at) VALUES($1, $2, NOW(), $3, $4, $5)',
      values: [id, owner, content, commentId, deletedAt],
    };

    await pool.query(query);
  },

  async findReplyById(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
