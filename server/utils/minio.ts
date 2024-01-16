import * as Minio from 'minio'

const MINIO_ADDR = process.env.MINIO_ADDR || '127.0.0.1'
const MINIO_PORT = process.env.MINIO_PORT || 9000
const MINIO_ACCESS = process.env.MINIO_ACCESS || ''
const MINIO_SECRET = process.env.MINIO_SECRET || ''
export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'shiru'

export const minioClient = new Minio.Client({
  endPoint: MINIO_ADDR,
  port: +MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS,
  secretKey: MINIO_SECRET,
})
