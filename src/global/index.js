const web3Utils = require('web3-utils')
const web3ethabi = require('web3-eth-abi')
const Hsn = '0x03f4a95d964d364614E514e8638d61CDEed4f8D4'
const HsnResolver = '0x30BEF52d5ca70B445994C5Ee238E760342edA66D'

const rpc = 'https://ethercluster.com/etc'
let network = {
  chainId: '0x3d',
  rpcUrls: ['https://www.ethercluster.com/etc'],
  chainName: 'Ethereum Classic',
  nativeCurrency: {name: 'ETC', decimals: 18, symbol: 'ETC'},
  blockExplorerUrls: ['https://blockscout.com/etc/mainnet'],
  iconUrls: ['https://hebe.cc/assets/logo/etc_logo.png', 'https://hebe.cc/assets/logo/etc_logo.png']
}
export default {
  chainName: network.chainName,
  async etclogin() {
    return new Promise(async (resolve, reject) => {
      let addr = await this.getAddr()
      let chainId = await ethereum.request({method: 'eth_chainId'})
      if (chainId != network.chainId) {
        await this.addEthereumChain()
      }
      resolve(addr)
    })
  },
  async addEthereumChain() {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        network
      ]
    })
  },
  async getAddr() {
    return new Promise(async (resolve, reject) => {
      ethereum
        .request({method: 'eth_requestAccounts'})
        .then((res) => {
          resolve(res[0])
        })
        .catch((err) => {
          resolve('')
        })
    })
  },
  async getTokenOfOwnerByIndex(addr, index, to) {
    return new Promise(async (resolve, reject) => {

      if (to == "0x8474D3346441F85668C1dDAB46ff2D1Af1531698") {
        let name = await this.getNameOfOwner(addr)
        let num = await this.getTokenIdOfName(name.split(".etc")[0])
        resolve(num)

      } else {

        let tokenOfOwnerByIndexabi = web3ethabi.encodeFunctionCall({
          name: 'tokenOfOwnerByIndex',
          type: 'function',
          inputs: [{
            type: 'address',
            name: '_owner'
          },
            {
              type: 'uint256',
              name: '_index'
            }]
        }, [addr, index])
        ethereum.request({
          'method': 'eth_call',
          'params': [{
            'to': to,
            'data': tokenOfOwnerByIndexabi
          }, 'latest']
        }).then(async (res) => {
          let num = web3Utils.hexToNumberString(res)
          resolve(num)
        })
          .catch((err) => {
            console.log(err);
            resolve('')
          })
      }
    });
  },
  async getNameOfOwner(addr) {
    return new Promise(async (resolve, reject) => {
      let getNameOfOwnerabi = web3ethabi.encodeFunctionCall({
        name: 'getNameOfOwner',
        type: 'function',
        inputs: [{
          type: 'address',
          name: 'addr_'
        }]
      }, [addr])
      if (typeof (ethereum) !== 'undefined') {

        ethereum.request({
          'method': 'eth_call',
          'params': [{
            'to': Hsn,
            'data': getNameOfOwnerabi
          }, 'latest']
        }).then(async (res) => {
          let tt = web3Utils.hexToString(res)
          resolve(tt.substring(33))
        })
          .catch((err) => {
            resolve('')
          })
      } else {
        let res = await axios.post(rpc, {
          'jsonrpc': '2.0',
          'method': 'eth_call',
          'params': [
            {
              'to': Hsn,
              'data': getNameOfOwnerabi
            },
            'latest'
          ],
          'id': 1
        })
        let tt = web3Utils.hexToString(res.data.result)
        resolve(tt.substring(33))
      }
    })
  },
  async getTokenIdOfName(name) {
    return new Promise(async (resolve, reject) => {
        let getTokenIdOfNameabi = web3ethabi.encodeFunctionCall({
          name: 'getTokenIdOfName',
          type: 'function',
          inputs: [{
            type: 'string',
            name: 'name_'
          }]
        }, [name])
        ethereum.request({
          'method': 'eth_call',
          'params': [{
            'to': Hsn,
            'data': getTokenIdOfNameabi
          }, 'latest']
        }).then(async (res) => {
          if (typeof res !== 'undefined') {
            let tt = web3Utils.hexToNumber(res)
            resolve(tt)
          } else {
            resolve('')
          }
        })
          .catch((err) => {
            resolve('')
          })
      }
    )

  }

}
