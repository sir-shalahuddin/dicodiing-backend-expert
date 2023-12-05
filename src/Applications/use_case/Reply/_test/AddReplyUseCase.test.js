const AddReply = require('../../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah reply',
      owner: 'me',
      threadId: 'thread-123',
      commentId: 'comment-456',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-_pby2_tmXV6bcvcdev8xk',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.checkValidId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-_pby2_tmXV6bcvcdev8xk',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: 'sebuah reply',
      owner: 'me',
      threadId: 'thread-123',
      commentId: 'comment-456',
    }));
  });
});
