const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-_pby2_tmXV6bcvcdev8xk',
      user: 'user-CrkY5iAgOdMqv36bIvys2',
    };

    // Creating a mock repository
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.user));
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    // Creating the use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.getOwner).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
  it('should throw AuthorizationError when the user is not valid', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-_pby2_tmXV6bcvcdev8xk',
      user: 'invalid-user-id',
    };

    // Creating a mock repository where getOwner returns a different user
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getOwner = jest.fn()
      .mockImplementation(() => Promise.resolve('different-user-id'));

    // Creating the use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError(AuthorizationError);

    // Ensure that getOwner was called with the correct replyId
    expect(mockReplyRepository.getOwner).toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
