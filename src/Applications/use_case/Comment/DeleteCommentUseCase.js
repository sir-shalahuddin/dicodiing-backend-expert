const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    try {
      const validOwner = await this._commentRepository.checkValidId(deleteComment.commentId);
      if (deleteComment.owner !== validOwner) {
        throw new AuthorizationError('kamu tidak berhak');
      }
    } catch (error) {
      if (error.name === 'AuthorizationError') {
        throw new AuthorizationError('kamu tidak berhak');
      }
      throw new NotFoundError('komentar tidak ditemukan');
    }
    return this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
