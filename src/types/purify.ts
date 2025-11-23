// src/types/purify.ts
export type Purify = {
  "version": "0.1.0";
  "name": "purify";
  "instructions": [
    {
      "name": "initializeVault";
      "docs": [
        "Initialize a new recycling vault for a specific token"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "Vault state account (PDA)"
          ];
        },
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
          "docs": [
            "The token mint this vault is for"
          ];
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
          "docs": [
            "The vault authority (creator)"
          ];
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "metadataUri";
          "type": "string";
          "docs": [
            "Optional metadata URI for the vault"
          ];
        }
      ];
    },
    {
      "name": "depositToVault";
      "docs": [
        "Deposit tokens into the vault"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "depositor";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "depositorAta";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "Depositor's token account"
          ];
        },
        {
          "name": "vaultAta";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "Vault's token account (PDA)"
          ];
        },
        {
          "name": "vaultAuthority";
          "isMut": false;
          "isSigner": false;
          "docs": [
            "Vault authority (PDA)"
          ];
        },
        {
          "name": "userContribution";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "User contribution tracker (PDA)"
          ];
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "associatedTokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "amount";
          "type": "u64";
        }
      ];
    },
    {
      "name": "burnFromVault";
      "docs": [
        "Burn tokens from the vault and track contribution"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
          "docs": [
            "User burning the tokens"
          ];
        },
        {
          "name": "vaultAta";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "vaultAuthority";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "userContribution";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "amount";
          "type": "u64";
        }
      ];
    },
    {
      "name": "mintCertificate";
      "docs": [
        "Mint a recycling certificate NFT"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "userContribution";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "certificateMint";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "Certificate NFT mint"
          ];
        },
        {
          "name": "certificateMetadata";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "Certificate metadata account"
          ];
        },
        {
          "name": "certificateTokenAccount";
          "isMut": true;
          "isSigner": false;
          "docs": [
            "User's certificate token account"
          ];
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
          "docs": [
            "User minting the certificate"
          ];
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "associatedTokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenMetadataProgram";
          "isMut": false;
          "isSigner": false;
          "docs": [
            "Metaplex Token Metadata Program"
          ];
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "rent";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "name";
          "type": "string";
          "docs": [
            "Certificate name"
          ];
        },
        {
          "name": "symbol";
          "type": "string";
          "docs": [
            "Certificate symbol"
          ];
        },
        {
          "name": "uri";
          "type": "string";
          "docs": [
            "Certificate metadata URI"
          ];
        }
      ];
    },
    {
      "name": "updateVaultMetadata";
      "docs": [
        "Update vault metadata"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
        }
      ];
      "args": [
        {
          "name": "metadataUri";
          "type": "string";
        }
      ];
    },
    {
      "name": "closeVault";
      "docs": [
        "Close vault and reclaim rent"
      ];
      "accounts": [
        {
          "name": "vaultState";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [];
    }
  ];
  "accounts": [
    {
      "name": "VaultState";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "mint";
            "type": "publicKey";
            "docs": [
              "The token mint this vault manages"
            ];
          },
          {
            "name": "authority";
            "type": "publicKey";
            "docs": [
              "Vault authority"
            ];
          },
          {
            "name": "totalDeposited";
            "type": "u64";
            "docs": [
              "Total tokens deposited"
            ];
          },
          {
            "name": "totalBurned";
            "type": "u64";
            "docs": [
              "Total tokens burned"
            ];
          },
          {
            "name": "status";
            "type": {
              "defined": "VaultStatus"
            };
            "docs": [
              "Vault status"
            ];
          },
          {
            "name": "metadataUri";
            "type": "string";
            "docs": [
              "Vault metadata URI"
            ];
          },
          {
            "name": "createdAt";
            "type": "i64";
            "docs": [
              "Vault creation timestamp"
            ];
          },
          {
            "name": "bump";
            "type": "u8";
            "docs": [
              "PDA bump"
            ];
          }
        ];
      };
    },
    {
      "name": "UserContribution";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "user";
            "type": "publicKey";
            "docs": [
              "User public key"
            ];
          },
          {
            "name": "mint";
            "type": "publicKey";
            "docs": [
              "Token mint"
            ];
          },
          {
            "name": "amountDeposited";
            "type": "u64";
            "docs": [
              "Total deposited by user"
            ];
          },
          {
            "name": "amountBurned";
            "type": "u64";
            "docs": [
              "Total burned by user"
            ];
          },
          {
            "name": "lastUpdated";
            "type": "i64";
            "docs": [
              "Last update timestamp"
            ];
          },
          {
            "name": "bump";
            "type": "u8";
            "docs": [
              "PDA bump"
            ];
          }
        ];
      };
    }
  ];
  "types": [
    {
      "name": "VaultStatus";
      "type": {
        "kind": "enum";
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Closed"
          }
        ];
      };
    }
  ];
  "events": [
    {
      "name": "VaultInitialized";
      "fields": [
        {
          "name": "mint";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "authority";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "vaultState";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "timestamp";
          "type": "i64";
          "index": false;
        }
      ];
    },
    {
      "name": "TokensDeposited";
      "fields": [
        {
          "name": "mint";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "depositor";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "amount";
          "type": "u64";
          "index": false;
        },
        {
          "name": "timestamp";
          "type": "i64";
          "index": false;
        }
      ];
    },
    {
      "name": "TokensBurned";
      "fields": [
        {
          "name": "mint";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "user";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "amount";
          "type": "u64";
          "index": false;
        },
        {
          "name": "timestamp";
          "type": "i64";
          "index": false;
        }
      ];
    },
    {
      "name": "CertificateMinted";
      "fields": [
        {
          "name": "mint";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "user";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "amount";
          "type": "u64";
          "index": false;
        },
        {
          "name": "certificateMint";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "timestamp";
          "type": "i64";
          "index": false;
        }
      ];
    }
  ];
  "errors": [
    {
      "code": 6000;
      "name": "InsufficientVaultBalance";
      "msg": "Insufficient tokens in vault";
    },
    {
      "code": 6001;
      "name": "VaultNotActive";
      "msg": "Vault is not active";
    },
    {
      "code": 6002;
      "name": "Unauthorized";
      "msg": "Unauthorized access";
    },
    {
      "code": 6003;
      "name": "InvalidAmount";
      "msg": "Invalid amount";
    },
    {
      "code": 6004;
      "name": "InsufficientContribution";
      "msg": "Insufficient contribution for certificate";
    },
    {
      "code": 6005;
      "name": "VaultNotEmpty";
      "msg": "Cannot close vault with remaining tokens";
    },
    {
      "code": 6006;
      "name": "MetadataTooLong";
      "msg": "Metadata URI too long";
    }
  ];
};

