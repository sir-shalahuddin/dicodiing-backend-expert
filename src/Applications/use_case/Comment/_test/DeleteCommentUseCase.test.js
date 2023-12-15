const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      owner: 'user-CrkY5iAgOdMqv36bIvys2',
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    };

    // Creating a mock comment repository
    const mockCommentRepository = new CommentRepository();

    // Mocking needed functions
    mockCommentRepository.checkValidId = jest.fn().mockResolvedValue('user-CrkY5iAgOdMqv36bIvys2');
    mockCommentRepository.deleteCommentById = jest.fn().mockResolvedValue();

    // Creating the use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkValidId).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw AuthorizationError when the comment owner is not valid', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      owner: 'invalid-owner-id',
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    };

    // Creating a mock comment repository
    const mockCommentRepository = new CommentRepository();

    // Mocking needed functions to simulate invalid owner
    mockCommentRepository.checkValidId = jest.fn().mockResolvedValue('different-owner-id');

    // Creating the use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError(AuthorizationError);

    // Ensure that checkValidId was called with the correct commentId
    expect(mockCommentRepository.checkValidId).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw NotFoundError when checkValidId throws an error', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      owner: 'user-CrkY5iAgOdMqv36bIvys2',
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    };

    // Creating a mock comment repository
    const mockCommentRepository = new CommentRepository();

    // Mocking checkValidId to throw an error
    mockCommentRepository.checkValidId = jest.fn().mockRejectedValue(new Error('Some error'));

    // Creating the use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(NotFoundError);

    // Ensure that checkValidId was called with the correct commentId
    expect(mockCommentRepository.checkValidId).toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
