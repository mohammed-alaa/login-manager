import { compareSync, hashSync, genSaltSync } from "bcrypt";
import { encrypt, decrypt } from "aes256";
import { join } from "path";
import { existsSync, writeFileSync, readFileSync } from "fs";

const FILE_DATABASE = "data.json";
const FILE_SETTINGS = "settings.json";

const encryptPassPhrase = (passPhrase) => {
	return hashSync(passPhrase, genSaltSync(10));
};

const validatePassPhrase = (passPhrase) => {
	return compareSync(passPhrase, process.appSettings.hashedPassPhrase);
};

const encryptPassword = (passPhrase, plainPassword) => {
	return encrypt(passPhrase, plainPassword);
};

const decryptPassword = (passPhrase, encryptedPassword) => {
	return decrypt(passPhrase, encryptedPassword);
};

const getFilePath = (appPath, file = FILE_DATABASE) => {
	return join(appPath, file);
};

const writeDBFile = (filePath, data) => {
	const optionsWrite = { encoding: "utf-8" };
	writeFileSync(filePath, JSON.stringify(data), optionsWrite);
};

const removeLoginIds = (logins) => {
	return logins.map((entry) => {
		if (entry.id) {
			delete entry.id;
		}
		return entry;
	});
};

const isFileExists = (filePath) => {
	return existsSync(filePath);
};

const readFile = (filePath, defaultContents = null) => {
	const optionsRead = { encoding: "utf-8" };
	let dbContent = { ...defaultContents };

	if (!isFileExists(filePath)) {
		writeDBFile(filePath, dbContent);
		return dbContent;
	} else {
		try {
			dbContent = JSON.parse(readFileSync(filePath, optionsRead));
		} catch (_) {
			writeDBFile(filePath, dbContent);
			return dbContent;
		}
	}

	return dbContent;
};

const readDBLogins = (appPath) => {
	let { logins } = readFile(getFilePath(appPath), { logins: [] });
	let id = 0;
	logins = logins.map((login) => ({
		...login,
		id: String(id++),
	}));
	process.data = { logins };
};

const saveNewLogin = (appPath, newLogin) => {
	newLogin.password = encryptPassword(
		process.env.decryptionKey,
		newLogin.password
	);
	process.data.logins = [...process.data.logins, newLogin];
	process.data.logins = removeLoginIds(process.data.logins);
	writeDBFile(getFilePath(appPath), process.data);
};

const deleteLogin = (appPath, loginId) => {
	const logins = process.data.logins;
	const loginIndex = logins.findIndex((login) => login.id === loginId);
	if (loginIndex === -1) return;
	logins.splice(loginIndex, 1);
	process.data = { logins };
	process.data.logins = removeLoginIds(process.data.logins);
	writeDBFile(getFilePath(appPath), process.data);
};

const updateLogin = (appPath, loginId, newLoginInformation) => {
	const logins = process.data.logins;
	const loginIndex = logins.findIndex((login) => login.id === loginId);
	if (loginIndex === -1) return;
	newLoginInformation.password = encryptPassword(
		process.env.decryptionKey,
		newLoginInformation.password
	);
	logins[loginIndex] = newLoginInformation;
	process.data = { logins };
	process.data.logins = removeLoginIds(process.data.logins);
	writeDBFile(getFilePath(appPath), process.data);
};

const validateInstallation = (appPath) => {
	const settinsFile = getFilePath(appPath, FILE_SETTINGS);
	let loaded = true;
	if (!isFileExists(settinsFile)) loaded = false;

	const defaultContents = {
		hashedPassPhrase: "",
		minimizeOnStartUp: false,
	};

	const contents = readFile(settinsFile, defaultContents);
	if (!contents.hashedPassPhrase) loaded = false;

	process.appSettings = { ...contents, loaded };
};

const createPassPhrase = (appPath, passPhrase) => {
	const settinsFile = getFilePath(appPath, FILE_SETTINGS);
	const hashedPassPhrase = encryptPassPhrase(passPhrase);

	process.appSettings = {
		...process.appSettings,
		hashedPassPhrase,
	};
	delete process.appSettings.loaded;
	writeDBFile(settinsFile, process.appSettings);
	validateInstallation(appPath);
};

const updateSettings = (appPath, newSettings) => {
	const settinsFile = getFilePath(appPath, FILE_SETTINGS);
	process.appSettings = {
		...process.appSettings,
		...newSettings,
	};
	delete process.appSettings.loaded;
	writeDBFile(settinsFile, process.appSettings);
	validateInstallation(appPath);
}

export {
	validatePassPhrase,
	encryptPassword,
	decryptPassword,
	readDBLogins,
	saveNewLogin,
	deleteLogin,
	updateLogin,
	validateInstallation,
	createPassPhrase,
	updateSettings,
};
