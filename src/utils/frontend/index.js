const filterLogins = (logins = [], searchLogin = "") => {
  let filteredLogins = []
  if (!searchLogin.length) {
    filteredLogins = logins
  } else {
    filteredLogins = logins.filter(
      (login) =>
        login.website.includes(searchLogin) ||
        login.username.includes(searchLogin)
    )
  }

  return filteredLogins
}

const getWebsiteName = (fullWebsite = "") => {
  const regex = new RegExp(
    "(?:http(?:s)?\\:\\/\\/(?:www\\.)?)?([\\w\\d\\.\\-\\_]+)",
    "g"
  )
  const matches = regex.exec(fullWebsite)
  return matches?.length > 1 ? matches[1] : ""
}

export { filterLogins, getWebsiteName }
