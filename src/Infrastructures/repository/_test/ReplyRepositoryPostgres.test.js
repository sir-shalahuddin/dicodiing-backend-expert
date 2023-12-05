/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
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
    it('should not throw error when thread and comment are valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkValidId('thread-123', 'comment-123'))
        .resolves
        .not.toThrowError();
    });

    it('should throw NotFoundError when thread or comment is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkValidId('nonExistingThread', 'nonExistingComment'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('addReply function', () => {
    it('should persist added reply and return AddedReply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const addReplyData = {
        content: 'Another Reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '789'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReplyData);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(replies).toHaveLength(1);
    });

    it('should return AddedReply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const addReplyData = {
        content: 'Test Reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '789'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReplyData);

      // Assert
      expect(addedReply).toEqual(new AddedReply({
        id: 'reply-789', // Adjust based on your logic
        content: addReplyData.content,
        owner: addReplyData.owner,
      }));
    });

    it('should throw NotFoundError when adding reply to non-existing comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addReplyData = {
        content: 'Test Reply',
        owner: 'user-123',
        commentId: 'nonExistingComment',
      };
      const fakeIdGenerator = () => '789'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.addReply(addReplyData))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getOwner function', () => {
    it('should return owner correctly for a valid replyId', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const owner = await replyRepositoryPostgres.getOwner('reply-123');

      // Assert
      expect(owner).toEqual('user-123'); // Adjust based on your logic
    });

    it('should throw NotFoundError for an invalid replyId', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.getOwner('invalid-reply-id'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const deleteReplyData = {
        user: 'invalid-id',
        replyId: 'reply-123',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(deleteReplyData, 'user-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should throw NotFoundError when replyId is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const deleteReplyData = {
        user: 'user-123',
        replyId: 'invalid-reply-id',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(deleteReplyData, 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply is already deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ deletedAt: new Date() });
      const deleteReplyData = {
        user: 'user-123',
        replyId: 'reply-123',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(deleteReplyData, 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should delete reply successfully when owner is valid and reply exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const deleteReplyData = {
        user: 'user-123',
        replyId: 'reply-123',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.deleteReplyById(deleteReplyData, 'user-123');

      // Assert
      expect(result).toEqual('success');
    });
  });
});
