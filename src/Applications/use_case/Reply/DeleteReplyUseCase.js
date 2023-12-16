const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    // check reply availabilty
    await this._replyRepository.checkValidId(deleteReply.replyId);

    // check user access
    await this._replyRepository.checkOwner(deleteReply.replyId, deleteReply.user);

    // delete reply
    return this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
