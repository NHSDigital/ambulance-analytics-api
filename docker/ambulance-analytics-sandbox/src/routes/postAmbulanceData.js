module.exports = [
  /**
   * POST to /submission
   * If submissionResponse.json file exists in `mock` directory then that will be the response otherwise, 404
   */
  {
    method: 'POST',
    path: '/submission',
    handler: (request, h) => {
      const path = 'submissionResponse.json'
      return h.file(path)
    }
  }
]
