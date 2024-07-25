/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/reddit.json`.
 */
export type Reddit = {
  "address": "DDJ6SXRJSnWamYPFuHaMaUDhUEfN5D2ztiFCxLKcbb9k",
  "metadata": {
    "name": "reddit",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createRedditPost",
      "discriminator": [
        236,
        157,
        150,
        194,
        229,
        131,
        185,
        124
      ],
      "accounts": [
        {
          "name": "redditPost",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "topic"
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "topic",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteRedditPost",
      "discriminator": [
        39,
        129,
        26,
        213,
        115,
        83,
        164,
        95
      ],
      "accounts": [
        {
          "name": "redditPost",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "topic"
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateRedditPost",
      "discriminator": [
        80,
        111,
        70,
        84,
        247,
        217,
        19,
        62
      ],
      "accounts": [
        {
          "name": "redditPost",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "topic"
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "topic",
          "type": "string"
        },
        {
          "name": "newContent",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "redditPostState",
      "discriminator": [
        129,
        138,
        128,
        198,
        233,
        207,
        104,
        156
      ]
    }
  ],
  "types": [
    {
      "name": "redditPostState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
