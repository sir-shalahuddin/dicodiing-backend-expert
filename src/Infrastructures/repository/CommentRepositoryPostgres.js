const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments (id, owner, created_at, content, thread_id) VALUES ($1, $2, NOW(), $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async checkValidId(commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('threads tidak ditemukan');
    }
  }

  async checkOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 and owner= $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('Kamu tidak berhak');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT comments.id,users.username,comments.created_at,comments.deleted_at,comments.content  
      FROM comments
      JOIN threads ON comments.thread_id = threads.id 
      JOIN users ON users.id=comments.owner 
      where comments.thread_id = $1
      ORDER BY comments.created_at
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET deleted_at=NOW() WHERE deleted_at IS NULL AND "id"=$1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      return 'success';
    }
    return 'failure';
  }
}

module.exports = CommentRepositoryPostgres;
