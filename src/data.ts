export const platforms = {
  w32e: 'Windows 32 位安装包',
  w64e: 'Windows 64 位安装包',
  w32z: 'Windows 32 位压缩包',
  w64z: 'Windows 64 位压缩包',
  mac: 'macOS',
  macl: 'macOS 旧版',
  app: 'AppImage',
  deb: 'Debian',
}

export type Platform = keyof typeof platforms

export const apps: Record<
  string,
  {
    name: string
    repo: string
    platforms: Record<Platform, string>
  }
> = {
  main: {
    name: 'Qv2ray',
    repo: 'Qv2ray',
    platforms: {
      w32e: 'win32.exe',
      w64e: 'win64.exe',
      w32z: 'Windows-x86.7z',
      w64z: 'Windows-x64.7z',
      mac: 'macOS',
      macl: 'legacy',
      app: 'AppImage',
      deb: 'deb',
    },
  },
}
