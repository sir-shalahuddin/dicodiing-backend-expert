class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { replyId, user } = payload;

    this.replyId = replyId;
    this.user = user;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ replyId, user }) {
    if (!replyId || !user) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof user !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
