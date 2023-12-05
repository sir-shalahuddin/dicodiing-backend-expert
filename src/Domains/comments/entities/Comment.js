class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, date, username, content, replies,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
    this.replies = replies;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({
    id, date, username, content, replies,
  }) {
    if (!id || !date || !username || !content || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
            || typeof date !== 'string'
            || typeof username !== 'string'
            || typeof content !== 'string'
            || typeof replies !== 'object') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
