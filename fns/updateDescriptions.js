const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')

const updateDescriptions = async (basePath, images, csvData) => {
  const ep = new exiftool.ExiftoolProcess(exiftoolBin)
  await ep.open()

  for await (const image of images) {
    let imageId = image.split('.')[0]
    let rowMatch = await csvData.find(row => row.id === imageId)
    if (rowMatch) {
      await ep.writeMetadata(`${basePath}/${image}`, {
        Description: String(rowMatch.description).replace(/\n/g, '\r'),
        Caption: String(rowMatch.description).replace(/\n/g, '\r'),
      }, ['charset=UTF8', 'overwrite_original', 'E'])
    }
  }
  await ep.close()
}

module.exports = updateDescriptions
