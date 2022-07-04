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
  QuerySnapshot
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
  globalConfig: string
  solanaConfig: string
  evmConfig: string
  analytics: Analytics

  /**
   * Creates an instance of FirebaseProviders.
   * @memberof FirebaseProviders
   */
  constructor() {
    this.db = null
    this.analytics = null
    this.globalConfig = 'global-config'
    this.solanaConfig = 'solana-config'
    this.evmConfig = 'evm-config'

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
   * seeding your firebase
   *
   * @return {*}  {Promise<boolean>}
   * @memberof FirebaseProviders
   */
  async seedDatabase(): Promise<boolean> {
    try {
      const dummyAddress = `AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`
      const collectionId = `${generateId(31)}-${Date.now()}`
      const configCollectionId = `solana-${generateRandomString(10)}`
      const configDoc = this.getDocument<IConfig>(this.globalConfig, configCollectionId)
      const configCollection = this.getCollection<IConfig>(this.globalConfig)
      const subConfigDoc = this.getDocument<ISubConfig>(this.solanaConfig, dummyAddress)
      const subConfigCollection = this.getCollection<ISubConfig>(this.solanaConfig)

      console.log('@onDeleteConfigData ...')
      const configSnap = await getDocs(configCollection)
      configSnap.docs.forEach(async (data) => {
        await deleteDoc(this.getDocument(this.globalConfig, data.id))
      })
      console.log('@onDeleteSubConfigData ...')
      const subConfigSnap = await getDocs(subConfigCollection)
      subConfigSnap.docs.forEach(async (data) => {
        await deleteDoc(this.getDocument(this.solanaConfig, data.id))
      })
      console.log('@onAddConfigData ...')
      await setDoc(configDoc, {
        id: `config-${collectionId}`,
        network: 'solana',
        collectionId: `nvp-solana-${generateRandomString(7)}`,
        subConfig: this.solanaConfig,
        providedAccount: 'AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY'
      } as IConfig)
      console.log('@onAddConfigData ...')
      await setDoc(subConfigDoc, {
        candyMachineId: candyMachineConfig.candyMachineId,
        candyStartDate: candyMachineConfig.startDate,
        trasuryAddress: candyMachineConfig.trasuryAddress,
        id: `sub-config-${collectionId}-AKmVvD9QnVgScvTnoQQKythi18mCrxoh8VUobRtTX3kY`,
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

  /**
   *
   *
   * @param {string} walletAddr
   * @return {*}  {Promise<ISubConfig>}
   * @memberof FirebaseProviders
   */
  async getConfigByWalletAddress(walletAddr: string): Promise<ISubConfig> {
    try {
      const docWallet = this.getDocument<ISubConfig>(this.solanaConfig, walletAddr)
      const data = await this.getWhere<ISubConfig>(docWallet)
      return data
    } catch (err) {
      return null
    }
  }
}

const firebaseProviders = new FirebaseProviders()
export default firebaseProviders
