/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment and return AddedComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      //   result = await ThreadsTableTestHelper.getThreadById({ id: 'thread-123' });
      //   //   await CommentsTableTestHelper.addComment({});
      //   console.log(result);
      const addCommentData = {
        content: 'Another Comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const fakeIdGenerator = () => '456'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addCommentData);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(addedComment.id);
      expect(comments).toHaveLength(1);
    });

    it('should return AddedComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addCommentData = {
        content: 'Test Comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const fakeIdGenerator = () => '456'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addCommentData);

      // Assert
      expect(addedComment).toEqual(new AddedComment({
        id: 'comment-456', // Adjust based on your logic
        content: addCommentData.content,
        owner: addCommentData.owner,
      }));
    });

    it('should throw NotFoundError when adding comment to non-existing thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'testUser', username: 'testUsername' });
      const addCommentData = {
        content: 'Test Comment',
        owner: 'testUser',
        threadId: 'nonExistingThread',
      };
      const fakeIdGenerator = () => '456'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.addComment(addCommentData))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('checkValidId function', () => {
    it('should return owner ID when comment ID is valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.checkValidId('comment-123');

      // Assert
      expect(result).toEqual('user-123');
    });

    it('should throw NotFoundError when comment ID is invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkValidId('invalid-comment-id'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment when ID and owner are valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const deleteCommentData = {
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.deleteCommentById(deleteCommentData, 'user-123');

      // Assert
      expect(result).toEqual('success');
      // Check if the comment is deleted
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].deleted_at).toBeDefined();
    });

    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const deleteCommentData = {
        owner: 'invalid-id',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(deleteCommentData, 'user-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should throw NotFoundError when comment ID is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const deleteCommentData = {
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'invalid-comment-id',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(deleteCommentData, 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});
