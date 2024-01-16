/**
 * 将数值大小的数字转换为人类可读的字符串表示
 * @param {number} size - 要转换的数字
 * @return {string} - 人类可读的字符串表示
 */
export function formatSize(size: number): string {
  if (size === 0) return '0'
  if (!size) return '-'
  size = +size
  // 定义单位数组
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  // 初始化单位索引
  let unitIndex = 0
  // 循环除以1024，直到数值小于1024或者单位数组遍历完
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  // 保留一位小数，并添加单位
  return size.toFixed(1) + units[unitIndex]
}

interface FileIcon {
  icon: string
  color: string
}

const codeIcon: FileIcon = { icon: 'mdi-file-code', color: 'pink' }
const textIcon: FileIcon = { icon: 'mdi-clipboard-text', color: 'light-blue' }
const audioIcon: FileIcon = { icon: 'mdi-music', color: 'red' }
const imageIcon: FileIcon = { icon: 'mdi-image', color: 'green' }
const videoIcon: FileIcon = { icon: 'mdi-video', color: 'blue' }
const officeIcon: FileIcon = { icon: 'mdi-clipboard-text', color: 'light-blue' }
const otherIcon: FileIcon = { icon: 'mdi-file', color: 'grey' }

// 将常见的MIME类型与图标进行映射
const fileTypeMap: Record<string, FileIcon> = {
  'text/css': codeIcon,
  'text/html': codeIcon,
  'application/msword': officeIcon,
  'application/pdf': officeIcon,
  'application/vnd.ms-excel': officeIcon,
  'application/vnd.ms-powerpoint': officeIcon,
  'application/octet-stream': otherIcon,
}

/**
 * 根据MIME类型获取图标
 * @param {string} [mimeType] - 文件的MIME类型
 * @returns {FileIcon} - 图标
 */
export function fileTypeIcon(mimeType?: string): FileIcon {
  if (!mimeType) return otherIcon
  // 查找映射关系，如果找不到则返回默认图标
  const icon = fileTypeMap[mimeType]
  if (icon) return icon
  if (mimeType.startsWith('application/vnd.openxmlformats')) return officeIcon
  if (mimeType.startsWith('application/')) return codeIcon
  if (mimeType.startsWith('text/')) return textIcon
  if (mimeType.startsWith('audio/')) return audioIcon
  if (mimeType.startsWith('image/')) return imageIcon
  if (mimeType.startsWith('video/')) return videoIcon
  return otherIcon
}
