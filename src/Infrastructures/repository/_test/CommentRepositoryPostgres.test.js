/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment and return AddedComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addCommentData = {
        content: 'Test Comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addCommentData);

      // Assert
      expect(addedComment).toEqual(new AddedComment({
        id: 'comment-123', // Adjust based on your logic
        content: addCommentData.content,
        owner: addCommentData.owner,
      }));
    });
  });

  describe('checkValidId function', () => {
    it('should throw NotFoundError for non-existent commentId', async () => {
      // Arrange
      const nonExistentCommentId = 'non-existent-comment-id';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkValidId(nonExistentCommentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should return owner for a valid commentId', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const owner = await commentRepositoryPostgres.checkValidId(commentId);

      // Assert
      expect(owner).toEqual(expect.any(String));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return an array of comments for a valid threadId', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toEqual(expect.any(Array));
    });

    it('should return an empty array for a non-existent threadId', async () => {
      // Arrange
      const nonExistentThreadId = 'non-existent-thread-id';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(nonExistentThreadId);

      // Assert
      expect(comments).toEqual([]);
    });
  });

  describe('deleteCommentById function', () => {
    it('should return "success" for a valid commentId', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId });

      const originalQuery = pool.query;
      pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      expect(result).toBe('success');

      // Restore the original query function
      pool.query = originalQuery;
    });

    it('should return "failure" for a non-existent commentId', async () => {
      // Arrange
      const nonExistentCommentId = 'non-existent-comment-id';
      const originalQuery = pool.query;
      pool.query = jest.fn().mockResolvedValue({ rowCount: 0 });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.deleteCommentById(nonExistentCommentId);

      // Assert
      expect(result).toBe('failure');

      // Restore the original query function
      pool.query = originalQuery;
    });
  });
});
