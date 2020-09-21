module.exports = [
    /**
     * GET,PUT,DELETE,PATCH to /submission
     * If submissionResponse.json file exists in `mock` directory then that will be the response otherwise, 404
     */
    {
      method: ['GET', 'PUT', 'DELETE', 'PATCH'],
      path: '/submission',
      handler: (request, h) => {
        const responseMessage = {
          error: `Request method must be POST, not ${request.route.method}`
        } ;
        return h.response(responseMessage).code(405)
      }
    }
  ]
  