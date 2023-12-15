const GetThread = require('../../../Domains/threads/entities/GetThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { id } = new GetThread(useCasePayload);
    const result = await this._threadRepository.getThreadById(id);
    const thread = {
      id: result.id,
      title: result.title,
      body: result.body,
      date: result.created_at.toDateString(),
      username: result.username,
      comments: [],
    };

    const comments = await this._commentRepository.getCommentsByThreadId(thread.id);

    thread.comments = comments.map((comment) => ({
      id: comment.id,
      date: comment.created_at.toDateString(),
      username: comment.username,
      content: comment.deleted_at ? '**komentar telah dihapus**' : comment.content,
      replies: [],
    }));

    const fetchRepliesPromises = [];

    for (let i = 0; i < thread.comments.length; i += 1) {
      const fetchRepliesPromise = this._replyRepository.getRepliesByCommentId(thread.comments[i].id)
        .then((replies) => {
          thread.comments[i].replies = replies.map((reply) => ({
            id: reply.id,
            date: reply.created_at.toDateString(),
            username: reply.username,
            content: reply.deleted_at ? '**balasan telah dihapus**' : reply.content,
          }));
        });
      fetchRepliesPromises.push(fetchRepliesPromise);
    }

    await Promise.all(fetchRepliesPromises);

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
