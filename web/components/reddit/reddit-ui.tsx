'use client';

import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useRedditProgram,
  useRedditProgramAccount,
} from './reddit-data-access';
import { useWallet } from '@solana/wallet-adapter-react';
import { isDate } from 'util/types';
import { timeStamp } from 'console';

export function RedditCreate() {
  const { createPost } = useRedditProgram();
  const { publicKey } = useWallet();
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  const isFormValid = topic.trim() !== '' && content.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createPost.mutateAsync({ topic, content, author: publicKey });
    }
  };

  if (!publicKey){
    return <p>Connect your wallet</p>
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <br></br>
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea textarea-bordered w-full max-w-xs"
      />
      <br></br>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleSubmit}
        disabled={createPost.isPending || !isFormValid}
      >
        Create Reddit Post {createPost.isPending && '...'}
      </button>
    </div>
  );
}


export function RedditList() {
  const { accounts, getProgramAccount } = useRedditProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-left alert alert-info">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid gap-4 md:grid-cols-1">
          {accounts.data?.map((account) => (
            <RedditCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-left">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function RedditCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    updatePost, 
    deletePost
  } = useRedditProgramAccount({ account });
  const { publicKey } = useWallet();
  const [content, setContent] = useState('');
  const topic = accountQuery.data?.topic; 

  const isFormValid = content.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid && topic) {
      updatePost.mutateAsync({ topic, content, author: publicKey });
    }
  };





  if (!publicKey){
    return <p>Connect your wallet</p>
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4">
      <div className="card-body items-left text-left">
        {/* <div className="space-y-2"> */}
        <div className="">
        <div className="flex items-center space-x-2">
            <img className="h-4 md:h-4" alt="solana" src="https://styles.redditmedia.com/t5_hcs2n/styles/communityIcon_j73u48561y681.png" />
            <span>
            <ExplorerLink
                path={`account/${accountQuery.data?.author.toString()}`}
                label={ellipsify(accountQuery.data?.author.toString())}
              />
            </span>
            <sub> 
            {Date(accountQuery.data?.timestamp.toString())} 
            </sub>
          </div>
          
          
          {/* {ellipsify(accountQuery.data?.author.toString())} */}
          {/* {(accountQuery.data?.author.toString())} */}
          
          <h2
            className="card-title justify-left text-xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.topic}
          </h2>
          <p style={{ fontSize: 'small', fontWeight: 100 }}>
          {accountQuery.data?.content}
          </p>  
          <div className="card-actions justify-left">
            <textarea
              placeholder="Update content here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updatePost.isPending || !isFormValid}
            >
              Update Reddit Post {updatePost.isPending && '...'}
            </button>
          </div>
          <div className="text-left space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
              
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                const topic = accountQuery.data?.topic;
                if (topic) {
                  return deletePost.mutateAsync(topic);
                }
              }}
              disabled={deletePost.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
