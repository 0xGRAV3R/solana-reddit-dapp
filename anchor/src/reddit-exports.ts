// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import RedditIDL from '../target/idl/reddit.json';
import type { Reddit } from '../target/types/reddit';

// Re-export the generated IDL and type
export { Reddit, RedditIDL };

// The programId is imported from the program IDL.
export const REDDIT_PROGRAM_ID = new PublicKey(RedditIDL.address);

// This is a helper function to get the Reddit Anchor program.
export function getRedditProgram(provider: AnchorProvider) {
  return new Program(RedditIDL as Reddit, provider);
}

// This is a helper function to get the program ID for the Reddit program depending on the cluster.
export function getRedditProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return REDDIT_PROGRAM_ID;
  }
}
