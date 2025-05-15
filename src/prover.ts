import { UltraHonkBackend } from '@aztec/bb.js'
import { Noir } from '@noir-lang/noir_js'

import initNoirC from '@noir-lang/noirc_abi'
import initACVM from '@noir-lang/acvm_js'
// import acvm from '@noir-lang/acvm_js/web/acvm_js_bg.wasm?.url'
// import noirc from '@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url'
// await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))])

// const chessCircuit = await import('../circuit/target/circuit.json')
// const backend = new UltraHonkBackend(chessCircuit.bytecode, {
//   threads: navigator.hardwareConcurrency,
// })
// @ts-ignore
// const noir = new Noir(chessCircuit)

// codegen/index.ts file taken from fog_of_war_chess library
import {
  assign_initial_territories,
  initialize_game_state,
  initialize_player_state,
} from './codegen/index'

export async function initGameState() {
  try {
    let gameState = await initialize_game_state('2')
    let updatedState = await assign_initial_territories(gameState, '2', '1333')
    let p1_id = 1
    let p2_id = 2
    let p1_encrypt_secret = Math.floor(Math.random() * 100000000000)
    let p1_mask_secret = Math.floor(Math.random() * 100000000000)
    let p2_encrypt_secret = Math.floor(Math.random() * 100000000000)
    let p2_mask_secret = Math.floor(Math.random() * 100000000000)

    let player1_state = initialize_player_state(
      String(p1_id),
      String(p1_encrypt_secret),
      String(p1_mask_secret)
    )
    let player2_state = initialize_player_state(
      String(p2_id),
      String(p2_encrypt_secret),
      String(p2_mask_secret)
    )

    return updatedState
  } catch (e) {
    console.log('error? ', e)
  }
}
