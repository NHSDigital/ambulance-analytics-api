module.exports = [
    /**
     * GET to /submission
     * If submissionResponse.json file exists in `mock` directory then that will be the response otherwise, 404
     */
    {
      method: 'GET',
      path: '/submission',
      handler: (request, h) => {
        const responseMessage = `Request method must be POST, not ${request.route.method}`;
        return h.response(responseMessage).code(405)
      }
    }
  ]
  