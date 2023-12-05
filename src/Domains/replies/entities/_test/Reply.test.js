const Reply = require('../Reply');

describe('a Detailed Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',

    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah reply',
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah reply',
    };

    // Action
    const getThreadById = new Reply(payload);

    // Assert
    expect(getThreadById.id).toEqual(payload.id);
    expect(getThreadById.date).toEqual(payload.date);
    expect(getThreadById.username).toEqual(payload.username);
    expect(getThreadById.content).toEqual(payload.content);
  });
});
