import { useCallback, useEffect, useState, useRef } from 'react'
import tokens from 'constants/tokens'
import { useChain, useMoralis } from 'react-moralis'
import contracts from 'contracts/swapContract'
import erc20Contract from 'contracts/erc20Contract'
import wrappedContract from 'contracts/wrappedContract'

const IsNative = (address) => address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const IsWrapped = (address) => address === "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";

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
        if (!IsNative(fromToken.address) && !(IsWrapped(fromToken.address) && IsNative(params.toToken.address))) {
          const abi = erc20Contract.abi
          const contract = new web3.eth.Contract(abi, fromToken.address)
          const allowance = await contract.methods.allowance(account, contractInfo.address).call();
          if (Number(allowance) < Number(amount))
            await contract.methods.approve(contractInfo.address, Moralis.Units.Token(fromAmount, 18)).send({ from: account })
        }
        
        if (IsNative(params.fromToken.address)) {
          if (IsWrapped(params.toToken.address)) {
            const abi = wrappedContract.abi
            const contract = new web3.eth.Contract(abi, fromToken.address)
            await contract.methods.deposit().send({ from: account, value: amount })
          } else {
            await contractInstance.current.methods.swapExactETHForTokens(
              1,
              toToken.address,
              account
            ).send({ from: account, value: amount })
          }
        } else if (IsNative(params.toToken.address)) {
          if (IsWrapped(params.fromToken.address)) {
            const abi = wrappedContract.abi
            const contract = new web3.eth.Contract(abi, fromToken.address)
            await contract.methods.withdraw(amount).send({ from: account })
          } else if (params.fromToken.withFee) {
            await contractInstance.current.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
              amount,
              1,
              fromToken.address,
              account,
            ).send({ from: account })
          } else {
            await contractInstance.current.methods.swapExactTokensForETH(
              amount,
              1,
              fromToken.address,
              account,
            ).send({ from: account })
          }
        } else {
          if (params.fromToken.withFee || params.toToken.withFee) {
            const swapFunc =  contractInstance.current.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
              fromToken.address,
              toToken.address,
              amount,
              1,
              account,
            )
              // .send({ from: account })
            const estimateResult = await swapFunc.estimateGas(
              {
                  from: account,
              }
            )
            .then(() => {
              console.log('success')
              return true
            })
            .catch((err) => {
              console.log(err)
              return false
            })
            if (estimateResult) {
              await swapFunc.send({ from: account })
            }
          } else {
            const swapFunc = contractInstance.current.methods.swapExactTokensForTokens(
              fromToken.address,
              toToken.address,
              amount,
              1,
              account,
            )
            const estimateResult = await swapFunc.estimateGas(
              {
                  from: account,
              }
            )
            .then(() => {
              console.log('success')
              return true
            })
            .catch((err) => {
              console.log(err)
              return false
            })
            if (estimateResult) {
              await swapFunc.send({ from: account })
            }
          }
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
