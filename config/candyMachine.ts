interface ICandyMachineConfig {
  startDate: string
  rpcHost: string
  candyMachineId: string
  trasuryAddress: string
  network: string | 'mainnet-beta'
}

export const candyMachineConfig = {
  startDate: '',
  rpcHost: '',
  candyMachineId: '',
  network: '',
  trasuryAddress: ''
} as ICandyMachineConfig
