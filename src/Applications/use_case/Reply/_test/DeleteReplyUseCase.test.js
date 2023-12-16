const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      user: 'user-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.checkValidId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve('success'));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const status = await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(status).toStrictEqual('success');

    expect(mockReplyRepository.checkValidId).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.checkOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.user);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.replyId);
  });
});
