'use client';

import { getRedditProgram, getRedditProgramId } from '@reddit/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

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

  const accounts = useQuery({
    queryKey: ['reddit', 'all', { cluster }],
    queryFn: () => program.account.reddit.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['reddit', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ reddit: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useRedditProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useRedditProgram();

  const accountQuery = useQuery({
    queryKey: ['reddit', 'fetch', { cluster, account }],
    queryFn: () => program.account.reddit.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['reddit', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ reddit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['reddit', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ reddit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['reddit', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ reddit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['reddit', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ reddit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
