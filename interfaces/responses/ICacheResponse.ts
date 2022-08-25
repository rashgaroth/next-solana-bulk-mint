interface IProgram {
  candyMachine: string
  candyMachineCreator: string
  collectionMint: string
}

interface IItems {
  image_hash: string
  image_link: string
  metadata_hash: string
  metadata_link: string
  name: string
  onChain: boolean
}

interface IResponse {
  program: IProgram
  items: IItems[]
}

export interface ICacheResponse {
  data: IResponse
}
