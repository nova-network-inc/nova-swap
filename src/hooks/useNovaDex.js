import { useCallback, useEffect, useState, useRef } from 'react'
import tokens from 'constants/tokens'
import { useChain, useMoralis } from 'react-moralis'
import contracts from 'contracts/swapContract'
import erc20Contract from 'contracts/erc20Contract'

const IsNative = (address) => address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const useNovaDex = (chain) => {
  const { web3, isWeb3Enabled, Moralis, account } = useMoralis()
  const { chainId } = useChain()
  const [tokenList, setTokenList] = useState([])
  const contractInstance = useRef()

  const getQuote = useCallback(async (params) => {
    try {
      if (contractInstance.current) {
        let result = null
        if (params.fromToken.address === params.toToken.address) {
          return {
            statusCode: 400,
          }
        } else {
          const toAddress = IsNative(params.toToken.address) ? params.toToken.wrappedAddress: params.toToken.address
          const fromAddress = IsNative(params.fromToken.address) ? params.fromToken.wrappedAddress: params.fromToken.address
          if (toAddress !== fromAddress) {
            result = await contractInstance.current.methods.getAmountOutMin(
              IsNative(params.fromToken.address) ? params.fromToken.wrappedAddress: params.fromToken.address,
              IsNative(params.toToken.address) ? params.toToken.wrappedAddress: params.toToken.address,
              Moralis.Units.Token(params.fromAmount, params.fromToken.decimals).toString()
            )
            .call()
            .catch(() => null)
          } else {
            return {
              statusCode: 200,
              fromTokenAmount: params.fromAmount,
              toTokenAmount: params.fromAmount
            }
          }
        }
        if (result !== null) {
          return {
            statusCode: 200,
            fromTokenAmount: params.fromAmount,
            toTokenAmount: Number(result) / Number(Moralis.Units.Token(1, params.toToken.decimals))
          }
        } else {
          return {
            statusCode: 400,
          }
        }
      } else {
        return 0
      }
    } catch (err) {
      return 0
    }
  }, [contractInstance, Moralis])

  const trySwap = useCallback(async (params) => {
    try {
      const { fromToken, fromAmount, toToken } = params;
      const amount = Moralis.Units.Token(fromAmount, fromToken.decimals).toString();
      const contractInfo = contracts[chain]
      if (contractInstance.current) {
        if (fromToken.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
          const abi = erc20Contract.abi
          const contract = new web3.eth.Contract(abi, fromToken.address)
          await contract.methods.approve(contractInfo.address, Moralis.Units.Token(fromAmount, 18)).send({ from: account })
        }
        
        if (IsNative(params.fromToken.address)) {
          await contractInstance.current.methods.swapExactETHForTokens(
            1,
            toToken.address,
            account
          ).send({ from: account, value: amount })
        } else if (IsNative(params.toToken.address)) {
          await contractInstance.current.methods.swapExactTokensForETH(
            amount,
            1,
            fromToken.address,
            account
          ).send({ from: account })
        } else {
          await contractInstance.current.methods.swapExactTokensForTokens(
            fromToken.address,
            toToken.address,
            amount,
            1,
            account
          ).send({ from: account })
        }
        
      }
    } catch (err) {
      console.log(err.message)
    }
  }, [Moralis.Units, account, chain, web3.eth.Contract])
  
  useEffect(() => {
    if (isWeb3Enabled && web3 && chain) {
      const contract = contracts[chain]
      if (contract) {
        const { abi, address } = contract
        contractInstance.current = new web3.eth.Contract(abi, address)
      }
    }
  }, [contractInstance, isWeb3Enabled, web3, chain])

  useEffect(() => {
    if (chain) {
      const tokenList = tokens[chain]
      if (tokenList) setTokenList(tokenList)
    }
  }, [chain])

  return {
    tokenList,
    getQuote,
    trySwap
  }
}

export default useNovaDex
