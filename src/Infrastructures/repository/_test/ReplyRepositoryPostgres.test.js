/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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
    it('should not throw an error when reply is found', async () => {
      // Arrange
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ id: replyId });

      // Action and Assert
      await expect(replyRepositoryPostgres.checkValidId(replyId)).resolves.not.toThrow();
    });

    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const nonExistentThreadId = 'non-existent-reply-id';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.checkValidId(nonExistentThreadId))
        .rejects.toThrow(NotFoundError);
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

  describe('checkOwner function', () => {
    it('should not throw an error when owner is valid', async () => {
      // Arrange
      const owner = 'user-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ id: replyId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.checkOwner(replyId, owner)).resolves.not.toThrow();
    });

    it('should throw Authorization Error invalid owner', async () => {
      // Arrange
      const invalidOwner = 'invalidOwner';
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.checkOwner(replyId, invalidOwner))
        .rejects.toThrow(AuthorizationError);
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
