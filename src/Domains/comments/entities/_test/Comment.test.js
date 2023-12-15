const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      replies: [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: '**balasan telah dihapus**',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
        },
      ],
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'johndoe',
      createdAt: '2021-08-08T08:07:01.522Z',
      deletedAt: '2021-08-08T08:07:01.522Z',
      replies: [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: '**balasan telah dihapus**',
          createdAt: '2021-08-08T08:07:01.522Z',
          deletedAt: '2021-08-08T08:07:01.522Z',
          username: 'johndoe',
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          createdAt: '2021-08-08T08:07:01.522Z',
          deletedAt: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
        },
      ],
      content: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      createdAt: '2021-08-08T08:07:01.522Z',
      deletedAt: '2021-08-08T08:07:01.522Z',
      replies: [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: '**balasan telah dihapus**',
          createdAt: '2021-08-08T08:07:01.522Z',
          deletedAt: '2021-08-08T08:07:01.522Z',
          username: 'johndoe',
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          createdAt: '2021-08-08T08:07:01.522Z',
          deletedAt: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
        },
      ],
      content: 'sebuah comment',
    };

    // Action
    const getThreadById = new Comment(payload);

    // Assert
    expect(getThreadById.id).toEqual(payload.id);
    expect(getThreadById.date).toEqual(payload.date);
    expect(getThreadById.username).toEqual(payload.username);
    expect(getThreadById.content).toEqual(payload.content);
    expect(getThreadById.replies).toEqual(payload.replies);
  });
});
