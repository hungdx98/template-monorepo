import { type MarketInfo } from '@wallet/core'
import get from 'lodash/get'
import size from 'lodash/size'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from '../store/slices/user'
import { type IEmitBalance, type IEventMessageSocket, MESSAGE_SOCKET_TYPE } from '../types'

let socket: Socket
let socketInfo: Socket

const useSocket = () => {
  const authentication = useUserStore.getState().authentication
  //@ts-ignore
  const activeWallet = useAppSelector.getState().walletData

  const activeSocket = () => {
    try {
      if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
      }

      socket = io('wss://superwallet-markets.coin98.tech', {
        transports: ['websocket'],
        extraHeaders: {
          'User-Agent': 'coin98'
        }
      })

      socket.emit('authentication', authentication)

      socket.on('connect', onConnect)
      socket.on('disconnect', activeSocket)
      socket.on('message', onMessage)
    } catch (error) {
      // Retries after 1s
      setTimeout(activeSocket, 500)
    }
  }

  const activeSocketInfo = () => {
    try {
      if (socketInfo) {
        socketInfo.removeAllListeners()
        socketInfo.disconnect()
      }
      socketInfo = io('wss://superwallet-markets.coin98.tech', {
        transports: ['websocket']
      })
      socketInfo.on('connect', async () => {
        // Get default token list;
        // dispatch(refreshDefaultToken())
      })
      socketInfo.on('disconnect', activeSocketInfo)
    } catch (error) {
      setTimeout(activeSocketInfo, 500)
    }
  }

  const active = () => {
    activeSocket()
    activeSocketInfo()
  }

  const onConnect = () => {
    // socket.emit('authentication', authentication)
  }

  const onMessage = (event: IEventMessageSocket) => {
    if (!event) return
    const { data, type } = event
    switch (type) {
      case MESSAGE_SOCKET_TYPE.ASSET_BALANCE: {
        const address = get(data, 'address')
        if (!address) return
        const chain = get(data, 'chain')

        const findWallet = activeWallet.wallets.find(w => w.address === address && w.meta.chain === chain)
        if (!findWallet) return
        break
      }
      default:
        break
    }
  }

  const emitBalances = (data: IEmitBalance) => {
    try {
      socket.emit('message', {
        type: MESSAGE_SOCKET_TYPE.ASSET_BALANCE,
        data
      })
    } catch (error) {
    }
  }

  const emitCoinMarket = async (id: string): Promise<MarketInfo> => {
    return new Promise(resolve => {
      if (size(id) === 0) {
        // @ts-expect-error
        return resolve(true)
      }

      setTimeout(() => {
        const findItem = coinGecko.find(item => item.id === id)
        resolve(findItem)
      }, 1000)

      socketInfo.emit('marketInfo', id, data => {
        let defaultData = {
          circulating_supply: '0',
          current_price: '0',
          id,
          market_cap: '0',
          price_change_percentage_24h: '0',
          total_supply: '0',
          total_volume: '0'
        }
        if (data) {
          try {
            defaultData = typeof data === 'string' ? JSON.parse(data) : data
          } catch (error) {

          }
          return resolve(defaultData)
        } else {
          return resolve(defaultData)
        }
      })
    })
  }

  const emitCoinMarketBySymbol = async (symbol: string): Promise<MarketInfo> => {
    return new Promise(resolve => {
      if (size(symbol) === 0) {
        // @ts-expect-error
        return resolve(true)
      }

      socketInfo.emit('marketSearch', String(symbol).toLowerCase(), data => {
        return resolve(data)
      })
    })
  }

  const emitGasPrice = (chain: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)

      socketInfo.emit('gas_price', chain, gas => {
        resolve(gas)
      })
    })
  }

  return {
    active,
    // emit socket service
    emitBalances,
    // emit socket info
    emitCoinMarket,
    emitGasPrice,
    emitCoinMarketBySymbol
  }
}

export default useSocket;