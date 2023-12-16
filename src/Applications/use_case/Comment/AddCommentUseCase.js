const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    // check thread availability
    await this._threadRepository.checkValidId(addComment.threadId);
    // add comment
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
