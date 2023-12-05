/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread and return AddedThread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThreadData = {
        title: 'Test Thread',
        body: 'This is a test thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThreadData);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById(addedThread.id);
      expect(threads).toHaveLength(1);
    });

    it('should return AddedThread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThreadData = {
        title: 'Test Thread',
        body: 'This is a test thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThreadData);

      // Assert
      expect(addedThread).toEqual(new AddedThread({
        id: 'thread-123', // Adjust based on your logic
        title: addThreadData.title,
        owner: addThreadData.owner,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return Thread correctly with comments and replies', async () => {
      // Arrange
      const threadId = { id: 'thread-123' };
      const userRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Mocking the "threads" table state
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const retrievedThread = await userRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(retrievedThread).toEqual({
        id: 'thread-123',
        title: 'Example Title',
        body: 'Example Body',
        date: expect.any(String),
        username: 'dicoding', // Adjust based on your logic
        comments: [],
      });
    });
  });
});
