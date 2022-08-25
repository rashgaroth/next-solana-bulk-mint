import { candyMachineConfig } from 'config/candyMachine'
import { firebaseConfig } from 'config/firebase'
import { Analytics, getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
  Firestore,
  getFirestore,
  doc,
  DocumentReference,
  DocumentData,
  deleteDoc,
  setDoc,
  collection,
  CollectionReference,
  getDoc,
  getDocs,
  QuerySnapshot,
  updateDoc,
  UpdateData,
  WithFieldValue
} from 'firebase/firestore'
import { generateId, generateRandomString } from 'utils/string'
import { IConfig, ISubConfig } from './interfaces/IConfig'

/**
 *
 *
 * @class FirebaseProviders
 */
class FirebaseProviders {
  db: Firestore
  users: string
  networks: string
  analytics: Analytics
  generateCollectionId: string
  /**
   * Creates an instance of FirebaseProviders.
   * @memberof FirebaseProviders
   */
  constructor() {
    this.db = null
    this.analytics = null
    this.users = 'users'
    this.networks = 'user-config'
    this.generateCollectionId = `${generateId(31)}-${Date.now()}`

    this.init()
  }

  /**
   *
   *
   * @memberof FirebaseProviders
   */
  init(): void {
    if (typeof window !== 'undefined') {
      const app = initializeApp(firebaseConfig)
      const analytics = getAnalytics(app)
      const db = getFirestore(app)
      this.db = db
      this.analytics = analytics
    }
  }

  /**
   * Get document
   *
   * @template T
   * @param {string} path
   * @param {string} [colName]
   * @return {*}
   * @memberof FirebaseProviders
   */
  getDocument<T = DocumentReference>(path: string, colName?: string): DocumentReference<T> {
    if (this.db === null || path === '') {
      return null
    }
    let getDoc: DocumentReference<DocumentData>
    if (colName) {
      getDoc = doc(this.db, path, colName)
      return getDoc as DocumentReference<T>
    }
    getDoc = doc(this.db, path)
    return getDoc as DocumentReference<T>
  }

  /**
   * Get collection
   *
   * @template T
   * @param {string} collectionName
   * @return {*}
   * @memberof FirebaseProviders
   */
  getCollection<T = DocumentData>(collectionName: string) {
    return collection(this.db, collectionName) as CollectionReference<T>
  }

  /**
   * get many data
   *
   * @template T
   * @param {CollectionReference<T>} collection
   * @return {*}  {Promise<Array<T>>}
   * @memberof FirebaseProviders
   */
  async getMany<T = QuerySnapshot>(collection: CollectionReference<T>): Promise<Array<T>> {
    try {
      const data = await getDocs(collection)
      const array: T[] = []
      data.docs.forEach((data) => {
        array.push(data.data())
      })
      return array
    } catch (err) {
      return null
    }
  }

