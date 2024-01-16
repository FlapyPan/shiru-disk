function defaultState(): {
  queue: Record<string, Partial<{ filename: string, path: string, size: number, mimeType: string, state: string }>>,
  dialog: boolean,
} {
  return {
    queue: {},
    dialog: false,
  }
}

export function useUploader() {
  const uploadState = useState('upload', () => defaultState())

  const upload = async (path: string = '/') => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    // inputElement.multiple = true
    return new Promise((resolve, reject) => {
      const onChange = (event: Event) => {
        const selectedFile = inputElement.files?.[0]
        if (!selectedFile) return
        inputElement.removeEventListener('change', onChange)
        const form = new FormData()
        form.set('file', selectedFile)
        const key = crypto.randomUUID()
        const fileData = {
          filename: selectedFile.name,
          path,
          size: selectedFile.size,
          mimeType: selectedFile.type,
        }
        uploadState.value.dialog = true
        uploadState.value.queue[key] = fileData
        api
          .post(`/upload`, form, false)
          .then(({ storeId }) =>
            api.post(`/disk/create`, {
              ...fileData,
              storeId,
            }),
          )
          .then((data) => {
            uploadState.value.queue[key].state = 'ok'
            resolve(data)
          })
          .catch((err) => {
            uploadState.value.queue[key].state = err.message ?? 'error'
            reject(err)
          })
      }
      inputElement.addEventListener('change', onChange)
      inputElement.click()
    })
  }

  return {
    uploadState,
    upload,
  }
}
