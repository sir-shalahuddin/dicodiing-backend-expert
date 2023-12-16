const AddReply = require('../AddReply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {

    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: [],
      owner: 1,
      threadId: true,
      commentId: 123,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply',
      owner: 'me',
      threadId: 'thread-123',
      commentId: 'comment-456',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.threadId).toEqual(payload.threadId);
  });
});
