export function useSettingStore() {
  return useState('setting', () => ({
    sideBarOpened: true,
  }))
}
