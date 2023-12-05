const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkValidId(threadId, commentId) {
    // console.log(threadId, commentId)
    const query = {
      text: 'SELECT * FROM threads JOIN comments ON threads.id=comments.thread_id WHERE threads.id = $1 AND comments.id = $2',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    // console.log(result)
    if (result.rows.length === 0) {
      throw new NotFoundError('Thread atau Komentar tidak ditemukan');
    }
  }

  async addReply(addReply) {
    const { content, owner, commentId } = addReply;
    const id = `reply-${this._idGenerator()}`;
    // console.log(id, owner, content, commentId)
    const query = {
      text: 'INSERT INTO replies (id, owner, created_at, content, comment_id) VALUES($1, $2, NOW(), $3, $4) RETURNING id, content, owner',
      values: [id, owner, content, commentId],
    };

    try {
      const result = await this._pool.query(query);
      return new AddedReply({ ...result.rows[0] });
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError('Thread tidak ditemukan');
      } else throw error;
    }
  }

  async getOwner(replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
    return result.rows[0].owner;
  }

  async deleteReplyById(deleteReply, validOwner) {
    const { user, replyId } = deleteReply;

    if (user !== validOwner) throw new AuthorizationError('kamu tidak berhak');

    const query = {
      text: 'UPDATE replies SET deleted_at=NOW() WHERE deleted_at IS NULL AND id=$1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Balasan sudah dihapus');
    }

    return 'success';
  }
}

module.exports = ReplyRepositoryPostgres;
