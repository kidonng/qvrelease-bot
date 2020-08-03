export const platforms = {
  w32i: 'Windows 32 位安装包',
  w64i: 'Windows 64 位安装包',
  w32: 'Windows 32 位',
  w64: 'Windows 64 位',
  mac: 'macOS',
  macl: 'macOS 旧版',
  linux: 'Linux 64 位',
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
    prerelease?: boolean
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
      deb: 'deb',
      macl: 'legacy',
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
  trogocore: {
    name: 'Trojan-Go 核心',
    owner: 'p4gefau1t',
    repo: 'trojan-go',
    prerelease: true,
    platforms: {
      w32: 'windows-386',
      w64: 'windows-amd64',
      linux: 'linux-amd64',
      mac: 'darwin',
    },
  },
  naive: {
    name: 'NaiveProxy 插件',
    owner,
    repo: 'QvPlugin-NaiveProxy',
    platforms: common,
  },
  naivecore: {
    name: 'NaiveProxy 核心',
    owner: 'klzgrad',
    repo: 'naiveproxy',
    platforms: {
      w32: 'win-x86',
      w64: 'win-x64',
      linux: 'linux-x64',
      mac: 'osx',
    },
  },
  core: {
    name: 'V2Ray 核心',
    owner: 'v2fly',
    repo: 'v2ray-core',
    platforms: {
      w32: 'windows-32',
      w64: 'windows-64',
      linux: 'linux-64',
      mac: 'macos',
    },
  },
  vless: {
    name: 'V2Ray VLESS 核心',
    owner: 'rprx',
    repo: 'v2ray-vless',
    platforms: {
      w64: 'windows-64',
      linux: 'linux-64',
      mac: 'macos-64',
    },
  },
}
