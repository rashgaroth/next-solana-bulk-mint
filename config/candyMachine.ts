interface ICandyMachineConfig {
  startDate: string
  rpcHost: string
  candyMachineId: string
  trasuryAddress: string
  network: string | 'mainnet-beta'
}

export const candyMachineConfig = {
  startDate: '1661360400000',
  rpcHost: 'https://api.mainnet-beta.solana.com',
  candyMachineId: '2yP3FjC3LmeLDrZpsE9XWamxVhFQX9pBzUignd4UBQfH',
  network: 'mainnet-beta',
  trasuryAddress: 'A6qD8mV6XMLdjcfhzS2BcNA87sW2tTRh6JEkQew6nT4A'
} as ICandyMachineConfig
