import { compareSync } from "bcrypt"
import { encrypt, decrypt } from "aes256"
import { join } from "path"
import { existsSync, writeFileSync, readFileSync } from "fs"

const hashedPassPhrase = ""
const DB_NAME = "data.json"

const validatePassPhrase = (passPhrase = "") => {
  return compareSync(passPhrase, hashedPassPhrase)
}

const encryptPassword = (passPhrase, plainPassword) => {
  return encrypt(passPhrase, plainPassword)
}

const decryptPassword = (passPhrase, encryptedPassword) => {
  return decrypt(passPhrase, encryptedPassword)
}

const getDBPath = (appPath) => {
  return join(appPath, DB_NAME)
}

const writeDBFile = (dbPath, data) => {
  const optionsWrite = { encoding: "utf-8" }
  data.logins = data.logins.map((entry) => {
    if (entry.id) {
      delete entry.id
    }
    return entry
  })
  writeFileSync(dbPath, JSON.stringify(data), optionsWrite)
}

const readDBFile = (dbPath) => {
  const optionsRead = { encoding: "utf-8" }
  let dbContent = { logins: [] }

  if (!existsSync(dbPath)) {
    writeDBFile(dbPath, dbContent)
  } else {
    try {
      dbContent = JSON.parse(readFileSync(dbPath, optionsRead))
    } catch (_) {
      writeDBFile(dbPath, dbContent)
    }
  }

  return dbContent.logins
}

const readDBLogins = (appPath) => {
  let logins = readDBFile(getDBPath(appPath))
  let id = 0
  logins = logins.map((login) => ({
    ...login,
    id: String(id++),
  }))
  process.data = { logins }
}

const saveNewLogin = (appPath, newLogin) => {
  newLogin.password = encryptPassword(
    process.env.decryptionKey,
    newLogin.password
  )
  process.data.logins = [...process.data.logins, newLogin]
  writeDBFile(getDBPath(appPath), process.data)
}

const deleteLogin = (appPath, loginId) => {
  const logins = process.data.logins
  const loginIndex = logins.findIndex((login) => login.id === loginId)
  if (loginIndex === -1) return
  logins.splice(loginIndex, 1)
  process.data = { logins }
  writeDBFile(getDBPath(appPath), process.data)
}

const updateLogin = (appPath, loginId, newLoginInformation) => {
  const logins = process.data.logins
  const loginIndex = logins.findIndex((login) => login.id === loginId)
  if (loginIndex === -1) return
  newLoginInformation.password = encryptPassword(
    process.env.decryptionKey,
    newLoginInformation.password
  )
  logins[loginIndex] = newLoginInformation
  process.data = { logins }
  writeDBFile(getDBPath(appPath), process.data)
}

export {
  validatePassPhrase,
  encryptPassword,
  decryptPassword,
  readDBLogins,
  saveNewLogin,
  deleteLogin,
  updateLogin,
}
