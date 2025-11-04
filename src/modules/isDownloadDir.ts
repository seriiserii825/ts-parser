import chalk from "chalk";

export default function isDownloadDir(): void {
  const cwd = process.cwd();
  // check if is download directory
  const download_dir = "Downloads"
  if (!cwd.includes(download_dir)) {
    console.log(chalk.red(`❌ Please run the script inside your ${download_dir} directory (current directory: ${cwd})`));
    // exit script
    process.exit(0);
  }
}
