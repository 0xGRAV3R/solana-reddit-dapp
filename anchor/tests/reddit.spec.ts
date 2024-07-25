import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Reddit } from '../target/types/reddit';

describe('reddit', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Reddit as Program<Reddit>;

  const redditKeypair = Keypair.generate();

  it('Initialize Reddit', async () => {
    await program.methods
      .initialize()
      .accounts({
        reddit: redditKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([redditKeypair])
      .rpc();

    const currentCount = await program.account.reddit.fetch(
      redditKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Reddit', async () => {
    await program.methods
      .increment()
      .accounts({ reddit: redditKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.reddit.fetch(
      redditKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Reddit Again', async () => {
    await program.methods
      .increment()
      .accounts({ reddit: redditKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.reddit.fetch(
      redditKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Reddit', async () => {
    await program.methods
      .decrement()
      .accounts({ reddit: redditKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.reddit.fetch(
      redditKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set reddit value', async () => {
    await program.methods
      .set(42)
      .accounts({ reddit: redditKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.reddit.fetch(
      redditKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the reddit account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        reddit: redditKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.reddit.fetchNullable(
      redditKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
