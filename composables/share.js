export function useShare() {
  const shareState = useState('share', () => ({
    title: '',
    about: '',
    shareFiles: [],
    dialog: false,
  }))

  const newShare = () => {
    const { user } = useAuth()
    shareState.value = {
      title: `文件分享-${user.value.nickname || user.value.phone}-${Date.now()}`,
      about: '',
      shareFiles: [],
      dialog: true,
    }
  }

  const addShare = (file) => {
    if (file.isDir) return
    if (!shareState.value.title) newShare()
    shareState.value.dialog = true
    if (shareState.value.shareFiles.some(({ _id }) => _id === file._id)) return
    shareState.value.shareFiles.push(file)
  }

  const openOrNewShare = () => {
    if (!shareState.value.title) newShare()
    shareState.value.dialog = true
  }

  const removeShare = (index) => {
    shareState.value.shareFiles.splice(index, 1)
  }

  const submitShare = async () => {
    if (!shareState.value.shareFiles?.length) return
    const { _id } = await api.post(`/share/create`, {
      title: shareState.value.title,
      about: shareState.value.about,
      fileIds: shareState.value.shareFiles.map(({ _id }) => _id),
    })
    shareState.value.title = ''
    shareState.value.about = ''
    shareState.value.shareFiles = []
    shareState.value.dialog = false
    navigateTo(`/share/${_id}`)
  }

  return { shareState, newShare, addShare, openOrNewShare, removeShare, submitShare }
}
