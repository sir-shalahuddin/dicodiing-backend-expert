const GetThread = require('../../../Domains/threads/entities/GetThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // console.log(useCasePayload)
    const getThread = new GetThread(useCasePayload);
    return this._threadRepository.getThreadById(getThread);
  }
}

module.exports = GetThreadDetailUseCase;
