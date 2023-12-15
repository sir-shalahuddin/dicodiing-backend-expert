const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'Saya sendiri',
      threadId: 'thread-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockAddedThread = new AddedThread({
      id: 'thread-_pby2_tmXV6bcvcdev8xk',
      title: 'thread title',
      owner: useCasePayload.owner,
    });

    // Creating a mock comment repository
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(mockAddedComment);

    // Creating a mock thread repository
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockAddedThread);

    // Creating the use case instance with mock repositories
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository, // Include the mock thread repository
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toMatchObject({
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      expect.objectContaining({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      }),
    );

    // Ensure that getThreadById was called with the correct threadId
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
  });
  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'Saya sendiri',
      threadId: 'thread-123',
    };

    // Creating a mock thread repository that throws an error
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockRejectedValue(new NotFoundError('Thread tidak ditemukan'));

    // Creating the use case instance with the mock thread repository
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: new CommentRepository(),
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError(NotFoundError);

    // Ensure that getThreadById was called with the correct threadId
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
