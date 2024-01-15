import * as Minio from 'minio'

const MINIO_ADDR = process.env.MINI_ADDR || '127.0.0.1'
const MINIO_PORT = process.env.MINI_PORT || 9000
const MINIO_ACCESS = process.env.MINI_ACCESS || ''
const MINIO_SECRET = process.env.MINI_SECRET || ''
export const MINIO_BUCKET = process.env.MINIOBUCKET || 'shiru'

export const minioClient = new Minio.Client({
  endPoint: MINIO_ADDR,
  port: +MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS,
  secretKey: MINIO_SECRET,
})
