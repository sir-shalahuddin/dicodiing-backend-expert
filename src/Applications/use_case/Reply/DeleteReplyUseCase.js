const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    const validOwner = await this._replyRepository.getOwner(deleteReply.replyId);
    if (deleteReply.user !== validOwner) {
      throw new AuthorizationError('kamu tidak berhak');
    }
    return this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
