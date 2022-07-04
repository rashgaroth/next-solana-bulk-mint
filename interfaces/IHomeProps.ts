import * as anchor from '@project-serum/anchor'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

export interface IHomeProps {
  txTimeout: number
  candyMachineId: anchor.web3.PublicKey | null
  connection: anchor.web3.Connection
  network: WalletAdapterNetwork
  rpcHost: string
}
