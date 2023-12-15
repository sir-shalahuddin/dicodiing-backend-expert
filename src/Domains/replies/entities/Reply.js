/* eslint-disable class-methods-use-this */
class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, createdAt, deletedAt, username, content,
    } = payload;

    this.id = id;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    this.username = username;
    this.content = content;
  }

  _verifyPayload({
    id, createdAt, deletedAt, username, content,
  }) {
    if (!id || !createdAt || !deletedAt || !username || !content) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof createdAt !== 'string'
      || typeof deletedAt !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
