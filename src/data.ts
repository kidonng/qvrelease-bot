export const platforms = {
  win32inst: 'Windows 32 位安装包',
  win64inst: 'Windows 64 位安装包',
  win32: 'Windows 32 位',
  win64: 'Windows 64 位',
  mac: 'macOS',
  maclegacy: 'macOS 旧版',
  linux: 'Linux 64 位',
  deb: 'Debian',
}

export type Platform = keyof typeof platforms
export type Platforms = Partial<Record<Platform, string>>

const windows: Platforms = {
  win32: 'Windows-x86',
  win64: 'Windows-x64',
}
const linux: Platforms = {
  linux: 'linux',
}
const macos: Platforms = {
  mac: 'macOS',
}
export const common: Platforms = {
  ...windows,
  ...linux,
  ...macos,
}
export const qv2ray: Platforms = {
  win32inst: 'win32',
  win64inst: 'win64',
  deb: 'deb',
  maclegacy: 'legacy',
}

const owner = 'Qv2ray'

export const sources: Record<
  string,
  {
    name: string
    owner: string
    repo: string
    prerelease?: boolean
    types: Platforms | string
  }
> = {
  qv2ray: {
    name: 'Qv2ray',
    owner,
    repo: 'Qv2ray',
    types: {
      ...common,
      ...qv2ray,
    },
  },
  command: {
    name: 'Command 插件',
    owner,
    repo: 'QvPlugin-Command',
    types: common,
  },
  ss: {
    name: 'SS 插件',
    owner,
    repo: 'QvPlugin-SS',
    types: common,
  },
  ssr: {
    name: 'SSR 插件',
    owner,
    repo: 'QvPlugin-SSR',
    types: common,
  },
  trojan: {
    name: 'Trojan 插件',
    owner,
    repo: 'QvPlugin-Trojan',
    types: common,
  },
  trojango: {
    name: 'Trojan-Go 插件',
    owner,
    repo: 'QvPlugin-Trojan-Go',
    types: common,
  },
  trojangocore: {
    name: 'Trojan-Go 核心',
    owner: 'p4gefau1t',
    repo: 'trojan-go',
    prerelease: true,
    types: {
      win32: 'windows-386',
      win64: 'windows-amd64',
      linux: 'linux-amd64',
      mac: 'darwin',
    },
  },
  naive: {
    name: 'NaiveProxy 插件',
    owner,
    repo: 'QvPlugin-NaiveProxy',
    types: common,
  },
  naivecore: {
    name: 'NaiveProxy 核心',
    owner: 'klzgrad',
    repo: 'naiveproxy',
    types: {
      win32: 'win-x86',
      win64: 'win-x64',
      linux: 'linux-x64',
      mac: 'osx',
    },
  },
  v2ray: {
    name: 'V2Ray 核心',
    owner: 'v2fly',
    repo: 'v2ray-core',
    types: {
      win32: 'windows-32',
      win64: 'windows-64',
      linux: 'linux-64',
      mac: 'macos',
    },
  },
  v2rayvless: {
    name: 'V2Ray VLESS 核心',
    owner: 'charlieethan',
    repo: 'vless-build',
    types: {
      win32: 'windows-32',
      win64: 'windows-64',
      linux: 'linux-64',
      mac: 'macos',
    },
  },
  v2rayunstable: {
    name: 'V2Ray 核心 (Unstable)',
    owner: 'v2fly',
    repo: 'V2FlyBleedingEdgeBinary',
    prerelease: true,
    types: {
      win32: 'windows-32',
      win64: 'windows-64',
      linux: 'linux-64',
      mac: 'macos',
    },
  },
  dlc: {
    name: 'Geosite 数据',
    owner: 'v2fly',
    repo: 'domain-list-community',
    types: 'dlc.dat',
  },
  ip: {
    name: 'GeoIP 数据',
    owner: 'v2fly',
    repo: 'geoip',
    types: 'geoip.dat',
  },
}

export const workflows: Record<
  string,
  {
    name: string
    owner: string
    repo: string
    // https://docs.github.com/en/rest/reference/actions#list-repository-workflows
    workflow_id: number
    types: Platforms
  }
> = {
  qv2ray: {
    name: 'Qv2ray',
    owner,
    repo: 'Qv2ray',
    workflow_id: 698782,
    types: common,
  },
  command: {
    name: 'Command 插件',
    owner,
    repo: 'QvPlugin-Command',
    workflow_id: 1097778,
    types: common,
  },
  ss: {
    name: 'SS 插件',
    owner,
    repo: 'QvPlugin-SS',
    workflow_id: 1938518,
    types: common,
  },
  ssr: {
    name: 'SSR 插件',
    owner,
    repo: 'QvPlugin-SSR',
    workflow_id: 976624,
    types: common,
  },
  trojan: {
    name: 'Trojan 插件',
    owner,
    repo: 'QvPlugin-Trojan',
    workflow_id: 1036904,
    types: common,
  },
  trojango: {
    name: 'Trojan-Go 插件',
    owner,
    repo: 'QvPlugin-Trojan-Go',
    workflow_id: 1429634,
    types: common,
  },
  naive: {
    name: 'NaiveProxy 插件',
    owner,
    repo: 'QvPlugin-NaiveProxy',
    workflow_id: 1495269,
    types: common,
  },
}
