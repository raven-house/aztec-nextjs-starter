import chalk from 'chalk'

export class Logger {
  static success(message: string, data?: any) {
    console.log(chalk.green('✅', message), data || '')
  }

  static info(message: string, data?: any) {
    console.log(chalk.blue('ℹ️', message), data || '')
  }

  static warning(message: string, data?: any) {
    console.log(chalk.yellow('⚠️', message), data || '')
  }

  static error(message: string, data?: any) {
    console.log(chalk.red('❌', message), data || '')
  }

  static step(message: string) {
    console.log(chalk.cyan('🔄', message))
  }

  static header(message: string) {
    console.log('\n' + chalk.bold.magenta('=' + '='.repeat(message.length + 2) + '='))
    console.log(chalk.bold.magenta('|', message, '|'))
    console.log(chalk.bold.magenta('=' + '='.repeat(message.length + 2) + '=') + '\n')
  }

  static separator() {
    console.log(chalk.gray('-'.repeat(60)))
  }
}
