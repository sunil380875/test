const urlExists = require('url-exists');
const { promisify } = require('util');
const { stat, readdir, createReadStream } = require('fs');
const { join, resolve } = require('path');
const _ = require("underscore");
const mongoose = require('mongoose');
// const csvParser = require("csv-parse");
// const Cryptr = require('cryptr');
// const userActivityTimelinesRepo = require('userActivityTimelines/repositories/userActivityTimelines.repository');
// const sequenceModel = require('../modules/sequence/models/sequence.model');

// const cryptr = new Cryptr(process.env['JWT_SECRET'], { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });

let Utils = {
	// readCSV: async (fileName) => {
	// 	const results = [];
	// 	return new Promise((resolve, reject) => {
	// 		let stream = createReadStream(fileName).pipe(csvParser.parse({ delimiter: ',', columns: true }));
	// 		stream.on("error", err => reject(err));
	// 		stream.on("data", data => results.push(data));
	// 		stream.on("end", () => resolve(results));
	// 	});
	// },

	// saveUserActivity: async (body) => {
	// 	try {
	// 		let userId = body['userId'] ? mongoose.Types.ObjectId(body['userId']) : null;
	// 		if (userId) {
	// 			let activityCount = await userActivityTimelinesRepo.getCountByParam({ userId: userId, isDeleted: false });
	// 			if (activityCount && activityCount == 5) { // stores 5 doc atmost
	// 				let firstActivity = await userActivityTimelinesRepo.getAllByFieldWithSortAndLimit({ userId: userId, isDeleted: false }, { createdAt: 1 }, 1);
	// 				if (firstActivity && firstActivity.length) {
	// 					userActivityTimelinesRepo.delete(firstActivity[0]._id);
	// 				}
	// 			}

	// 			await userActivityTimelinesRepo.save(body);
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	} catch (e) {
	// 		console.log(e);
	// 		return false;
	// 	}
	// },

	// handleNameFields: (body) => {
	// 	if (body.first_name && body.last_name) body.fullName = (body.first_name.trim() + ' ' + body.last_name.trim());
	// 	if (body.fullName) {
	// 		let spaces = body.fullName.trim().split(' ');
	// 		if (spaces.length > 1) {
	// 			body.last_name = spaces[spaces.length - 1].trim();
	// 			body.first_name = body.fullName.replace(body.last_name, '').trim();
	// 		} else if (spaces.length) {
	// 			body.first_name = spaces[0].trim();
	// 			body.last_name = "";
	// 		}
	// 	}
	// 	return body;
	// },

	// deleteUserActivity: async (params) => {
	// 	try {
	// 		await userActivityTimelinesRepo.bulkDelete(params);
	// 		return true;
	// 	} catch (e) {
	// 		console.log(e);
	// 		return false;
	// 	}
	// },

	// numFormatter: (numbers) => {
	// 	// Thousand(K), Million(M), Billion(B), Trillion(T), Peta(P), Exa(E)
	// 	const num = Number(numbers);
	// 	const si = [
	// 		{ value: 1, symbol: '' }, // if value < 1000, nothing to do
	// 		{ value: 1E3, symbol: 'k' }, // convert to K for number from > 1000 < 1 million 
	// 		{ value: 1E6, symbol: 'm' }, // convert to M for number from > 1 million 
	// 		{ value: 1E9, symbol: 'B' }, // convert to B for number greater than 1 Billion
	// 		{ value: 1E12, symbol: 'T' }, // convert to T for number greater than 1 Trillion
	// 		//   { value: 1E15, symbol: 'P' }, // convert to P for number greater than 1 Peta
	// 		//   { value: 1E18, symbol: 'E' } // convert to E for number greater than 1 Exa
	// 	];
	// 	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	// 	let i;
	// 	for (i = si.length - 1; i > 0; i--) {
	// 		if (num >= si[i].value) {
	// 			break;
	// 		}
	// 	}
	// 	return (num / si[i].value).toFixed(2).replace(rx, '$1') + ' ' + si[i].symbol;
	// },

	isDirectory: async (f) => {
		return (await promisify(stat)(f)).isDirectory();
	},
	_readdir: async (filePath) => {
		const files = await Promise.all((await promisify(readdir)(filePath)).map(async f => {
			const fullPath = join(filePath, f);
			return (await Utils.isDirectory(fullPath)) ? Utils._readdir(fullPath) : fullPath;
		}))

		return _.flatten(files);
	},

	readDirectory: async (path) => {

		readdir(path, function (err, items) {

		});
	},
	asyncForEach: async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	},
	// inArray: (array, ch) => {
	// 	obj = _.find(array, (obj) => (obj == ch.toString()))
	// 	if (obj != undefined) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// },
	// inArrayObject: (rules, findBy) => {
	// 	const _rules = _.findWhere(rules, findBy);
	// 	if (!_rules) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// },
	// objectKeyByValue: (obj, val) => {
	// 	return Object.entries(obj).find(i => i[1] === val);
	// },
	handleRoutes: async (routeList) => {
		try {
			let routes = Object.keys(routeList);
			let routesArray = routes;
			let routeGroups = [];
			await utils.asyncForEach(routesArray, async (route) => {
				if (route.indexOf('admin.') != -1) {
					let routeGroup = route.split('.')[1];
					routeGroups.push(routeGroup);
				}
			});
			routeGroups = new Set([...routeGroups]);
			const administration = [];
			for (let group of routeGroups) {
				await utils.asyncForEach(routesArray, async (route) => {
					if (route.indexOf(`admin.${group}.`) != -1) {
						const groupTitle = utils.pretifyRouteName(group);
						const permissionsObj = { group: group, groupTitle, route, origRoute: routeList[route], displayName: utils.pretifyRouteName(utils.humanize(route)), pageName: utils.pretifyRouteName(utils.humanize(route)).replace(groupTitle, '').trim() };
						administration.push(permissionsObj)
					}
				});
			}
			const distinctGroups = new Set([..._.pluck(administration, 'group')]);
			const result = [];
			for (let group of distinctGroups) {
				const groupTitle = utils.pretifyRouteName(group);
				const routesData = _.where(administration, { group: group });
				if (routesData && routesData.length > 0) {
					let obj = {};
					obj.group = group;
					obj.groupTitle = groupTitle;
					obj.routeNames = _.pluck(routesData, 'route');
					obj.routes = _.pluck(routesData, 'origRoute');
					obj.displayNames = _.pluck(routesData, 'displayName');
					obj.pageNames = _.pluck(routesData, 'pageName');
					obj.arrayForm = routesData;
					result.push(obj);
				}
			}

			return result;
		} catch (e) {
			// throw e;
			console.log(e);
			return [];
		}
	},
	// humanize: (str) => {
	// 	const frags = str.split('_');
	// 	for (i = 0; i < frags.length; i++) {
	// 		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
	// 	}
	// 	return frags.join(' ');
	// },
	// menuAccess: async (obj, val) => {
	// 	async function isObjectId(value) {
	// 		try {
	// 			let id = mongoose.Types.ObjectId(value);
	// 			if (id) {
	// 				return true;
	// 			} else {
	// 				return false;
	// 			}
	// 		} catch (e) {
	// 			return false;
	// 		}
	// 	}

	// 	start = val.lastIndexOf('/');
	// 	lastIndexValue = val.substring(start).replace('/', '');
	// 	isId = await isObjectId(lastIndexValue);
	// 	if (isId) {
	// 		val = val.substring(0, start) + '/:id';
	// 	}

	// 	return Object.entries(obj).find(i => i[1] === val);
	// },
	// pretifyRouteName: (str) => {
	// 	let frags = str.split('.');
	// 	if (frags[0] == 'Admin') {
	// 		frags.shift();
	// 	}
	// 	for (i = 0; i < frags.length; i++) {
	// 		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
	// 	}
	// 	str = frags.join(' ');
	// 	frags = str.split('-');
	// 	for (i = 0; i < frags.length; i++) {
	// 		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
	// 	}
	// 	str = frags.join(' ');
	// 	frags = str.split('_');
	// 	for (i = 0; i < frags.length; i++) {
	// 		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
	// 	}
	// 	str = frags.join(' ');
	// 	return str.replace('_', ' ');
	// },
	// existsSync: (filePath) => {
	// 	const fullpath = upload_directory + filePath;
	// 	try {
	// 		fs.statSync(fullpath);
	// 	} catch (err) {
	// 		if (err.code == 'ENOENT') return false;
	// 	}
	// 	return true;
	// },
	// toThousands: n => {
	// 	return n.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	// },
	// formatDollar: num => {
	// 	num = Number(num);
	// 	const p = num.toFixed(2).split(".");
	// 	return "$" + p[0].split("").reverse().reduce((acc, num, i) => {
	// 		return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
	// 	}, "") + "." + p[1];
	// },
	// clone: copyobj => {
	// 	try {
	// 		let tmpobj = JSON.stringify(copyobj);
	// 		return JSON.parse(tmpobj);
	// 	} catch (e) {
	// 		return {};
	// 	}
	// },
	// valEmail: email => {
	// 	let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// 	return re.test(email);
	// },
	// safeparse: (jsonString, def) => {
	// 	return Utils.safeParseJson(jsonString, def);
	// },
	// safeParseJson: (jsonString, def) => {
	// 	try {
	// 		let o = JSON.parse(jsonString);
	// 		if (o) {
	// 			return o;
	// 		}
	// 	} catch (e) {
	// 		//winston.error(e.message);
	// 	}
	// 	return def;
	// },
	// evalJSON: jsonString => {
	// 	try {
	// 		//let o = JSON.parse(jsonString);
	// 		let o = JSON.parse(JSON.stringify(jsonString));
	// 		if (o && typeof o === "object") {
	// 			return o;
	// 		}
	// 	} catch (e) { }
	// 	return false;
	// },
	// toObjectId: str => {
	// 	if (typeof str === 'string') {
	// 		return /^[a-f\d]{24}$/i.test(str);
	// 	} else if (Array.isArray(str)) {
	// 		return str.every(arrStr => /^[a-f\d]{24}$/i.test(arrStr));
	// 	}
	// 	return false;
	// },
	// orderNumber: () => {
	// 	let now = Date.now().toString() // '1492341545873'
	// 	// pad with extra random digit
	// 	now += now + Math.floor(Math.random() * 10)
	// 	// format
	// 	return ['ORD', now.slice(0, 14)].join('-')
	// },
	// randomIntFromInterval: (min, max) => {
	// 	return Math.floor(Math.random() * (max - min + 1) + min)
	// },
	// isProductAttribute: (array, ch) => {
	// 	obj = _.filter(array, (obj) => { return obj.attribute_id.toString() == ch.toString() })
	// 	return obj;
	// },
	// isLinkExist: url => {
	// 	return urlExists(url, (err, exists) => (exists ? true : false));
	// },
	// ifBlankThenNA(value) {
	// 	return (typeof value === 'string' && value) ? value : 'NA';
	// },

	// awsFileRemove: async (file) => {
	// 	try {
	// 		return s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET.toString(), Key: file, }).promise();
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// 	return;
	// },

	// awsFolderRemove: async (files) => {
	// 	try {
	// 		return s3.deleteObjects({
	// 			Bucket: process.env.AWS_S3_BUCKET.toString(), Delete: {
	// 				Objects: files
	// 			}
	// 		}).promise()
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// 	return;
	// },

	// awsFolderExist: async (fullpath) => {
	// 	try {
	// 		return await s3.listObjects({ Bucket: process.env.AWS_S3_BUCKET.toString(), Delimiter: '/', Prefix: fullpath + '/' }).promise();
	// 	} catch (e) {
	// 		// console.log(e);
	// 		return null;
	// 	}
	// },

	// getKeyS3KeyUrl(str, to) {
	// 	return str.substr(str.indexOf(to) + 0);
	// },

	// generateAWSFilePath(folder, file) {
	// 	return (folder + '/' + file);
	// },

	// betweenRandomNumber: (min, max) => {
	// 	return Math.floor(
	// 		Math.random() * (max - min + 1) + min
	// 	)
	// },
	// calculateGST(grossAmount) {
	// 	const gstAmount = +((grossAmount / 1.18).toFixed(2));
	// 	return gstAmount;
	// },
	// shuffleArray(array) {
	// 	for (let i = array.length - 1; i > 0; i--) {
	// 		const j = Math.floor(Math.random() * (i + 1));
	// 		[array[i], array[j]] = [array[j], array[i]];
	// 	}
	// },
	// capitalizeWords(str) {
	// 	return str
	// 		.toLowerCase()
	// 		.split(' ')
	// 		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
	// 		.join(' ');
	// },
	// encryptString(value) {
	// 	return cryptr.encrypt(value);
	// },

    // decryptString(value) {
	// 	return cryptr.decrypt(value);
	// },

	// async generateBatchId(courseShortTxt) {
	// 	const sequence = await sequenceModel.findByIdAndUpdate(
	// 		{ _id: 'BATCH_UID' },
	// 		{ $inc: { value: 1 } },
	// 		{ new: true, upsert: true }
	// 	);
	
	// 	if (sequence.value) {
	// 		const now = new Date();
	// 		const day = now.getDate().toString().padStart(2, '0');
	// 		const month = (now.getMonth() + 1).toString().padStart(2, '0');
	// 		const yearShort = now.getFullYear().toString();
	// 		return `WTSB-${courseShortTxt}-${sequence.value.toString().padStart(2, '0')}-${day}${month}${yearShort}`;
	// 	} else {
	// 		throw new Error('Failed To Generate Batch ID!');
	// 	}
	// }

};

module.exports = Utils;
