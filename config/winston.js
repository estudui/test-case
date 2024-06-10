const appRoot = require('app-root-path')
const winston = require('winston');
require('winston-daily-rotate-file')

const path = require('path')
const PROJECT_ROOT = path.join(__dirname, '..');
const highlight = require('cli-highlight').highlight;
const arrow = '\u276F\u276F\u25B6';
const {combine, timestamp, json, errors, align, printf} = winston.format

const fileRotateTransport = new winston.transports.DailyRotateFile({
	filename: `${appRoot}/logs/combined-%DATE%.log`,
	datePattern: 'YYYY-MM-DD',
	zippedArchive: false,
	maxFiles: '30d'
})

const logger = winston.createLogger({
	level: 'info',
	format: combine(timestamp({
		format: 'YYYY-MM-DD HH:mm:ss.SSS'
	}), errors({stack: true}), json(), align(), printf((info) => `[${info.timestamp}]  [${info.level}]:${info.message}`)),
	transports: [fileRotateTransport]
})

logger.stream = {
	write: function (message) {
		logger.info(message, { meta: { serverLogs: 'server-logs' } });
	},
};

module.exports.debug = module.exports.log = function () {
	logger.debug.apply(logger, formatLogArguments(arguments));
};

module.exports.info = function () {
	logger.info.apply(logger, formatLogArguments(arguments));
};

module.exports.warn = function () {
	logger.warn.apply(logger, formatLogArguments(arguments));
};

module.exports.error = function () {
	logger.error.apply(logger, formatLogArguments(arguments));
};


module.exports.stream = logger.stream;

/**
 * Attempts to add file and line number info to the given log arguments.
 * @param {*} args
 */

function formatLogArguments(args) {
	args = Array.prototype.slice.call(args);
	// console.log('args', args);

	const stackInfo = getStackInfo(1);

	if (stackInfo) {
		// get file path relative to project root
		const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})${arrow}`;
		const calleeStrLogFile = `${stackInfo.relativePath}:${stackInfo.line}`;
		const calleeStrHl = highlight(calleeStr);

		if (typeof args[0] === 'string') {
			console.log(calleeStrHl, args[0]);
			// args[0] = calleeStr + ' ' + args[0];
			// args[0] = `log${arrow} ${args[0]}`;
			args[0] = `[${calleeStrLogFile}] ${args[0]}`;
		} else {
			const logging = highlight('Logging below\u2B07 ');
			console.log(calleeStrHl, logging);
			console.log(JSON.stringify(args, null, 2));
			args.unshift(`[${calleeStrLogFile}] ${JSON.stringify(args)}`);
		}
	}

	return args;
}

/**
 * Parses and returns info about the call stack at the given index.
 */

function getStackInfo(stackIndex) {
	// get call stack, and analyze it
	// get all file, method, and line numbers
	const stacklist = new Error().stack.split('\n').slice(3);

	// stack trace format:
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	// do not remove the regex expresses to outside of this method (due to a BUG in node.js)
	const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
	const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

	const s = stacklist[stackIndex] || stacklist[0];
	const sp = stackReg.exec(s) || stackReg2.exec(s);

	if (sp && sp.length === 5) {
		return {
			method: sp[1],
			relativePath: path.relative(PROJECT_ROOT, sp[2]),
			line: sp[3],
			pos: sp[4],
			file: path.basename(sp[2]),
			stack: stacklist.join('\n'),
		};
	}
}

// module.exports = logger;
