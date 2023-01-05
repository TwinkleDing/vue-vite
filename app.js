const cp = require("child_process");
const chalk = require("chalk");
const { resolve } = require("path");
const args = require("minimist")(process.argv.slice(2));

// 压缩脚本路径，一定要用双引号
const script = `"${resolve(__dirname, args.mode === "dev" ? "./pack-dev.sh" : "./pack-build.sh")}"`;

// 执行脚本获取输出流
const pro = cp.exec(script, (error) => {
	if (error) {
		console.error(chalk.red("---------- Build Err ----------"), error);
		return;
	}
});

pro.stdout.pipe(process.stdout);
pro.on("exit", () => {
	console.log(chalk.blue.bgGreen("---------- Build Exit ----------"));
});
