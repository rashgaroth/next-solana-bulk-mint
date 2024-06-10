/* eslint-disable @typescript-eslint/no-explicit-any */
import formidable, { File } from 'formidable'
import IncomingForm from 'formidable/Formidable'
import fs from 'fs'
import { IUploadErrorResponse, IUploadResponse } from 'interfaces/responses/IUploadsResponse'
import { encode } from 'lib/api/encoder'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

const uploadCacheFile = async (req: NextApiRequest, res: NextApiResponse, address: string): Promise<boolean> => {
  const form: IncomingForm = new formidable.IncomingForm()
  form.parse(req, async function (err: any, fields: formidable.Fields, files: formidable.Files) {
    const file: File = files.file as File
    const path = resolve(process.cwd(), 'sugar')
    const oldPath = file.filepath
    const newPath = `${path}/config/json/${address}`
    const name = `cache-${address}.json`
    const readJson = fs.readFileSync(oldPath)
    await fs.promises.mkdir(newPath, { recursive: true })
    await fs.promises.writeFile(newPath + '/' + name, readJson, 'utf8')
  })
  return true
}

const uploadConfigFile = async (req: NextApiRequest, res: NextApiResponse, address: string): Promise<boolean> => {
  const form: IncomingForm = new formidable.IncomingForm()
  form.parse(req, async function (err: any, fields: formidable.Fields, files: formidable.Files) {
    const file: File = files.file as File
    const path = resolve(process.cwd(), 'sugar')
    const oldPath = file.filepath
    const newPath = `${path}/config/json/${address}`
    const name = `${address}.json`
    const readJson = fs.readFileSync(oldPath)
    await fs.promises.mkdir(newPath, { recursive: true })
    await fs.promises.writeFile(newPath + '/' + name, readJson, 'utf8')
  })
  return true
}

const postZip = async (req: NextApiRequest, res: NextApiResponse, base64: string, address: string) => {
  const form: IncomingForm = new formidable.IncomingForm()
  form.parse(req, async function (err: any, fields: formidable.Fields, files: formidable.Files) {
    return await uploadFile(files.file as formidable.File, base64, res, address)
  })
}

/**
 * Upload ZIP!
 *
 * @param {formidable.File} file
 * @param {string} pk
 * @param {NextApiResponse} res
 * @param {string} address
 * @return {*}
 */
const uploadFile = async (file: formidable.File, base64: string, res: NextApiResponse, address: string) => {
  try {
    const path = resolve(process.cwd(), 'sugar')
    const name = `${address}.zip`
    const filePath = `${path}/assets/${'compressed'}/${address}/`

    fs.readFile(filePath + name, async (err, data) => {
      if (err) {
        if (err.message.includes('no such file or directory')) {
          await fs.promises.mkdir(filePath, { recursive: true })
          fs.writeFile(filePath + name, base64, async (err) => {
            if (err) {
              return res.status(400).send({ msg: err.message || 'Error!!' } as IUploadErrorResponse)
            }
          })
        } else {
          return res.status(400).send({ msg: err.message || 'Error!!' } as IUploadErrorResponse)
        }
      } else {
        console.log('sini?')
        await fs.promises.mkdir(filePath, { recursive: true })
        fs.writeFile(filePath + name, base64 as string, async (err) => {
          if (err) {
            return res.status(400).send({ msg: err.message || 'Error!!' } as IUploadErrorResponse)
          }
        })
      }
    })
    return res.status(200).send({ file: filePath + name, mime: file.mimetype, _fp: encode({ _p: filePath + name }) } as IUploadResponse)
  } catch (err) {
    return res.status(400).send({ msg: err.message || 'Error!!' } as IUploadErrorResponse)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { pk, address, type, config } = req.query

    if (type === 'file') {
      if (config === 'cache') {
        try {
          const createCache = await uploadCacheFile(req, res, address as string)
          if (createCache) {
            return res.status(200).json({ uploaded: true })
          }
          return res.status(200).json({ uploaded: false })
        } catch (error) {
          return res.status(400).json({ msg: error.message || 'Unknown Error!!' })
        }
      } else if (config === 'cm') {
        try {
          const createCache = await uploadConfigFile(req, res, address as string)
          if (createCache) {
            return res.status(200).json({ uploaded: true })
          }
          return res.status(200).json({ uploaded: false })
        } catch (error) {
          return res.status(400).json({ msg: error.message || 'Unknown Error!!' })
        }
      } else {
        return postZip(req, res, pk as string, address as string)
      }
    } else if (type === 'json') {
      const path = resolve(process.cwd(), 'sugar')
      const name = `${address}.json`
      const child = config === 'config' ? 'config' : 'keypair'
      const filePath = `${path}/${child}/${'json'}/${address}/`

      fs.readFile(filePath + name, 'utf8', async (err, data) => {
        if (err) {
          if (err.message.includes('no such file or directory')) {
            await fs.promises.mkdir(filePath, { recursive: true })
            fs.writeFile(filePath + name, pk as string, 'utf8', async (err) => {
              if (err) {
                throw new Error(err.message)
              }
            })
          } else {
            throw new Error(err.message)
          }
        } else {
          await fs.promises.mkdir(filePath, { recursive: true })
          fs.writeFile(filePath + name, pk as string, 'utf8', async (err) => {
            if (err) {
              throw new Error(err.message)
            }
          })
        }
      })
      return res
        .status(200)
        .send({ file: filePath + name, mime: 'application/json', _fp: encode({ _p: filePath + name }) } as IUploadResponse)
    }
  } else {
    return res.status(405).send('Method not allowed')
  }
}

export default handler
