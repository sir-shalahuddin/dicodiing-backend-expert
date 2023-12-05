const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const Thread = require('../../Domains/threads/entities/Thread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, NOW(), $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const { id } = threadId;
    const query = {
      text: `
            SELECT
                threads.id AS thread_id,
                threads.title,
                threads.body,
                threads.created_at AS thread_date,
                users_threads.username AS thread_username,
                comments.id AS comment_id,
                users_comments.username AS comment_username,
                comments.created_at AS comment_date,
                CASE WHEN comments.deleted_at IS NOT NULL THEN '**komentar telah dihapus**' ELSE comments.content END AS comment_content,
                replies.id AS reply_id,
                users_replies.username AS reply_username,
                replies.created_at AS reply_date,
                CASE WHEN replies.deleted_at IS NOT NULL THEN '**balasan telah dihapus**' ELSE replies.content END AS reply_content
            FROM threads
            LEFT JOIN comments ON threads.id = comments.thread_id
            LEFT JOIN replies ON comments.id = replies.comment_id
            LEFT JOIN users AS users_threads ON threads.owner = users_threads.id
            LEFT JOIN users AS users_comments ON comments.owner = users_comments.id
            LEFT JOIN users AS users_replies ON replies.owner = users_replies.id
            WHERE threads.id = $1
            ORDER BY replies.created_at ASC, comments.created_at ASC;
            `,
      values: [id],
    };

    const result = await this._pool.query(query);

    const jsonResult = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const row of result.rows) {
      // eslint-disable-next-line no-shadow
      const threadId = row.thread_id;
      const commentId = row.comment_id;

      if (!jsonResult.thread) {
        jsonResult.thread = {
          id: threadId,
          title: row.title,
          body: row.body,
          date: row.thread_date.toDateString(),
          username: row.thread_username,
          comments: [],
        };
      }

      if (commentId && !jsonResult.thread.comments.some((comment) => comment.id === commentId)) {
        // Check if this is a comment row and if it's not a duplicate
        jsonResult.thread.comments.push({
          id: commentId,
          username: row.comment_username,
          date: row.comment_date.toDateString(),
          content: row.comment_content,
          replies: [],
        });
      }

      if (row.reply_id) {
        const comment = jsonResult.thread.comments.find(
          // eslint-disable-next-line no-shadow
          (comment) => comment.id === commentId,
        );
        if (comment) {
          comment.replies.push({
            id: row.reply_id,
            username: row.reply_username,
            date: row.reply_date.toDateString(),
            content: row.reply_content,
          });
        }
      }
    }
    return new Thread({ ...jsonResult.thread });
  }
}

module.exports = ThreadRepositoryPostgres;
