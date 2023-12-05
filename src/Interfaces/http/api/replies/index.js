const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const commentsHandler = new RepliesHandler(container);
    server.route(routes(commentsHandler));
  },
};
