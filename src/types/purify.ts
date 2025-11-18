// src/types/purify.ts
export type Purify = {
  version: "0.1.0";
  name: "purify";
  instructions: [
    {
      name: "initializeVault";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "vaultName";
          type: "string";
        }
      ];
    },
    {
      name: "depositTokens";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "burnTokens";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "mintCertificate";
      accounts: [
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "certificate";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "metadata";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "totalDeposited";
            type: "u64";
          },
          {
            name: "totalBurned";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "certificate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "vault";
            type: "publicKey";
          },
          {
            name: "user";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "metadata";
            type: "string";
          },
          {
            name: "mintedAt";
            type: "i64";
          }
        ];
      };
    }
  ];
};

export const IDL: Purify = {
  version: "0.1.0",
  name: "purify",
  instructions: [
    {
      name: "initializeVault",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "vaultName",
          type: "string"
        }
      ]
    },
    {
      name: "depositTokens",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: true
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "burnTokens",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: true
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "mintCertificate",
      accounts: [
        {
          name: "vault",
          isMut: false,
          isSigner: false
        },
        {
          name: "certificate",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "metadata",
          type: "string"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "vault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "totalDeposited",
            type: "u64"
          },
          {
            name: "totalBurned",
            type: "u64"
          },
          {
            name: "bump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "certificate",
      type: {
        kind: "struct",
        fields: [
          {
            name: "vault",
            type: "publicKey"
          },
          {
            name: "user",
            type: "publicKey"
          },
          {
            name: "amount",
            type: "u64"
          },
          {
            name: "metadata",
            type: "string"
          },
          {
            name: "mintedAt",
            type: "i64"
          }
        ]
      }
    }
  ]
};