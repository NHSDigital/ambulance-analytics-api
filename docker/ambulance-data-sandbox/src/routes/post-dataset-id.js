module.exports = [
  /**
   * POST to /data/{datasetId}
   * If datasetId.json file exists in `mock` directory then that will be the response otherwise, 404
   */
  {
    method: 'POST',
    path: '/data/{datasetId}',
    handler: (request, h) => {
      const path = `${request.params['datasetId']}.json`

      return h.file(path)
    }
  }
]
