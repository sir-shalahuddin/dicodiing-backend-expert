const DeleteReply = require('../../../../Domains/replies/entities/DeleteReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-_pby2_tmXV6bcvcdev8xk',
      user: 'user-CrkY5iAgOdMqv36bIvys2,',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.getOwner = jest.fn()
      .mockImplementation(() => Promise.resolve('user-CrkY5iAgOdMqv36bIvys2'));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.getOwner)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(new DeleteReply({
      replyId: useCasePayload.replyId,
      user: useCasePayload.user,
    }), 'user-CrkY5iAgOdMqv36bIvys2');
  });
});
