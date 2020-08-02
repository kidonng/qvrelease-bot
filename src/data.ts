export const platforms = {
  w32i: 'Windows 32 位安装包',
  w64i: 'Windows 64 位安装包',
  w32: 'Windows 32 位',
  w64: 'Windows 64 位',
  mac: 'macOS',
  macl: 'macOS 旧版',
  linux: 'Linux',
  deb: 'Debian',
}

export type Platform = keyof typeof platforms
type Platforms = Partial<Record<Platform, string>>

const windows: Platforms = {
  w32: 'Windows-x86',
  w64: 'Windows-x64',
}
const linux: Platforms = {
  linux: 'linux',
}
const macos: Platforms = {
  mac: 'macOS',
}
const common: Platforms = {
  ...windows,
  ...linux,
  ...macos,
}

const owner = 'Qv2ray'

export const apps: Record<
  string,
  {
    name: string
    owner: string
    repo: string
    platforms: Platforms
  }
> = {
  qv: {
    name: 'Qv2ray',
    owner,
    repo: 'Qv2ray',
    platforms: {
      ...common,
      w32i: 'win32',
      w64i: 'win64',
      macl: 'legacy',
      deb: 'deb',
    },
  },
  com: {
    name: 'Command 插件',
    owner,
    repo: 'QvPlugin-Command',
    platforms: common,
  },
  ss: {
    name: 'SS 插件',
    owner,
    repo: 'QvPlugin-SS',
    platforms: common,
  },
  ssr: {
    name: 'SSR 插件',
    owner,
    repo: 'QvPlugin-SSR',
    platforms: common,
  },
  tro: {
    name: 'Trojan 插件',
    owner,
    repo: 'QvPlugin-Trojan',
    platforms: common,
  },
  trogo: {
    name: 'Trojan-Go 插件',
    owner,
    repo: 'QvPlugin-Trojan-Go',
    platforms: common,
  },
  naive: {
    name: 'NaiveProxy 插件',
    owner,
    repo: 'QvPlugin-NaiveProxy',
    platforms: common,
  },
  core: {
    name: 'V2Ray 核心',
    owner: 'v2fly',
    repo: 'v2ray-core',
    platforms: {
      w32: 'windows-32',
      w64: 'windows-64',
      mac: 'macos',
      linux: 'linux-64',
    },
  },
}
