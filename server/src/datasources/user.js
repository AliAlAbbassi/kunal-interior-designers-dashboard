const { DataSource } = require('apollo-datasource')

class UserAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async updateLocation({ location }) {
    return this.context.user.update({
      location,
    })
  }

  async uploadProfileImage({ file }) {
    const userId = this.context.user.id
    if (!userId) return

    const s3 = new s3()

    const { createReadStream, mimetype } = await file
    const filename = uuid4() + '.' + mime.getExtension(mimetype)

    const { AWS_S3_BUCKET } = process.env
    await s3
      .upload({
        ACL: 'public-read',
        Body: createReadStream(),
        Bucket: AWS_S3_BUCKET,
        key: filename,
        ContentType: mimetype,
      })
      .promise()

    return this.context.user.update({
      img: `https://${AWS_S3_BUCKET}.s3.us-west-2.amazonaws.com/${filename}`,
    })
  }
}

module.exports = UserAPI
