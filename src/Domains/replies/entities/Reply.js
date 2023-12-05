/* eslint-disable class-methods-use-this */
class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, date, username, content,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
  }

  _verifyPayload({
    id, date, username, content,
  }) {
    if (!id || !date || !username || !content) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
            || typeof date !== 'string'
            || typeof username !== 'string'
            || typeof content !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
