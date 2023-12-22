/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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
    it('should not throw an error when comment is found', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action and Assert
      await expect(commentRepositoryPostgres.checkValidId(commentId))
        .resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const nonExistentThreadId = 'non-existent-comment-id';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkValidId(nonExistentThreadId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return an array of comments for a valid threadId', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const user = 'user-123';
      const username = 'saya sendiri';
      const content = 'ini komen';
      await UsersTableTestHelper.addUser({ id: user, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, content });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toEqual(expect.any(Array));
      expect(comments).toHaveLength(1);
      expect(comments[0]).toEqual({
        id: commentId,
        username,
        created_at: expect.any(Date),
        deleted_at: null,
        content,
      });
    });
  });

  describe('deleteCommentById function', () => {
    it('should successfully delete a valid commentId', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].deleted_at).toEqual(expect.any(Date));
    });
  });

  describe('checkOwner function', () => {
    it('should not throw an error when owner is valid', async () => {
      // Arrange
      const owner = 'user-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkOwner(commentId, owner))
        .resolves.not.toThrow(AuthorizationError);
    });

    it('should throw Authorization Error invalid owner', async () => {
      // Arrange
      const invalidOwner = 'invalidOwner';
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkOwner(commentId, invalidOwner))
        .rejects.toThrow(AuthorizationError);
    });
  });
});
