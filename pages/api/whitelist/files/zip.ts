/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import { IUploadResponse } from 'interfaces/responses/IUploadsResponse'
import { encode } from 'lib/api/encoder'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'
import unzipper from 'unzipper'

const unzipAndCreateFile = (filePath, name, address): Promise<boolean> =>
  new Promise((res) => {
    try {
      const path = resolve(process.cwd(), 'sugar')
      const outputZipPath = `${path}/${address}/assets/`
      fs.createReadStream(filePath + name)
        .pipe(unzipper.Parse())
        .on('entry', async (entry) => {
          const fileName = `${path}/${address}/assets/${entry.path.split('/')[1]}`
          console.log('creating ==> ', fileName)
          const isImage =
            /[^.]+$/.exec(fileName.substring(fileName.lastIndexOf('.') + 1))[0] === 'png' ||
            /[^.]+$/.exec(fileName.substring(fileName.lastIndexOf('.') + 1))[0] === 'jpeg' ||
            /[^.]+$/.exec(fileName.substring(fileName.lastIndexOf('.') + 1))[0] === 'jpg' ||
            /[^.]+$/.exec(fileName.substring(fileName.lastIndexOf('.') + 1))[0] === 'gif'
          const isJson = /[^.]+$/.exec(fileName.substring(fileName.lastIndexOf('.') + 1))[0] === 'json'
          const isExecutable = isImage || isJson
          if (entry.path.replace('/', '') !== '' && isExecutable) {
            await fs.promises.mkdir(outputZipPath, { recursive: true })
            entry.pipe(fs.createWriteStream(fileName))
          }
        })
      res(true)
    } catch (error) {
      console.error(error, '@errorUnzipAndCreateFile')
      res(false)
    }
  })

const writeFileAsync = (filePath, name, base64): Promise<boolean> =>
  new Promise((res) => {
    try {
      fs.writeFile(filePath + name, base64, 'base64', async (err) => {
        if (err) {
          res(false)
        }
        res(true)
      })
    } catch (error) {
      console.error(error, '@errorWriteFileAsync')
      res(false)
    }
  })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { address } = req.query
    const { base64 } = req.body

    const path = resolve(process.cwd(), 'sugar')
    const name = `${address}.zip`
    const filePath = `${path}/assets/${'compressed'}/${address}/`
    const pathWillRemoved = `${path}/assets`

    // check if exist then delete (no replace)
    const isExist = fs.existsSync(filePath)
    if (isExist) {
      try {
        await fs.promises.rm(filePath + name, { recursive: true, force: true })
        await fs.promises.rmdir(pathWillRemoved, { recursive: true })
      } catch (err) {
        res.status(400).send({ msg: err.message || 'Error Server' })
        res.end()
      }
    }

    // create folder based on the file path
    // using async because if there's no file, the fs will return error
    await fs.promises.mkdir(filePath, { recursive: true })
    return fs.writeFile(filePath + name, base64, 'base64', async function (err) {
      if (err) {
        res.status(400).send({ msg: err.message || 'Error Server' })
        res.end()
      }
      const promiseArray = []
      promiseArray.push(await writeFileAsync(filePath, name, base64), await unzipAndCreateFile(filePath, name, address))
      await Promise.all(promiseArray)

      try {
        // after extract has been complete then delete the zip file
        // ::for the memory usage::
        await fs.promises.rm(filePath + name, { recursive: true, force: true })
        await fs.promises.rmdir(pathWillRemoved, { recursive: true })
        res.status(200).send({ file: filePath + name, mime: 'application/zip' } as IUploadResponse)
        res.end()
      } catch (err) {
        res.status(400).send({ msg: err.message || 'Error Server' })
        res.end()
      }
    })
  } else {
    res.status(405).send('Method not allowed')
    res.end()
  }
}

export default handler
