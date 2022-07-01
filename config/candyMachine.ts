interface ICandyMachineConfig {
  startDate: string
  rpcHost: string
  candyMachineId: string
  trasuryAddress: string
  network: string | 'devnet'
}

export const candyMachineConfig = {
  startDate: process.env.NEXT_CANDY_START_DATE,
  rpcHost: process.env.NEXT_SOLANA_RPC_HOST,
  candyMachineId: process.env.NEXT_CANDY_MACHINE_ID,
  network: process.env.NEXT_SOLANA_NETWORK,
  trasuryAddress: process.env.NEXT_TREASURY_ADDRESS
} as ICandyMachineConfig
