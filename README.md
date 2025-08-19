# Aztec Network Starter Repository

A modern Next.js starter template with Aztec Network integration for building privacy-focused web3 applications.

## Overview

This starter repository provides a foundation for developing decentralized applications on Aztec Network, featuring wallet integration for both Azguard and Obsidion wallets, along with a complete example of a private voting contract implementation.

[Checkout complete walkthrough on Youtube](https://www.youtube.com/live/6BviS0dGoEw)

## Features

- **Wallet Integration**: Ready-to-use connections with Azguard and Obsidion wallets
- **Private Voting Contract**: Complete example of a privacy-preserving voting system
- **Modern UI**: Clean, responsive interface built with Shadcn UI components
- **Network Information**: Real-time Aztec Network status display
- **Dark Mode**: Sleek dark theme optimized for developers

## Prerequisites

- Node.js 22+
- NPM, Yarn, or Bun
- Access to Aztec Network (Testnet or Local Sandbox)
- Azguard and/or Obsidion wallet extensions installed in your browser

## Installation

```bash
# Clone the repository
git clone https://github.com/raven-house/aztec-nextjs-starter.git

# Navigate to the project directory
cd aztec-nextjs-starter

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

## Environment Setup

Before running the development server, create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_TESTNET_NODE_URL=https://aztec-alpha-testnet-fullnode.zkv.xyz
NEXT_PUBLIC_APP_MODE=SANDBOX # or TESTNET for testnet deployment
```

## Start Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
bun dev
```

## Contract Setup

Navigate to the voting contract directory before running contract commands:

```bash
cd circuits/voting_contract
```

### Contract Commands

Install all dependencies:

```bash
aztec-nargo build
```

Compile contracts:

```bash
aztec-nargo compile
```

Generate contract artifacts (run from the voting contract directory):

```bash
aztec codegen -o ../../src/artifacts target --force
```

Run test cases (Trixie):

```bash
aztec test
```

## Using the Starter

### Wallet Connection

1. Click the "Connect Wallet" button in the header
2. Select either Azguard or Obsidion wallet
3. Approve the connection request in your wallet

The application stores the connected wallet information in the global context, making it available throughout the application.

### Private Voting Contract Example

The starter includes a complete example of a private voting contract with the following functionalities:

1. **Deploy Contract**: Deploy the EasyPrivateVoting contract to Aztec Network
2. **Register Contract Class**: Register the contract class before deployment if necessary
3. **Cast Vote**: Cast a private vote (encrypted on-chain)
4. **Check Votes**: View the current vote count without revealing individual votes
5. **End Voting**: Finalize the voting process

### Contract Details

The `EasyPrivateVoting` contract demonstrates privacy-preserving voting where:

- Votes are encrypted and private
- Only vote tallies are visible, not individual votes
- Only the admin can end the voting process
- Results are verifiably correct without compromising privacy

<!-- ## Project Structure

└── src/
├── app/ # Next.js pages and layouts
├── artifacts/ # Contract artifacts
├── components/ # React components
│ ├── ui/ # UI components from shadcn
│ └── wallet/ # Wallet-specific components
├── constants/ # Configuration constants
├── contexts/ # React contexts
└── lib/ # Utility functions -->

## Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **Smart Contracts**: Aztec Network, Noir language
- **Wallet Integration**: Azguard and Obsidion wallets
- **UI Components**: Shadcn UI library
- **State Management**: React Context API

## Development Mode

The application can run in two modes:

- **SANDBOX**: For local development (default)
- **TESTNET**: For deploying to Aztec Testnet

Change the `APP_MODE` environment variable to switch between modes.

## Resources

- [Aztec Network Documentation](https://docs.aztec.network/)
- [Noir Language Documentation](https://noir-lang.org/)
- [Obsidion Wallet Documentation](https://docs.obsidion.xyz/)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Resources

1. Obsidion Wallet: https://app.obsidion.xyz/

# Notes

What is Nargo?
Dependency management, package management tool for Noir contracts.
