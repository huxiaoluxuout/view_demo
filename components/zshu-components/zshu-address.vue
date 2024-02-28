<template>

  <view class="">
    <u-popup :show="show" :round="10" mode="bottom" :closeOnClickOverlay="true" @close="show=false">
      <view class="popup-content">
        <view class="popup-top">
          <view class="confirm" @click="popupConfirm">确定</view>

          <view class="title">请选择服务区域</view>
          <view v-if="canSelectAll&&currentActive===5">
            <view class="confirm" @click="selectAll" v-show="isSelectAll">全选</view>
            <view class="confirm" @click="cancelAll" v-show="!isSelectAll">取消全选</view>
          </view>
        </view>

        <view class="address-text" @click="restAddress(1)">
          <view class="province-text" :class="{'active':currentActive>1}">{{ provinceViewText }}</view>
          <u-icon name="arrow-right"></u-icon>
        </view>

        <view class="address-text" v-if="currentActive>=2" @click="restAddress(2)">
          <view class="city-text" :class="{'active':currentActive>2}">{{ cityViewText }}</view>
          <u-icon name="arrow-right"></u-icon>
        </view>

        <view class="address-text" v-if="currentActive>=3" @click="restAddress(3)">
          <view class="area-text" :class="{'active':currentActive>3}">{{ areaViewText }}</view>
          <u-icon name="arrow-right"></u-icon>
        </view>

        <view class="address-text address-border-bottom" v-if="currentActive>=4" @click="restAddress(4)">
          <view class="street-text" :class="{'active':currentActive>4}">
            <text>{{ streetViewText }}</text>
          </view>
          <u-icon name="arrow-right"></u-icon>
        </view>


        <view class="address-data-list" @touch.stop="()=>{}">
          <view class="data-title">{{ dataTitle }}</view>
          <view class="data-item" v-for="item in addressDataList" :key="item.letter">
            <view class="letter">{{ item.letter }}</view>
            <view class="address-list">
              <view hover-class="hover-class" class="view-text" :class="{'active-view-text':viewId(itemText.id)}" v-for="itemText in item.viewText" :key="item.id"
                    @click="chooseItem(itemText)">{{ itemText.text }}
              </view>
            </view>
          </view>
        </view>

      </view>
    </u-popup>

  </view>

</template>

<script>


import {getCityList, getCountyList, getProvinceList, getStreetList} from "@/network/apis/feiying.js"


