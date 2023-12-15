const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    const valid = await this._replyRepository.checkValidId(addReply.threadId, addReply.commentId);
    if (!valid) {
      throw new NotFoundError('Thread atau Komentar tidak ditemukan');
    }
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
