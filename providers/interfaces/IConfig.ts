import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Cluster } from '@solana/web3.js'

export interface IConfig {
  id: string
  network: string
  collectionId: string
  providedAccount: string
}

export interface ISubConfig {
  id: string
  candyMachineId: string
  trasuryAddress: string
  candyStartDate: string
  walletAddress: string
  mode: string | WalletAdapterNetwork | Cluster
  rpcUrl: string
}

export interface IEvmConfig {
  id: string
  nftContractAddress: string
  minterAddress: string
}
