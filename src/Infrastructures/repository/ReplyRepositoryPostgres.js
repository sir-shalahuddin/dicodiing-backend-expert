const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkValidId(threadId, commentId) {
    const query = {
      text: 'SELECT * FROM threads JOIN comments ON threads.id=comments.thread_id WHERE threads.id = $1 AND comments.id = $2',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
      SELECT replies.id,users.username,replies.created_at,replies.deleted_at,replies.content  
      FROM replies 
      JOIN comments on replies.comment_id = comments.id 
      JOIN users ON users.id=replies.owner 
      where replies.comment_id = $1
      ORDER BY replies.created_at`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows || [];
  }

  async addReply(addReply) {
    const { content, owner, commentId } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies (id, owner, created_at, content, comment_id) VALUES($1, $2, NOW(), $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getOwner(replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Reply not found');
    }

    return result.rows[0].owner;
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET deleted_at=NOW() WHERE deleted_at IS NULL AND id=$1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      return 'success';
    }
    return 'failure';
  }
}

module.exports = ReplyRepositoryPostgres;
