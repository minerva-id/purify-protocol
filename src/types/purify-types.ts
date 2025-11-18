// src/types/purify-types.ts
export type Purify = {
  version: "0.1.0";
  name: "purify";
  instructions: [
    {
      name: "initializeVault";
      accounts: [
        // ... sesuaikan dengan contract Purify Anda
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
        // ... sesuaikan dengan contract Purify Anda
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  // ... tambahkan sesuai IDL Purify Anda
};

export const IDL: Purify = {
  version: "0.1.0",
  name: "purify",
  instructions: [
    // ... copy dari target/idl/purify.json
  ]
};