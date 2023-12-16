const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    // check thread availabilty
    await this._threadRepository.checkValidId(addReply.threadId);

    // check comment aiablabilty
    await this._commentRepository.checkValidId(addReply.commentId);

    // add reply
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
