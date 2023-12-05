class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id } = payload;

    this.id = id;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ id }) {
    if (!id) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
