import { Noir } from '@noir-lang/noir_js'
import { UltraHonkBackend } from '@aztec/bb.js'

let noirProgram: any = null
let backend: any = null

export async function loadCircuit(circuitUrl: string): Promise<void> {
  try {
    console.log(`Attempting to load circuit from: ${circuitUrl}`)

    // Fetch the pre-compiled circuit
    const response = await fetch(circuitUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch circuit: ${response.status} ${response.statusText}`)
    }

    // Parse the response as JSON
    const circuitData = await response.json()
    console.log('Loaded circuit as JSON')

    try {
      // Create a circuit instance using the parsed JSON
      console.log('Creating Noir instance...')
      noirProgram = new Noir(circuitData)

      console.log('Creating UltraHonkBackend instance...')
      // For the backend, we need to pass the bytecode
      backend = new UltraHonkBackend(circuitData.bytecode)

      console.log('Circuit loaded successfully')
      return
    } catch (error) {
      console.error('Error initializing circuit:', error)
      throw error
    }
  } catch (error) {
    console.error(`Failed to load circuit from ${circuitUrl}:`, error)
    throw error
  }
}

/**
 * Check if the circuit is loaded
 */
export function isCircuitLoaded(): boolean {
  return noirProgram !== null && backend !== null
}

export async function generateProof(age: number): Promise<{
  proof: any
  isValid: boolean
}> {
  if (!noirProgram || !backend) {
    throw new Error('Circuit not loaded. Call loadCircuit first.')
  }

  try {
    // Generate witness
    const { witness } = await noirProgram.execute({ age })

    // Generate proof
    const proof = await backend.generateProof(witness)

    // Verify proof
    const isValid = await backend.verifyProof(proof)

    return { proof, isValid }
  } catch (error) {
    console.error('Failed to generate or verify proof:', error)
    throw error
  }
}
