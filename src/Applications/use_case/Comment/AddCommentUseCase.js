const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    try {
      await this._threadRepository.getThreadById(addComment.threadId);
    } catch (error) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
