const DeleteComment = require('../../../../Domains/comments/entities/DeleteComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      owner: 'user-CrkY5iAgOdMqv36bIvys2',
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkValidId = jest.fn()
      .mockImplementation(() => Promise.resolve('user-CrkY5iAgOdMqv36bIvys2'));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkValidId)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(new DeleteComment({
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    }), 'user-CrkY5iAgOdMqv36bIvys2');
  });
});
