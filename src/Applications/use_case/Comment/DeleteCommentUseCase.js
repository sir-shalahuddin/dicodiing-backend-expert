const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    // check comment availability
    await this._commentRepository.checkValidId(deleteComment.commentId);
    // check user access
    await this._commentRepository.checkOwner(deleteComment.commentId, deleteComment.owner);
    // delete comment
    return this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
