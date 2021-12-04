import { ethers } from "ethers"
import { getContractWithSigner } from "./contract"

export const mintNFT = async (
  walletAddress,
  setMintLoading,
  numbers
) => {

  const contract = getContractWithSigner();

  // contract.on("mintToken(uint256)", (newId) => {
  //   const address = ethers.utils.getAddress(to)
  //   const newMintId = ethers.BigNumber.from(newId).toNumber()

  //   setNewMint([address, newMintId])
  // })

  try {
    let txhash = await contract.mintToken(numbers, {
      value: ethers.BigNumber.from(1e9).mul(
        ethers.BigNumber.from(1e9).mul(314).div(10000).mul(numbers)
      ),
      from: walletAddress,
    })

    let res = await txhash.wait();
    setMintLoading(false);

    if (res.transactionHash) {
      return {
        success: true,
        status: `Successfully minted ${numbers} Mos.`,
      }
    } else {
      return {
        success: false,
        status: "Transaction failed",
      }
    }
  } catch (err) {
    setMintLoading(false)
    return {
      success: false,
      status: err.message,
    }
  }
}


export const mintFeeNFT = async (
  walletAddress,
  setMintLoading,
  numbers
) => {

  const contract = getContractWithSigner();

  // contract.on("mintToken(uint256)", (newId) => {
  //   const address = ethers.utils.getAddress(to)
  //   const newMintId = ethers.BigNumber.from(newId).toNumber()

  //   setNewMint([address, newMintId])
  // })

  try {
    let txhash = await contract.mintToken(numbers, {
      value: ethers.BigNumber.from(1e9).mul(
        ethers.BigNumber.from(1e9).mul(10).div(100).mul(0)
      ),
      from: walletAddress,
    })

    let res = await txhash.wait();
    setMintLoading(false);

    if (res.transactionHash) {
      return {
        success: true,
        status: `Successfully minted ${numbers} Mos.`,
      }
    } else {
      return {
        success: false,
        status: "Transaction failed",
      }
    }
  } catch (err) {
    setMintLoading(false)
    return {
      success: false,
      status: err.message,
    }
  }
}
