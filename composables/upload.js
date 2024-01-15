export function useUploader() {
  const uploadState = useState('upload', () => ({
    queue: {},
    dialog: false,
  }))

  const upload = async (path = '/') => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    // inputElement.multiple = true
    return new Promise((resolve, reject) => {
      const onChange = (event) => {
        inputElement.removeEventListener('change', onChange)
        const selectedFile = event.target.files[0]
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
