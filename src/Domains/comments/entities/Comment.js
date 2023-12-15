class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, createdAt, deletedAt, username, content, replies,
    } = payload;

    this.id = id;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    this.username = username;
    this.content = content;
    this.replies = replies;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({
    id, createdAt, deletedAt, username, content, replies,
  }) {
    if (!id || !createdAt || !deletedAt || !username || !content || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof createdAt !== 'string'
      || typeof deletedAt !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof replies !== 'object') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
