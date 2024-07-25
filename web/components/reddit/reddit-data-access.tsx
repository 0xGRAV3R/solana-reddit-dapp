'use client';

import { getRedditProgram, getRedditProgramId } from '@reddit/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

interface CreateEntryArgs {
  author: PublicKey,
  topic: string,
  content: string,
  timestam: number,
};


export function useRedditProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getRedditProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getRedditProgram(provider);

  /* Query from state */
  const accounts = useQuery({
    queryKey: ['reddit', 'all', { cluster }],
    queryFn: () => program.account.redditPostState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  /* Create entry */
  const createPost = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['redditPost', 'create', { cluster }],
    mutationFn: async ({ topic, content, author}) => {
      const [redditPostAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(topic), author.toBuffer()],
        programId,
      );

      return program.methods
      .createRedditPost(topic, content)
      .accounts({
        redditPost: redditPostAddress,
      })
      .rpc();
    },
    onSuccess: signature => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create relay entry: ${error.message}`);
    },    
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createPost,
  };
}

export function useRedditProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { programId, program, accounts } = useRedditProgram();

  const accountQuery = useQuery({
    queryKey: ['reddit', 'fetch', { cluster, account }],
    queryFn: () => program.account.redditPostState.fetch(account),
  });

  /* Update entry */
  const updatePost = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['redditPost', 'update', { cluster }],
    mutationFn: async ({topic, content, author}) => {
      const [redditPostAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(topic), author.toBuffer()],
        programId,
      );

      return program.methods
      .updateRedditPost(topic, content)
      .accounts({
        redditPost: redditPostAddress
      })
      .rpc();
    },  

    onSuccess: signature => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create relay entry: ${error.message}`);
    },  
  });

  const deletePost = useMutation({
    mutationKey: ['redditPost', 'close', { cluster, account }],
    mutationFn: (topic: string) =>
      program.methods
      .deleteRedditPost(topic)
      .accounts({ 
        redditPost: account 
      })
      .rpc(),
      
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  

  return {
    accountQuery,
    updatePost,
    deletePost,
  };
}