export const IDL: Purify = {
  "version": "0.1.0",
  "name": "purify",
  "instructions": [
    {
      "name": "initializeVault",
      "docs": [
        "Initialize a new recycling vault for a specific token"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Vault state account (PDA)"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token mint this vault is for"
          ]
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The vault authority (creator)"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadataUri",
          "type": "string",
          "docs": [
            "Optional metadata URI for the vault"
          ]
        }
      ]
    },
    {
      "name": "depositToVault",
      "docs": [
        "Deposit tokens into the vault"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "depositor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "depositorAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Depositor's token account"
          ]
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Vault's token account (PDA)"
          ]
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Vault authority (PDA)"
          ]
        },
        {
          "name": "userContribution",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "User contribution tracker (PDA)"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "burnFromVault",
      "docs": [
        "Burn tokens from the vault and track contribution"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "User burning the tokens"
          ]
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userContribution",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintCertificate",
      "docs": [
        "Mint a recycling certificate NFT"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userContribution",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "certificateMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Certificate NFT mint"
          ]
        },
        {
          "name": "certificateMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Certificate metadata account"
          ]
        },
        {
          "name": "certificateTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "User's certificate token account"
          ]
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "User minting the certificate"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Metaplex Token Metadata Program"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string",
          "docs": [
            "Certificate name"
          ]
        },
        {
          "name": "symbol",
          "type": "string",
          "docs": [
            "Certificate symbol"
          ]
        },
        {
          "name": "uri",
          "type": "string",
          "docs": [
            "Certificate metadata URI"
          ]
        }
      ]
    },
    {
      "name": "updateVaultMetadata",
      "docs": [
        "Update vault metadata"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeVault",
      "docs": [
        "Close vault and reclaim rent"
      ],
      "accounts": [
        {
          "name": "vaultState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "VaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey",
            "docs": [
              "The token mint this vault manages"
            ]
          },
          {
            "name": "authority",
            "type": "publicKey",
            "docs": [
              "Vault authority"
            ]
          },
          {
            "name": "totalDeposited",
            "type": "u64",
            "docs": [
              "Total tokens deposited"
            ]
          },
          {
            "name": "totalBurned",
            "type": "u64",
            "docs": [
              "Total tokens burned"
            ]
          },
          {
            "name": "status",
            "type": {
              "defined": "VaultStatus"
            },
            "docs": [
              "Vault status"
            ]
          },
          {
            "name": "metadataUri",
            "type": "string",
            "docs": [
              "Vault metadata URI"
            ]
          },
          {
            "name": "createdAt",
            "type": "i64",
            "docs": [
              "Vault creation timestamp"
            ]
          },
          {
            "name": "bump",
            "type": "u8",
            "docs": [
              "PDA bump"
            ]
          }
        ]
      }
    },
    {
      "name": "UserContribution",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey",
            "docs": [
              "User public key"
            ]
          },
          {
            "name": "mint",
            "type": "publicKey",
            "docs": [
              "Token mint"
            ]
          },
          {
            "name": "amountDeposited",
            "type": "u64",
            "docs": [
              "Total deposited by user"
            ]
          },
          {
            "name": "amountBurned",
            "type": "u64",
            "docs": [
              "Total burned by user"
            ]
          },
          {
            "name": "lastUpdated",
            "type": "i64",
            "docs": [
              "Last update timestamp"
            ]
          },
          {
            "name": "bump",
            "type": "u8",
            "docs": [
              "PDA bump"
            ]
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "VaultStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Closed"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "VaultInitialized",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vaultState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "TokensDeposited",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "depositor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "TokensBurned",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CertificateMinted",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "certificateMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientVaultBalance",
      "msg": "Insufficient tokens in vault"
    },
    {
      "code": 6001,
      "name": "VaultNotActive",
      "msg": "Vault is not active"
    },
    {
      "code": 6002,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6004,
      "name": "InsufficientContribution",
      "msg": "Insufficient contribution for certificate"
    },
    {
      "code": 6005,
      "name": "VaultNotEmpty",
      "msg": "Cannot close vault with remaining tokens"
    },
    {
      "code": 6006,
      "name": "MetadataTooLong",
      "msg": "Metadata URI too long"
    }
  ]
} as Purify;