export default {
  name: "zshu-address",

  props: {

    checkbox: Boolean,
    canSelectAll: Boolean,
  },
  data() {
    return {
      show: false,
      currentActive: 1,
      addressDataList: [],

      province: '',
      city: '',
      area: '',

      provinceID: '',
      cityID: '',
      areaID: '',

      streetIDs: [],

    };
  },

  computed: {

    dataTitle() {
      const titleMapping = {
        '1': '选择省份/地区',
        '2': '选择城市',
        '3': '选择区/县',
        '4': '选择街道/镇',
        '5': '选择街道/镇',
      }

      return titleMapping[this.currentActive]
    },

    provinceViewText() {
      return this.currentActive === 1 ? this.dataTitle : this.province
    },

    cityViewText() {
      return this.currentActive === 2 ? this.dataTitle : this.city
    },

    areaViewText() {
      return this.currentActive === 3 ? this.dataTitle : this.area
    },

    streetViewText() {
      return this.currentActive === 4 ? this.dataTitle : this.street
    },

    street() {
      let streetText = ''
      this.addressDataList.forEach(item => {
        item.viewText.forEach(itemId => {
          const hasId = this.streetIDs.find(ID => itemId.id === ID);
          if (hasId) {
            streetText = streetText + itemId.text + ' '
          }
        })
      })

      return streetText
    },

    len() {
      let num = 0
      this.addressDataList.forEach(v => {
        num += v.viewText.length
      })
      return num
    },
    isSelectAll() {
      return this.streetIDs.length < this.len
    },

    // 街道名称
    streetNames() {
      let streetNames = [];
      this.addressDataList.forEach(address => {
        const itemList = address.viewText;
        itemList.forEach(item => {
          if (this.streetIDs.includes(item.id)) {
            streetNames.push(item.text);
          }
        });
      });
      return streetNames
    },

  },
  created() {
    this.getProvinceListHandler()
  },
  methods: {
    viewId(id) {
      if (this.currentActive === 5) {
        return this.streetIDs.includes(id)
      }
    },

    getArr(dataList, textName) {
      let arr = [];

      dataList.forEach(function (item) {
        // 获取省份名称的首字母并转换为大写
        let firstLetter = item.initial.charAt(0).toUpperCase();
        // 在结果数组中查找是否已存在以该首字母为标识的对象
        let letterObj = arr.find(function (obj) {
          return obj.letter === firstLetter;
        });

        // 如果不存在，则创建一个新的对象，并将其添加到结果数组中
        if (!letterObj) {
          letterObj = {
            letter: firstLetter,
            viewText: []
          };
          arr.push(letterObj);
        }

        let newObj = {
          code: item.code,
          hit: item.hit,
          id: item.id,
          initial: item.initial,
          pinyin: item.pinyin,
          text: item[textName]
        };
        letterObj.viewText.push(newObj);
      });

      arr.sort(function (a, b) {
        return a.letter.localeCompare(b.letter);
      });

      this.addressDataList = arr

    },
    getProvinceListHandler() {
      getProvinceList({}).then(res => {
        this.getArr(res.data, 'province_name')
      })
    },
    getCityListHandler(province_id) {
      getCityList({province_id}).then(res => {
        this.getArr(res.data, 'city_name')
      })

    },
    getCountyListHandler(city_id) {
      getCountyList({city_id}).then(res => {
        this.getArr(res.data, 'county_name')
      })

    },
    getStreetListHandler(county_id) {
      getStreetList({county_id}).then(res => {
        this.getArr(res.data, 'street_name')
      })

    },
    chooseItem(item) {
      if (this.currentActive === 1) {
        this.getCityListHandler(item.id)
        this.provinceID = item.id
        this.province = item.text
        this.currentActive++

      } else if (this.currentActive === 2) {
        this.getCountyListHandler(item.id)
        this.cityID = item.id
        this.city = item.text
        this.currentActive++

      } else if (this.currentActive === 3) {
        this.getStreetListHandler(item.id)
        this.areaID = item.id
        this.area = item.text
        this.currentActive++

      } else if (this.currentActive === 4) {
        this.currentActive++
        this.streetIDs.push(item.id)

      } else if (this.currentActive === 5) {
        if (!this.streetIDs.includes(item.id)) {
          if (this.checkbox) {
            this.streetIDs.push(item.id)

          } else {
            this.streetIDs = [item.id]

          }
        } else {
          this.streetIDs.splice(this.streetIDs.indexOf(item.id), 1)
          if (this.streetIDs.length === 0) {
            this.currentActive = 4
          }
        }

      }
    },

    popupConfirm() {
      if (!this.streetIDs.length) {
        console.error('请选择服务街道')
        return;
      }

      this.show = !(this.currentActive === 5)
      let location = this.province + '/' + this.city + '/' + this.area + '/' + this.street
      this.$emit('updateAddress', {
        provinceID: this.provinceID,
        provinceName: this.province,
        cityID: this.cityID,
        cityName: this.city,
        areaID: this.areaID,
        areaName: this.area,
        streetIDs: this.streetIDs,
        streetNames: this.streetNames,
        location: location,
      })

    },
    selectAll() {

      if (this.currentActive === 5) {
        let streetIDs = [];
        for (let i = 0; i < this.addressDataList.length; i++) {
          for (let j = 0; j < this.addressDataList[i].viewText.length; j++) {
            streetIDs.push(this.addressDataList[i].viewText[j].id);
          }
        }
        this.streetIDs = streetIDs;
      }


    },
    cancelAll() {
      if (this.currentActive === 5) {
        this.streetIDs = []
        this.currentActive = 4

      }
    },

    restAddress(index) {

      if (index === this.currentActive) {
        console.log('空')
      } else {

        if (index === 1) {
          console.log('省')
          this.streetIDs = []
          this.getProvinceListHandler()

        } else if (index === 2) {
          console.log('市')
          this.streetIDs = []

          this.getCityListHandler(this.provinceID)
        } else if (index === 3) {
          console.log('县')
          this.streetIDs = []

          this.getCountyListHandler(this.cityID)

        } else if (index === 4) {
          console.log('街道')
          this.streetIDs = []
          this.getStreetListHandler(this.areaID)

        }
        this.currentActive = index

      }
    },


  }

}
</script>
<style scoped lang="scss">
.popup-content {

  height: 75vh;
  border-radius: 10px 10px 0 0;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .popup-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;

    .title {
      font-size: 16px;
      color: #303033;
      font-weight: bold;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .confirm {
      font-size: 14px;
      color: #616166;
    }

  }


  .address-border-bottom {
    position: relative;
    border-bottom: 1px solid #f1f1f1;
  }

  .address-text:before {
    --translateY: calc(-50% - var(--width));
    position: absolute;
    left: calc(-1 * var(--width));
    bottom: 0;
    transform: translateY(var(--translateY));
    content: '';
    width: 1px;
    height: calc(100% - var(--width));
    background: #33A6FF;

  }

  .address-text {
    --width: 10px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1.5;
    font-size: 14px;
    color: #303033;
    position: relative;
    padding: var(--width) 0;
    margin-left: 15px;
    box-sizing: border-box;

  }

  .province-text:after, .city-text:after, .area-text:after, .street-text:after {
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    color: #33A6FF;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid;
    background-color: transparent;
  }

  .province-text, .city-text, .area-text, .street-text {
    margin-left: 10px;
  }


  .active {
    color: #33A6FF;
  }

  .active:before {
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #33A6FF;
    border: 1px solid;

  }

  .address-text:nth-of-type(2):before {
    background: transparent;
  }

  .address-data-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;

    .data-title {
      font-weight: bold;
      color: #303033;
      padding: 2px 0;
      box-sizing: border-box;

    }

    .content-wrapper {
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .data-item {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .letter {
      font-size: 16px;
      color: #919199;
      padding: 5px 0;

    }

    .address-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .view-text {
        font-size: 16px;
        color: #303033;
        padding: 5px 0;
      }

      .active-view-text {
        color: #33A6FF;
      }

      .hover-class {
        color: #606266;
      }
    }
  }


}

</style>
