// // eslint-disable-next-line prettier/prettier
// for (let i = 0; i < _quantity; i++) {
//   const mint = anchor.web3.Keypair.generate()
//   const userAccountTokenAddress = await getAtaForMint(mint.publicKey, payer)[0]

//   const userPayingAccountAddress = candyMachine.state.tokenMint ? await getAtaForMint(candyMachine.state.tokenMint, payer)[0] : payer

//   const candyMachineAddress = candyMachine.id
//   console.log(candyMachineAddress, '@candyMachineAddr')
//   const remainingAccounts = []
//   const signers: anchor.web3.Keypair[] = [mint]
//   const cleanupInstructions = []
//   const instructions = [
//     anchor.web3.SystemProgram.createAccount({
//       fromPubkey: payer,
//       newAccountPubkey: mint.publicKey,
//       space: MintLayout.span,
//       lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
//       programId: TOKEN_PROGRAM_ID
//     }),
//     Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint.publicKey, 0, payer, payer),
//     createAssociatedTokenAccountInstruction(userAccountTokenAddress, payer, payer, mint.publicKey),
//     Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint.publicKey, userAccountTokenAddress, payer, [], 1)
//   ]
//   console.log('@doneWithInstructionsProcess')
//   // civic
//   if (candyMachine.state.gatekeeper) {
//     remainingAccounts.push({
//       pubkey: (await getNetworkToken(payer, candyMachine.state.gatekeeper.gatekeeperNetwork))[0],
//       isWritable: true,
//       isSigner: false
//     })
//     if (candyMachine.state.gatekeeper.expireOnUse) {
//       remainingAccounts.push({
//         pubkey: CIVIC,
//         isWritable: false,
//         isSigner: false
//       })
//       remainingAccounts.push({
//         pubkey: (await getNetworkExpire(candyMachine.state.gatekeeper.gatekeeperNetwork))[0],
//         isWritable: false,
//         isSigner: false
//       })
//     }
//   }
//   console.log('@whitelistProcess')
//   // whitelist
//   if (candyMachine.state.whitelistMintSettings) {
//     const mint = new anchor.web3.PublicKey(candyMachine.state.whitelistMintSettings.mint)
//     const whitelistToken = (await getAtaForMint(mint, payer))[0]
//     remainingAccounts.push({
//       pubkey: whitelistToken,
//       isWritable: true,
//       isSigner: false
//     })
//     if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
//       const whitelistBurnAuthority = anchor.web3.Keypair.generate()
//       remainingAccounts.push({
//         pubkey: mint,
//         isWritable: true,
//         isSigner: false
//       })
//       remainingAccounts.push({
//         pubkey: whitelistBurnAuthority.publicKey,
//         isWritable: false,
//         isSigner: true
//       })
//       signers.push(whitelistBurnAuthority)
//       const exists = await candyMachine.program.provider.connection.getAccountInfo(whitelistToken)
//       if (exists) {
//         instructions.push(Token.createApproveInstruction(TOKEN_PROGRAM_ID, whitelistToken, whitelistBurnAuthority.publicKey, payer, [], 1))
//         cleanupInstructions.push(Token.createRevokeInstruction(TOKEN_PROGRAM_ID, whitelistToken, payer, []))
//       }
//     }
//   }
//   console.log('@splTokenProcess')
//   // spl token
//   if (candyMachine.state.tokenMint) {
//     const transferAuthority = anchor.web3.Keypair.generate()
//     signers.push(transferAuthority)
//     remainingAccounts.push({
//       pubkey: userPayingAccountAddress,
//       isWritable: true,
//       isSigner: false
//     })
//     remainingAccounts.push({
//       pubkey: transferAuthority.publicKey,
//       isWritable: false,
//       isSigner: true
//     })
//     instructions.push(
//       Token.createApproveInstruction(
//         TOKEN_PROGRAM_ID,
//         userPayingAccountAddress,
//         transferAuthority.publicKey,
//         payer,
//         [],
//         candyMachine.state.price.toNumber()
//       )
//     )
//     cleanupInstructions.push(Token.createRevokeInstruction(TOKEN_PROGRAM_ID, userPayingAccountAddress, payer, []))
//   }
//   console.log('@metadata&masterEditionProcess')
//   const metadataAddress = await getMetadata(mint.publicKey)
//   const masterEdition = await getMasterEdition(mint.publicKey)
//   const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(candyMachineAddress)
//   console.log('@pushing the instructions')
//   metadatasAddr.push(metadataAddress)
//   instructions.push(
//     await candyMachine.program.instruction.mintNft(creatorBump, {
//       accounts: {
//         candyMachine: candyMachineAddress,
//         candyMachineCreator,
//         payer,
//         wallet: candyMachine.state.treasury,
//         mint: mint.publicKey,
//         metadata: metadataAddress,
//         masterEdition,
//         mintAuthority: payer,
//         updateAuthority: payer,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//         recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
//         instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY
//       },
//       remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined
//     })
//   )
//   signersMatrix.push(signers)
//   instructionsMatrix.push(instructions)
//   if (cleanupInstructions.length > 0) {
//     instructionsMatrix.push(cleanupInstructions)
//     signersMatrix.push([])
//   }
// }
