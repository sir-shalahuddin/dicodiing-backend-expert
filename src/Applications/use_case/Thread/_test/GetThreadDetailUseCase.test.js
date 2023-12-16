const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should return the thread with comments and replies', async () => {
    // Arrange
    const threadId = 'threadId123';
    const useCasePayload = { id: threadId };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      created_at: new Date('2023-01-01T00:00:00Z'),
      username: 'user123',
    }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'commentId1',
          created_at: new Date('2023-01-02T00:00:00Z'),
          username: 'user456',
          content: 'Comment Content',
          deleted_at: null,
        },
        {
          id: 'commentId2',
          created_at: new Date('2023-01-03T00:00:00Z'),
          username: 'user789',
          content: 'Deleted Comment Content',
          deleted_at: new Date('2023-01-04T00:00:00Z'), // Set deleted_at to a non-null value
        },
      ]));

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'commentId1') {
          return Promise.resolve([
            {
              id: 'replyId1',
              created_at: new Date('2023-01-03T00:00:00Z'),
              username: 'user789',
              content: 'Reply Content',
              deleted_at: null,
            },
            {
              id: 'replyId2',
              created_at: new Date('2023-01-04T00:00:00Z'),
              username: 'user789',
              content: 'Reply Content',
              deleted_at: new Date('2023-01-05T00:00:00Z'),
            },
          ]);
        }
        return Promise.resolve([]);
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(result).toMatchObject({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      username: 'user123',
      date: 'Sun Jan 01 2023',
      comments: [
        {
          id: 'commentId1',
          username: 'user456',
          content: 'Comment Content',
          date: 'Mon Jan 02 2023',
          replies: [
            {
              id: 'replyId1',
              username: 'user789',
              content: 'Reply Content',
              date: 'Tue Jan 03 2023',
            }, {
              id: 'replyId2',
              username: 'user789',
              content: '**balasan telah dihapus**',
              date: 'Wed Jan 04 2023',
            },
          ],
        },
        {
          id: 'commentId2',
          username: 'user789',
          content: '**komentar telah dihapus**', // Expect the content to be overwritten
          date: 'Tue Jan 03 2023',
          replies: [],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    for (let index = 1; index <= 2; index += 1) {
      expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(`commentId${index}`);
    }
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(2);
  });
});
