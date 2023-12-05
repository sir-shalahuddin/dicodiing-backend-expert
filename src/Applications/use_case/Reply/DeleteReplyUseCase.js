const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    const validOwner = await this._replyRepository.getOwner(deleteReply.replyId);
    return this._replyRepository.deleteReplyById(deleteReply, validOwner);
  }
}

module.exports = DeleteReplyUseCase;
