import { Metaplex } from '@metaplex-foundation/js'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { IMetaplexProviders } from './interfaces/IMetaplexProviders'

class MetaplexProviders {
  metaplex: Metaplex
  connection: Connection

  constructor({ mode }: IMetaplexProviders) {
    this.connection = new Connection(clusterApiUrl(mode))
    if (this.connection) {
      this.metaplex = new Metaplex(this.connection)
    }
  }
}

const metaplexProviders = (param: IMetaplexProviders) => new MetaplexProviders(param)
export default metaplexProviders
