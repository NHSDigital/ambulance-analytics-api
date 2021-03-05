module.exports = [
  /**
   * POST to /$process-message
   * If submissionResponse.json file exists in `mock` directory then that will be the response otherwise, 404
   */
  {
    method: '*',
    path: '/$process-message',
    handler: (request, h) => {
      if (request.raw.req.method !== 'POST') {
        const responseMessage = {
          error: `Request method must be POST, not ${request.raw.req.method}`
        } ;
        return h.response(responseMessage).code(405)
      }

      const path = 'submissionResponse.json'
      return h.file(path)
    }
  }
]
