/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('checkValidId function', () => {
    it('should return true for a valid threadId and commentId combination', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isValidId = await replyRepositoryPostgres.checkValidId(threadId, commentId);

      // Assert
      expect(isValidId).toBe(true);
    });

    it('should return false for an invalid threadId and commentId combination', async () => {
      // Arrange
      const threadId = 'non-existent-thread-id';
      const commentId = 'non-existent-comment-id';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isValidId = await replyRepositoryPostgres.checkValidId(threadId, commentId);

      // Assert
      expect(isValidId).toBe(false);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return an array of replies for a valid commentId', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(replies).toEqual(expect.any(Array));
    });

    it('should return an empty array for a non-existent commentId', async () => {
      // Arrange
      const nonExistentCommentId = 'non-existent-comment-id';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(nonExistentCommentId);

      // Assert
      expect(replies).toEqual([]);
    });
  });

  describe('addReply function', () => {
    it('should persist added reply and return AddedReply correctly', async () => {
      // Arrange
      const addReplyData = {
        content: 'Test Reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReplyData);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(replies).toHaveLength(1);
    });

    it('should return AddedReply correctly', async () => {
      // Arrange
      const addReplyData = {
        content: 'Test Reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReplyData);

      // Assert
      expect(addedReply).toEqual(new AddedReply({
        id: 'reply-123', // Adjust based on your logic
        content: addReplyData.content,
        owner: addReplyData.owner,
      }));
    });
  });

  describe('getOwner function', () => {
    it('should return owner for a valid replyId', async () => {
      // Arrange
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const owner = await replyRepositoryPostgres.getOwner(replyId);

      // Assert
      expect(owner).toEqual(expect.any(String));
    });

    it('should throw NotFoundError for non-existent replyId', async () => {
      // Arrange
      const nonExistentReplyId = 'non-existent-reply-id';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.getOwner(nonExistentReplyId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should return "success" for a valid replyId', async () => {
      // Arrange
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      expect(result).toBe('success');
    });

    it('should return "failure" for a non-existent replyId', async () => {
      // Arrange
      const nonExistentReplyId = 'non-existent-reply-id';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.deleteReplyById(nonExistentReplyId);

      // Assert
      expect(result).toBe('failure');
    });
  });
});
