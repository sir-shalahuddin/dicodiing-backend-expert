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

    try {
      const result = await this._pool.query(query);
      return new AddedComment({ ...result.rows[0] });
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError('Thread tidak ditemukan');
      } else throw error;
    }
  }

  async checkValidId(commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
    return result.rows[0].owner;
  }

  async deleteCommentById(deleteComment, validOwner) {
    const { owner, threadId, commentId } = deleteComment;

    if (owner !== validOwner) throw new AuthorizationError('kamu tidak berhak');

    const query = {
      text: 'UPDATE comments SET deleted_at=NOW() WHERE deleted_at IS NULL AND owner=$1 AND thread_id=$2 AND "id"=$3',
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Komentar sudah dihapus');
    }
    return 'success';
  }
}

module.exports = CommentRepositoryPostgres;
