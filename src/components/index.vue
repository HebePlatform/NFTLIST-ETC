<template>
  <div>
    <div>
      <div style="text-align: center;">
        <el-badge value="Advertising space for sale" class="item">
          <el-image style="height:200px;" :src="'./static/hens.jpeg'"></el-image>
        </el-badge>
      </div>
      <div style="margin: 6px 10px 10px 10px;">
        <el-link type="success">
          {{subname(addr)}}

        </el-link>

      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(item,index) in nftdapp"
                          :key="item.name"
                          :title="item.name" :name="(index+1)">
          <div style="float: left;overflow: hidden" v-for="(items,index) in item.srcList">
            <el-image
              :key="items"
              style="width: 100px; height: 100px;padding-right: 15px;"
              :src="items"
              :preview-src-list="item.srcList">
            </el-image>
            <div style="padding-bottom: 10px;">
             # {{item.indexList[index]}}
            </div>
          </div>

          <div style="text-align: center;color: #909399;" v-if="item.sum==0">
            Unregistered
          </div>

        </el-collapse-item>

      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        nftdapp: require('../global/nftdapp'),
        activeNames: ['1'],
        addr: ''
      };
    },
    methods: {
      subname(txt) {
        if (this.hensname != '') {
          return this.hensname
        }

      },
      async login() {
        if (typeof (ethereum) !== 'undefined') {
          this.addr = await this.$g.etclogin()
          this.addr = '0x1d3437af773ee9984bd9c173ddbc2f4005e0e8dc'
          if (this.addr != '') {
            this.hensname = await this.$g.getNameOfOwner(this.addr)
            this.activeNames = []
            for (let ii = 0; ii < this.nftdapp.length; ii++) {
              this.activeNames.push(ii + 1)
              let item = this.nftdapp[ii]
              let res = await this.$axios.get("https://blockscout.com/etc/mainnet/api?module=account&action=tokenbalance&contractaddress=" + item.contract + "&address=" + this.addr)
              item.sum = res.data.result;
              item.srcList = []
              item.indexList = []

              if (res.data.result != 0) {
                for (let i = 0; i < res.data.result; i++) {
                  let num = await this.$g.getTokenOfOwnerByIndex(this.addr, i, item.contract)
                  let index = num;
                  if (item.contract == "0x28cdE342AC623C1aC3Ba25D0A22fCa385911b57C") {
                    index = (10000 + parseInt(num))
                  }
                  let img = item.img + index + item.type
                  item.indexList.push(index)
                  item.srcList.push(img)
                  if (i == 1) {
                    item.url = img
                  }
                }
              }
            }
          }
        }
      }
    },
    async mounted() {
      let _this = this;

      async function loginweb3() {
        if (typeof (ethereum) !== 'undefined') {
          _this.login()

        } else {

          setTimeout(() => {
            loginweb3()
          }, 1000)
        }
      }

      loginweb3();

    }
  }
</script>

<style>
  .el-collapse-item__header {
    padding-left: 15px;
  }

  .el-collapse-item__content {
    padding-left: 15px;
    padding-right: 15px;

  }

  .el-badge__content.is-fixed {
    top: 20px !important;
    right: 166px !important;
  }

</style>
