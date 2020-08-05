module.exports = [
    /**
     * POST to /
     * If if a dataset id doesn't exist return a 400 bad request
     */
    {
      method: 'POST',
      path: '/',
      handler: (request, h) => {
        const responseMessage  = { message: 'Missing required request parameters: [x-dataset-id]'}

        return h.response(responseMessage).code(400)
      }
    }
  ]
  