# login-manager
Store all your website logins in one place

## Project 
Install NPM modules

```
npm install
```

Go to src/utils/backend.js and update the pass phrase with a bcrypt hashed phrase
```js
const hashedPassPhrase = ""
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```