module.exports = [
  /**
   * POST to /{datasetId}
   * If datasetId.json file exists in `mock` directory then that will be the response otherwise, 404
   */
  {
    method: 'POST',
    path: '/{datasetId}',
    handler: (request, h) => {
      //const path = `${request.params['datasetId']}.json`
      const path = 'datasetId.json'
      return h.file(path)
    }
  }
]