  /**
   * Get Where
   *
   * @template T
   * @param {DocumentReference<T>} documentReference
   * @return {*}  {Promise<T>}
   * @memberof FirebaseProviders
   */
  async getWhere<T = QuerySnapshot>(documentReference: DocumentReference<T>): Promise<T> {
    try {
      const data = await getDoc(documentReference)
      if (data.exists()) {
        return data.data()
      } else {
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Get all data of documents
   * @template T
   * @param {string} arg
   * @return {*}  {Promise<T[]>}
   * @memberof FirebaseProviders
   */
  async getAllDocuments<T>(arg: string): Promise<T[]> {
    const col = this.getCollection<T>(arg)
    const data = await this.getMany<T>(col)
    return data
  }

  /**
   *
   *
   * @param {string} address
   * @return {*}  {(Promise<ISubConfig | null>)}
   * @memberof FirebaseProviders
   */
  async getUserConfigByWalletAddress(address: string): Promise<ISubConfig | null> {
    const subConfigDoc = this.getDocument<ISubConfig>(this.networks, address)
    const subDoc = await getDoc(subConfigDoc)
    return subDoc.data()
  }

  /**
   *
   *
   * @param {string} address
   * @param {ISubConfig} data
   * @return {*}  {(Promise<ISubConfig | null>)}
   * @memberof FirebaseProviders
   */
  async updateSettingsSubConfig(address: string, data: ISubConfig): Promise<ISubConfig | null> {
    const subConfigDoc = this.getDocument<ISubConfig>(this.networks, address)
    await updateDoc(subConfigDoc, data)
    const results = await getDoc(subConfigDoc)
    return results.data()
  }

  /**
   *
   *
   * @template T
   * @param {string} model
   * @param {string} address
   * @param {WithFieldValue<T>} data
   * @return {*}  {Promise<T>}
   * @memberof FirebaseProviders
   */
  async upsert<T>(model: string, address: string, data: WithFieldValue<T>): Promise<T> {
    const doc = this.getDocument<T>(model, address)
    await setDoc(doc, data)
    const returnedData = await this.getWhere<T>(doc)
    return returnedData
  }

  /**
   *
   *
   * @template T
   * @param {string} model
   * @param {string} address
   * @param {UpdateData<T>} data
   * @return {*}  {Promise<T>}
   * @memberof FirebaseProviders
   */
  async update<T>(model: string, address: string, data: UpdateData<T>): Promise<T> {
    const docWallet = this.getDocument<T>(model, address)
    await updateDoc(docWallet, data)
    const _data = await this.getWhere(docWallet)
    return _data
  }

  /**
   *
   *
   * @param {string} walletAddr
   * @return {*}  {Promise<ISubConfig>}
   * @memberof FirebaseProviders
   */
  async getConfigByWalletAddress(walletAddr: string): Promise<ISubConfig> {
    try {
      const docWallet = this.getDocument<ISubConfig>(this.networks, walletAddr)
      const data = await this.getWhere<ISubConfig>(docWallet)
      return data
    } catch (err) {
      console.log(err, '@error')
      return null
    }
  }

  /**
   *
   *
   * @param {IConfig} userData
   * @param {ISubConfig} subData
   * @param {string} address
   * @param {(e) => void} onError
   * @return {*}  {(Promise<ISubConfig | {}>)}
   * @memberof FirebaseProviders
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async insertCandyMachineConfig(userData: IConfig, subData: ISubConfig, address: string, onError: (e) => void): Promise<ISubConfig | {}> {
    try {
      console.log('address', address)
      const getUserDocument = this.getDocument<IConfig>(this.users, address)
      const subConfigDoc = this.getDocument<ISubConfig>(this.networks, address)
      // check if user exist
      const userDoc = await getDoc(getUserDocument)
      const subDoc = await getDoc(subConfigDoc)
      if (userDoc.exists()) {
        // if exist then create new subConfig
        if (subDoc.exists()) {
          console.log('subExist!')
          await updateDoc(subConfigDoc, {
            candyMachineId: subData.candyMachineId || null,
            candyStartDate: subData.candyStartDate,
            trasuryAddress: subData.trasuryAddress,
            id: subData.id,
            rpcUrl: subData.rpcUrl || candyMachineConfig.rpcHost,
            mode: subData.mode,
            walletAddress: address
          } as ISubConfig)
          const subConfigOfUserDoc = await getDoc(subConfigDoc)
          return subConfigOfUserDoc.data()
        } else {
          await setDoc(subConfigDoc, {
            candyMachineId: subData.candyMachineId || null,
            candyStartDate: subData.candyStartDate,
            trasuryAddress: subData.trasuryAddress,
            id: subData.id,
            rpcUrl: subData.rpcUrl || candyMachineConfig.rpcHost,
            mode: subData.mode,
            walletAddress: address
          } as ISubConfig)
          const subConfigOfUserDoc = await getDoc(subConfigDoc)
          return subConfigOfUserDoc.data()
        }
      } else {
        // if not exist then create userDoc and create subDoc
        await setDoc(getUserDocument, userData)
        await setDoc(subConfigDoc, {
          candyMachineId: subData.candyMachineId || null,
          candyStartDate: subData.candyStartDate,
          trasuryAddress: subData.trasuryAddress,
          id: subData.id,
          rpcUrl: subData.rpcUrl || candyMachineConfig.rpcHost,
          mode: subData.mode,
          walletAddress: address
        } as ISubConfig)
        const subConfigOfUserDoc = await getDoc(subConfigDoc)
        return subConfigOfUserDoc.data()
      }
    } catch (err) {
      onError(err)
      return {}
    }
  }

  /**
   * seeding your firebase
   *
   * @return {*}  {Promise<boolean>}
   * @memberof FirebaseProviders
   */
  async seedDatabase(): Promise<boolean> {
    try {
      const dummyAddress = `AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`
      const collectionId = `${generateId(31)}-${Date.now()}`
      const configDoc = this.getDocument<IConfig>(this.users, dummyAddress)
      const configCollection = this.getCollection<IConfig>(this.users)
      const subConfigDoc = this.getDocument<ISubConfig>(this.networks, dummyAddress)
      const subConfigCollection = this.getCollection<ISubConfig>(this.networks)

      console.log('@onDeleteConfigData ...')
      const configSnap = await getDocs(configCollection)
      configSnap.docs.forEach(async (data) => {
        await deleteDoc(this.getDocument(this.users, data.id))
      })
      console.log('@onDeleteSubConfigData ...')
      const subConfigSnap = await getDocs(subConfigCollection)
      subConfigSnap.docs.forEach(async (data) => {
        await deleteDoc(this.getDocument(this.networks, data.id))
      })
      console.log('@onAddConfigData ...')
      await setDoc(configDoc, {
        id: `config-${collectionId}`,
        network: 'solana',
        providedAccount: 'AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY',
        networkId: `solana-${collectionId}-AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`
      } as IConfig)
      console.log('@onAddConfigData ...')
      await setDoc(subConfigDoc, {
        candyMachineId: candyMachineConfig.candyMachineId,
        candyStartDate: candyMachineConfig.startDate,
        trasuryAddress: candyMachineConfig.trasuryAddress,
        id: `solana-${collectionId}-AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`,
        rpcUrl: candyMachineConfig.rpcHost,
        mode: candyMachineConfig.network,
        walletAddress: `AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`
      } as ISubConfig)
      console.log('done ...')
      return true
    } catch (err: unknown) {
      console.log(err, '@errorSeedingData')
      return false
    }
  }
}

const firebaseProviders = new FirebaseProviders()
export default firebaseProviders
