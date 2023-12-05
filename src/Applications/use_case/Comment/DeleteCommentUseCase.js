const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    const validOwner = await this._commentRepository.checkValidId(deleteComment.commentId);
    return this._commentRepository.deleteCommentById(deleteComment, validOwner);
  }
}

module.exports = DeleteCommentUseCase;
