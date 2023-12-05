const DeleteComment = require('../DeleteComment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {

    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: true,
      threadId: 123,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      owner: 'user-CrkY5iAgOdMqv36bIvys2',
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.owner).toEqual(payload.owner);
    expect(deleteComment.threadId).toEqual(payload.threadId);
  });
});
