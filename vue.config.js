const { defineConfig } = require("@vue/cli-service")
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      preload: "public/preload.js",
      outputDir: "release",
      appId: "com.login-manager.login-manager",
      productName: "Login Manager",
      win: {
        target: ["nsis"],
        icon: "public/icon_512x512.png",
        requestedExecutionLevel: "requireAdministrator",
      },
      nsis: {
        installerIcon: "public/icon_512x512.png",
        uninstallerIcon: "public/icon_512x512.png",
        uninstallDisplayName: "Login Manager",
        license: "license.txt",
        oneClick: false,
        allowToChangeInstallationDirectory: true,
      },
    },
  },
})
