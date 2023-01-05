const fs = require("fs");
const archiver = require("archiver");
const chalk = require("chalk");

// 开始进入打包
console.log(chalk.blue.bgGreen("---------- Compress Start ----------"));

// 打包文件
zipApp("Main-App", "MainApp"); // 打包主应用
zipApp("Micro-App", "MicroApp"); // 打包微应用

function zipApp(inName, outName) {
	const archive = archiver("zip", {
		zlib: { level: 9 }, // 设置压缩级别
	});

	// 创建文件输出流
	const output = fs.createWriteStream(__dirname + `/dist/${outName}.zip`);

	// 文件输出流结束
	output.on("close", function () {
		console.log(
			chalk.yellow(
				`${inName} total szie ${archive
					.pointer()
					.toString()
					.replace(/\B(?=(\d{3})+\b)/g, ",")} bytes`
			)
		);
		console.log(chalk.blue.bgGreen(`Archiver compressed ${inName} End`));
	});

	// 数据源是否耗尽
	output.on("end", function () {
		console.log(chalk.red("Data source to exhaust"));
	});

	// 通过管道方法将输出流存档到文件
	archive.pipe(output);

	// 打包dist里面的所有文件和目录
	archive.directory(`dist/${inName}`, false);

	// 打包警告
	archive.on("warning", function (err) {
		if (err.code === "ENOENT") {
			console.log(chalk.bgYellow("Stat failures and other non-blocking errors"));
		} else {
			throw err;
		}
	});

	// 打包错误
	archive.on("error", function (err) {
		throw err;
	});

	// 完成归档
	archive.finalize();
}
